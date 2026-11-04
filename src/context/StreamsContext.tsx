import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from 'react';
import {
  CategorySummary,
  FilterState,
  NormalizedStream,
  SortOption,
  StatusFilter,
} from '../types/sports';
import { fetchStreamsApi, getStoredApiCache } from '../services/api';
import { normalizeApiResponse } from '../utils/streamNormalizer';

interface StreamsContextValue {
  streams: NormalizedStream[];
  categories: CategorySummary[];
  filteredStreams: NormalizedStream[];
  featuredStream: NormalizedStream | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  filterState: FilterState;
  refresh: (force?: boolean) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  getStreamById: (idOrUri: string) => NormalizedStream | undefined;
}

const StreamsContext = createContext<StreamsContextValue | undefined>(undefined);

const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  statusFilter: 'all',
  sortBy: 'default',
};

// Retrieve any cached data synchronously on initial script evaluation
// to enable instantaneous rendering without waiting for network round-trips
function getInitialData() {
  const cached = getStoredApiCache();
  if (cached && cached.data) {
    const normalized = normalizeApiResponse(cached.data);
    return {
      streams: normalized.streams,
      categories: normalized.categories,
      lastUpdated: new Date(cached.cachedAt),
      hasCache: normalized.streams.length > 0,
    };
  }
  return {
    streams: [],
    categories: [],
    lastUpdated: null,
    hasCache: false,
  };
}

export const StreamsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initial = useMemo(() => getInitialData(), []);

  const [streams, setStreams] = useState<NormalizedStream[]>(initial.streams);
  const [categories, setCategories] = useState<CategorySummary[]>(initial.categories);
  // If we have valid cached data, we are NOT blocking with isLoading=true; we show cached data immediately!
  const [isLoading, setIsLoading] = useState<boolean>(!initial.hasCache);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(initial.hasCache);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(initial.lastUpdated);
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);

  // References for request coordination and cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const streamsRef = useRef<NormalizedStream[]>(streams);
  streamsRef.current = streams;

  // Core fetch function
  const loadStreams = useCallback(async (isInitial = false, force = false) => {
    // Prevent overlapping simultaneous requests
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const hasExistingData = streamsRef.current.length > 0;

    if (isInitial && !hasExistingData) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const data = await fetchStreamsApi({
        signal: controller.signal,
        forceRefresh: force,
      });

      const normalized = normalizeApiResponse(data);
      if (normalized.streams.length > 0 || streamsRef.current.length === 0) {
        setStreams(normalized.streams);
        setCategories(normalized.categories);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Ignored unmount / cancel
        return;
      }
      const message =
        err instanceof Error ? err.message : 'Failed to retrieve sports streams';
      
      // If we don't have any streams in memory or cache, show the error state
      if (streamsRef.current.length === 0) {
        setError(message);
      } else {
        // If we have cached/current events, keep them and do not overwrite or block
        console.warn('Background refresh encountered error; retaining current events:', message);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial load immediately upon website load + 60-second periodic auto-refresh
  useEffect(() => {
    // 1. Fire initial fetch immediately when the website loads
    loadStreams(true, false);

    // 2. Set up the 60-second auto-refresh interval
    const intervalId = setInterval(() => {
      // Only perform background refresh if the browser tab/document is active
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        loadStreams(false, true);
      }
    }, 60000); // exactly 60 seconds
    refreshTimerRef.current = intervalId;

    // 3. When tab becomes visible again, refresh if data might be stale
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadStreams(false, false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. Clean up timers, abort in-flight requests, and remove listeners on unmount
    return () => {
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadStreams]);

  // Filter handlers
  const setSearchQuery = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSelectedCategory = useCallback((category: string) => {
    setFilterState((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const setStatusFilter = useCallback((status: StatusFilter) => {
    setFilterState((prev) => ({ ...prev, statusFilter: status }));
  }, []);

  const setSortBy = useCallback((sort: SortOption) => {
    setFilterState((prev) => ({ ...prev, sortBy: sort }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(INITIAL_FILTER_STATE);
  }, []);

  // Quick lookup by ID or uriName
  const getStreamById = useCallback(
    (idOrUri: string): NormalizedStream | undefined => {
      const target = decodeURIComponent(idOrUri).toLowerCase().trim();
      return streams.find(
        (s) =>
          s.id.toLowerCase() === target ||
          s.uriName.toLowerCase() === target ||
          String(s.numericId) === target
      );
    },
    [streams]
  );

  // Compute filtered and sorted streams with high performance memoization
  const filteredStreams = useMemo(() => {
    let result = [...streams];

    // 1. Category Filter
    if (filterState.selectedCategory !== 'all') {
      const selected = filterState.selectedCategory.toLowerCase();
      result = result.filter(
        (s) => s.category.toLowerCase() === selected
      );
    }

    // 2. Status Filter
    if (filterState.statusFilter !== 'all') {
      if (filterState.statusFilter === 'live') {
        result = result.filter((s) => s.status === 'live');
      } else if (filterState.statusFilter === 'upcoming') {
        result = result.filter((s) => s.status === 'upcoming');
      } else if (filterState.statusFilter === 'always_live') {
        result = result.filter((s) => s.status === 'always_live');
      }
    }

    // 3. Search query filter
    const query = filterState.searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((s) => {
        const matchName = s.name.toLowerCase().includes(query);
        const matchCategory = s.category.toLowerCase().includes(query);
        const matchTag = s.tag.toLowerCase().includes(query);
        const matchSource = s.sourceTag.toLowerCase().includes(query);
        const matchSubstreams = s.substreams.some((sub) =>
          (sub.name || '').toLowerCase().includes(query) ||
          (sub.source_tag || '').toLowerCase().includes(query) ||
          (sub.tag || '').toLowerCase().includes(query)
        );
        return matchName || matchCategory || matchTag || matchSource || matchSubstreams;
      });
    }

    // 4. Sorting
    switch (filterState.sortBy) {
      case 'upcoming_first':
        result.sort((a, b) => {
          if (a.startsAt && b.startsAt) {
            return a.startsAt - b.startsAt;
          }
          if (a.startsAt) return -1;
          if (b.startsAt) return 1;
          return 0;
        });
        break;
      case 'viewers_desc':
        result.sort((a, b) => b.viewers - a.viewers);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'default':
      default:
        result.sort((a, b) => {
          const priority: Record<string, number> = {
            live: 1,
            upcoming: 2,
            always_live: 3,
            unknown: 4,
            ended: 5,
          };
          const pA = priority[a.status] || 99;
          const pB = priority[b.status] || 99;
          if (pA !== pB) return pA - pB;
          return b.viewers - a.viewers;
        });
        break;
    }

    return result;
  }, [streams, filterState]);

  // Select featured marquee event from actual API streams
  const featuredStream = useMemo(() => {
    if (streams.length === 0) return null;

    const liveMatches = streams.filter(
      (s) => s.status === 'live' && !s.alwaysLive && s.poster
    );
    if (liveMatches.length > 0) {
      liveMatches.sort((a, b) => b.viewers - a.viewers);
      return liveMatches[0];
    }

    const upcomingWithPoster = streams.filter(
      (s) => s.status === 'upcoming' && s.poster
    );
    if (upcomingWithPoster.length > 0) {
      upcomingWithPoster.sort((a, b) => (a.startsAt || 0) - (b.startsAt || 0));
      return upcomingWithPoster[0];
    }

    const anyWithPoster = streams.filter((s) => Boolean(s.poster));
    if (anyWithPoster.length > 0) {
      anyWithPoster.sort((a, b) => b.viewers - a.viewers);
      return anyWithPoster[0];
    }

    return streams[0] || null;
  }, [streams]);

  const value: StreamsContextValue = {
    streams,
    categories,
    filteredStreams,
    featuredStream,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    filterState,
    refresh: () => loadStreams(false, true),
    setSearchQuery,
    setSelectedCategory,
    setStatusFilter,
    setSortBy,
    resetFilters,
    getStreamById,
  };

  return <StreamsContext.Provider value={value}>{children}</StreamsContext.Provider>;
};

export const useStreams = (): StreamsContextValue => {
  const context = useContext(StreamsContext);
  if (!context) {
    throw new Error('useStreams must be used within a StreamsProvider');
  }
  return context;
};
