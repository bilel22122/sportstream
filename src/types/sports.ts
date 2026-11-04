// Raw API types matching PPV.st API responses

export interface ApiSubstream {
  id: number | string;
  name?: string;
  tag?: string;
  source_tag?: string;
  uri_name?: string;
  locale?: string;
  iframe?: string;
  [key: string]: unknown;
}

export interface ApiStream {
  id: number | string;
  name: string;
  tag?: string;
  source_tag?: string;
  poster?: string | null;
  blurhash?: string;
  colors?: string[];
  uri_name?: string;
  starts_at?: number;
  ends_at?: number;
  always_live?: boolean | number;
  locale?: string;
  category_name?: string;
  iframe?: string;
  substreams?: ApiSubstream[];
  viewers?: string | number;
  [key: string]: unknown;
}

export interface ApiStreamCategory {
  id: number;
  category: string;
  always_live?: boolean | number;
  streams?: ApiStream[];
  [key: string]: unknown;
}

export interface ApiResponse {
  success: boolean;
  timestamp?: number;
  performance?: number;
  READ_ME?: string;
  streams?: ApiStreamCategory[];
  [key: string]: unknown;
}

export interface PingResponse {
  success: boolean;
  domains?: string[];
  status?: Array<{
    id?: string;
    content?: string;
    content_plain?: string;
    [key: string]: unknown;
  }>;
}

// Normalized application models

export type StreamStatus = 'live' | 'upcoming' | 'always_live' | 'ended' | 'unknown';

export interface StreamFeed {
  id: string;
  name: string;
  sourceTag: string;
  tag: string;
  uriName: string;
  locale: string;
  iframeUrl: string | null;
  isMainFeed: boolean;
  quality?: 'HD' | 'SD' | '4K' | 'Unknown';
}

export interface NormalizedStream {
  id: string;
  numericId: number;
  name: string;
  category: string;
  categoryId: number;
  tag: string;
  sourceTag: string;
  poster: string | null;
  colors: string[];
  uriName: string;
  startsAt: number | null; // Timestamp in milliseconds, or null
  endsAt: number | null;   // Timestamp in milliseconds, or null
  rawStartsAt: number;
  rawEndsAt: number;
  alwaysLive: boolean;
  status: StreamStatus;
  statusText: string;
  locale: string;
  iframeUrl: string | null;
  viewers: number;
  substreams: ApiSubstream[];
  feeds: StreamFeed[];
}

export interface CategorySummary {
  id: number;
  name: string;
  count: number;
  alwaysLiveCategory: boolean;
}

export type StatusFilter = 'all' | 'live' | 'upcoming' | 'always_live';
export type SortOption = 'default' | 'upcoming_first' | 'viewers_desc' | 'alphabetical';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string; // 'all' or category name
  statusFilter: StatusFilter;
  sortBy: SortOption;
}
