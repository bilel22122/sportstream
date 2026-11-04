import { ApiResponse, PingResponse } from '../types/sports';

const PRIMARY_API_URL = 'https://api.ppv.st/api/streams';
const PRIMARY_PING_URL = 'https://api.ppv.st/api/ping';
const PROXY_API_URL = '/api-proxy/streams';
const PROXY_PING_URL = '/api-proxy/ping';

const STORAGE_CACHE_KEY = 'sportstream_api_cache_v2';
const MEMORY_CACHE_FRESH_MS = 25 * 1000; // 25s for in-memory freshness
const STORAGE_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes max age for stale-while-revalidate

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

let inMemoryCache: CacheEntry<ApiResponse> | null = null;
let inFlightPromise: Promise<ApiResponse> | null = null;
let backupDomains: string[] = [];

/**
 * Safely persists API data to browser storage for instant rendering on page load
 */
function saveToStorage(data: ApiResponse): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const entry: CacheEntry<ApiResponse> = {
      data,
      cachedAt: Date.now(),
    };
    window.localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Gracefully ignore storage quota errors or disabled storage
  }
}

/**
 * Safely retrieves cached API response from browser storage
 */
export function getStoredApiCache(): { data: ApiResponse; cachedAt: number } | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEntry<ApiResponse>;
    if (!parsed || typeof parsed !== 'object' || !parsed.data || !Array.isArray(parsed.data.streams)) {
      return null;
    }

    // Check if within acceptable stale-while-revalidate age
    const age = Date.now() - (parsed.cachedAt || 0);
    if (age > STORAGE_MAX_AGE_MS) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Returns currently available cached data (memory first, then storage)
 * for immediate non-blocking rendering.
 */
export function getCachedStreamsApi(): ApiResponse | null {
  if (inMemoryCache && inMemoryCache.data) {
    return inMemoryCache.data;
  }
  const stored = getStoredApiCache();
  if (stored) {
    inMemoryCache = stored;
    return stored.data;
  }
  return null;
}

/**
 * Discovers backup domains from the ping endpoint
 */
export async function fetchBackupDomains(signal?: AbortSignal): Promise<string[]> {
  if (backupDomains.length > 0) return backupDomains;

  const tryUrls = [PRIMARY_PING_URL, PROXY_PING_URL];
  for (const url of tryUrls) {
    try {
      const response = await fetch(url, {
        signal,
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const pingData: PingResponse = await response.json();
        if (Array.isArray(pingData.domains)) {
          backupDomains = pingData.domains.filter(
            (d) => typeof d === 'string' && /^ppv[s]?\.[a-z]{2,3}$/i.test(d)
          );
          return backupDomains;
        }
      }
    } catch {
      // Continue to next ping URL
    }
  }
  return [];
}

/**
 * Fetches streams from the primary endpoint, trying direct browser request first,
 * then local proxy, then validated backup domains if necessary.
 * Avoids duplicate in-flight requests and updates both memory and storage caches.
 */
export async function fetchStreamsApi(options?: {
  signal?: AbortSignal;
  forceRefresh?: boolean;
}): Promise<ApiResponse> {
  const { signal, forceRefresh = false } = options || {};

  // If not forcing refresh and memory cache is fresh, return immediately
  if (!forceRefresh && inMemoryCache) {
    const age = Date.now() - inMemoryCache.cachedAt;
    if (age < MEMORY_CACHE_FRESH_MS) {
      return inMemoryCache.data;
    }
  }

  // Prevent overlapping concurrent requests - reuse existing in-flight promise
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    const candidateUrls: string[] = [PRIMARY_API_URL, PROXY_API_URL];

    // If backup domains are available, append them as additional fallbacks
    if (backupDomains.length > 0) {
      for (const domain of backupDomains.slice(0, 2)) {
        candidateUrls.push(`https://${domain}/api/streams`);
      }
    }

    let lastError: Error | null = null;

    for (const url of candidateUrls) {
      if (signal?.aborted) {
        throw new DOMException('Request aborted by user/unmount', 'AbortError');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const combinedSignal = signal
          ? anySignal([signal, controller.signal])
          : controller.signal;

        const response = await fetch(url, {
          method: 'GET',
          signal: combinedSignal,
          headers: {
            Accept: 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate basic structure
        if (typeof data !== 'object' || data === null || !Array.isArray(data.streams)) {
          throw new Error('Received invalid or non-array streams payload');
        }

        // Cache successful response in memory and storage
        const entry: CacheEntry<ApiResponse> = {
          data: data as ApiResponse,
          cachedAt: Date.now(),
        };
        inMemoryCache = entry;
        saveToStorage(data as ApiResponse);

        // Fetch backup domains in background if not yet loaded
        if (backupDomains.length === 0) {
          fetchBackupDomains().catch(() => {});
        }

        return data as ApiResponse;
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof DOMException && err.name === 'AbortError' && signal?.aborted) {
          throw err;
        }
        lastError = err instanceof Error ? err : new Error(String(err));
        // Fall through to next candidate URL
      }
    }

    throw (
      lastError ||
      new Error('Unable to connect to PPV.st streams API. Please verify your connection.')
    );
  })().finally(() => {
    inFlightPromise = null;
  });

  return inFlightPromise;
}

/**
 * Helper to combine abort signals for environments that lack AbortSignal.any
 */
function anySignal(signals: AbortSignal[]): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && 'any' in AbortSignal && typeof AbortSignal.any === 'function') {
    return AbortSignal.any(signals);
  }
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      return controller.signal;
    }
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return controller.signal;
}

/**
 * Clears both in-memory and persistent storage caches
 */
export function clearStreamsCache(): void {
  inMemoryCache = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_CACHE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}
