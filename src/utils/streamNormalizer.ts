import {
  ApiResponse,
  ApiStream,
  CategorySummary,
  NormalizedStream,
  StreamFeed,
} from '../types/sports';
import { determineStreamStatus, parseUnixTimestamp } from './dateUtils';
import { validateEmbedUrl } from './embedUtils';
import { sanitizePosterUrl } from './imageUtils';

/**
 * Extracts quality label from source tag or name (e.g., HD, SD, 4K)
 */
function detectQuality(sourceTag?: string, name?: string): 'HD' | 'SD' | '4K' | 'Unknown' {
  const combined = `${sourceTag || ''} ${name || ''}`.toUpperCase();
  if (combined.includes('4K') || combined.includes('UHD')) return '4K';
  if (combined.includes('HD') || combined.includes('720P') || combined.includes('1080P')) return 'HD';
  if (combined.includes('SD') || combined.includes('540P') || combined.includes('480P') || combined.includes('360P')) return 'SD';
  return 'Unknown';
}

/**
 * Normalizes a single stream and its substreams
 */
export function normalizeStream(raw: ApiStream, categoryName: string, categoryId: number): NormalizedStream {
  const numericId = typeof raw.id === 'number' ? raw.id : parseInt(String(raw.id), 10) || 0;
  const idStr = String(raw.id ?? raw.uri_name ?? Math.random().toString(36).substring(2, 9));

  const startMs = parseUnixTimestamp(raw.starts_at);
  const endMs = parseUnixTimestamp(raw.ends_at);

  const { status, statusText } = determineStreamStatus(
    raw.starts_at,
    raw.ends_at,
    raw.always_live,
    categoryName,
    raw.tag
  );

  const embedValidation = validateEmbedUrl(raw.iframe);
  const mainIframeUrl = embedValidation.isValid ? embedValidation.sanitizedUrl : null;

  // Build the list of all feeds: Main feed + substream feeds
  const feeds: StreamFeed[] = [];

  // Main Feed
  feeds.push({
    id: `main-${idStr}`,
    name: raw.name || 'Main Broadcast',
    sourceTag: raw.source_tag || 'Official Feed',
    tag: raw.tag || categoryName,
    uriName: raw.uri_name || idStr,
    locale: raw.locale || 'en',
    iframeUrl: mainIframeUrl,
    isMainFeed: true,
    quality: detectQuality(raw.source_tag, raw.name),
  });

  // Substream feeds
  if (Array.isArray(raw.substreams)) {
    raw.substreams.forEach((sub, index) => {
      if (!sub) return;
      const subEmbedValidation = validateEmbedUrl(sub.iframe);
      const subIframeUrl = subEmbedValidation.isValid ? subEmbedValidation.sanitizedUrl : null;
      const subId = String(sub.id ?? `sub-${index}`);

      feeds.push({
        id: subId,
        name: sub.name || `${raw.name} (Alt Feed ${index + 1})`,
        sourceTag: sub.source_tag || `Feed ${index + 2}`,
        tag: sub.tag || raw.tag || categoryName,
        uriName: sub.uri_name || `${raw.uri_name || idStr}-feed-${index + 1}`,
        locale: sub.locale || raw.locale || 'en',
        iframeUrl: subIframeUrl,
        isMainFeed: false,
        quality: detectQuality(sub.source_tag, sub.name),
      });
    });
  }

  // Parse viewer count safely
  let viewersCount = 0;
  if (raw.viewers !== undefined && raw.viewers !== null) {
    const parsed = typeof raw.viewers === 'number' ? raw.viewers : parseInt(String(raw.viewers), 10);
    if (!isNaN(parsed) && parsed >= 0) {
      viewersCount = parsed;
    }
  }

  // Handle colors array
  const colors: string[] = [];
  if (Array.isArray(raw.colors)) {
    raw.colors.forEach((c) => {
      if (typeof c === 'string' && c.startsWith('#')) {
        colors.push(c);
      }
    });
  }

  const isAlwaysLive = Boolean(
    raw.always_live === 1 ||
    raw.always_live === true ||
    (categoryName && categoryName.toLowerCase().includes('24/7')) ||
    (raw.tag && raw.tag.toLowerCase().includes('24/7'))
  );

  return {
    id: idStr,
    numericId,
    name: raw.name || 'Untitled Stream',
    category: categoryName || 'Sports',
    categoryId,
    tag: raw.tag || '',
    sourceTag: raw.source_tag || '',
    poster: sanitizePosterUrl(raw.poster),
    colors,
    uriName: raw.uri_name || idStr,
    startsAt: startMs,
    endsAt: endMs,
    rawStartsAt: typeof raw.starts_at === 'number' ? raw.starts_at : 0,
    rawEndsAt: typeof raw.ends_at === 'number' ? raw.ends_at : 0,
    alwaysLive: isAlwaysLive,
    status,
    statusText,
    locale: raw.locale || 'en',
    iframeUrl: mainIframeUrl,
    viewers: viewersCount,
    substreams: Array.isArray(raw.substreams) ? raw.substreams : [],
    feeds,
  };
}

/**
 * Normalizes the full API response into flat streams list and category summaries
 */
export function normalizeApiResponse(data: ApiResponse | null | undefined): {
  streams: NormalizedStream[];
  categories: CategorySummary[];
  timestamp: number | null;
} {
  if (!data || !Array.isArray(data.streams)) {
    return { streams: [], categories: [], timestamp: null };
  }

  const allStreams: NormalizedStream[] = [];
  const categories: CategorySummary[] = [];

  for (const cat of data.streams) {
    if (!cat || typeof cat !== 'object') continue;

    const catName = cat.category || 'Other';
    const catId = typeof cat.id === 'number' ? cat.id : 0;
    const catStreams = Array.isArray(cat.streams) ? cat.streams : [];

    let count = 0;
    for (const s of catStreams) {
      if (!s || typeof s !== 'object') continue;
      const normalized = normalizeStream(s, catName, catId);
      allStreams.push(normalized);
      count++;
    }

    categories.push({
      id: catId,
      name: catName,
      count,
      alwaysLiveCategory: Boolean(cat.always_live),
    });
  }

  // Sort categories by event count descending, keeping 24/7 streams clean
  categories.sort((a, b) => b.count - a.count);

  return {
    streams: allStreams,
    categories,
    timestamp: parseUnixTimestamp(data.timestamp),
  };
}
