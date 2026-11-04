import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';
import {
  getCachedStreamsApi,
  getStoredApiCache,
  clearStreamsCache,
  fetchStreamsApi,
} from '../../services/api';
import { ApiResponse } from '../../types/sports';

// Lightweight localStorage mock for Node test environment
const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (k: string) => storageMap.get(k) ?? null,
  setItem: (k: string, v: string) => storageMap.set(k, String(v)),
  removeItem: (k: string) => storageMap.delete(k),
  clear: () => storageMap.clear(),
};

const originalWindow = (globalThis as unknown as { window?: unknown }).window;
(globalThis as unknown as { window: unknown }).window = {
  localStorage: mockLocalStorage,
};

describe('API caching and performance optimization tests', () => {
  beforeEach(() => {
    clearStreamsCache();
    mockLocalStorage.clear();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    if (originalWindow === undefined) {
      delete (globalThis as unknown as { window?: unknown }).window;
    } else {
      (globalThis as unknown as { window: unknown }).window = originalWindow;
    }
  });

  const sampleApiResponse: ApiResponse = {
    success: true,
    timestamp: 1793538590,
    streams: [
      {
        id: 34,
        category: 'Football',
        always_live: false,
        streams: [
          {
            id: 1,
            name: 'Arsenal vs. Chelsea',
            starts_at: 1793560000,
            ends_at: 1793570000,
            always_live: 0,
            viewers: 500,
          },
        ],
      },
    ],
  };

  it('returns null when no cache is stored', () => {
    expect(getStoredApiCache()).toBeNull();
    expect(getCachedStreamsApi()).toBeNull();
  });

  it('safely handles corrupted JSON in localStorage without throwing', () => {
    mockLocalStorage.setItem('sportstream_api_cache_v2', 'invalid-json-{[(');
    expect(getStoredApiCache()).toBeNull();
  });

  it('stores and retrieves cached data across sessions', () => {
    const entry = {
      data: sampleApiResponse,
      cachedAt: Date.now(),
    };
    mockLocalStorage.setItem('sportstream_api_cache_v2', JSON.stringify(entry));

    const retrieved = getStoredApiCache();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.data.success).toBe(true);
    expect(retrieved?.data.streams?.[0].category).toBe('Football');
  });

  it('ignores stale cache older than maximum age', () => {
    const expiredEntry = {
      data: sampleApiResponse,
      cachedAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago (max is 15 min)
    };
    mockLocalStorage.setItem('sportstream_api_cache_v2', JSON.stringify(expiredEntry));

    expect(getStoredApiCache()).toBeNull();
  });

  it('deduplicates simultaneous concurrent API requests', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (info) => {
      const url = String(info);
      if (url.includes('ping')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, domains: ['ppv.tj'] }),
        } as unknown as Response;
      }
      return {
        ok: true,
        status: 200,
        json: async () => sampleApiResponse,
      } as unknown as Response;
    });

    // Call fetchStreamsApi twice concurrently
    const [res1, res2] = await Promise.all([
      fetchStreamsApi({ forceRefresh: true }),
      fetchStreamsApi({ forceRefresh: true }),
    ]);

    expect(res1.success).toBe(true);
    expect(res2.success).toBe(true);

    // Filter calls for streams endpoint
    const streamCalls = fetchSpy.mock.calls.filter((call) =>
      String(call[0]).includes('/api/streams') || String(call[0]).includes('api-proxy/streams')
    );
    expect(streamCalls).toHaveLength(1);
  });
});
