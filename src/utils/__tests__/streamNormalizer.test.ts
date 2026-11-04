import { describe, it, expect } from 'vitest';
import { normalizeApiResponse, normalizeStream } from '../streamNormalizer';
import { ApiResponse } from '../../types/sports';

describe('streamNormalizer scenarios', () => {
  // Scenario 1: The API returns valid data
  it('Scenario 1: correctly normalizes valid API streams and categories', () => {
    const mockData: ApiResponse = {
      success: true,
      timestamp: 1793538590,
      streams: [
        {
          id: 37,
          category: 'Basketball',
          always_live: false,
          streams: [
            {
              id: 31432,
              name: 'Boston Celtics vs. Orlando Magic',
              tag: 'NBA',
              source_tag: 'HD | NBA League Pass',
              poster: 'https://example.com/poster.jpg',
              uri_name: 'celtics-magic',
              starts_at: 1793565000,
              ends_at: 1793575800,
              always_live: 0,
              locale: 'en',
              viewers: '124',
              iframe: 'https://taifood-blog.asia/embed/nba-game',
              substreams: [
                {
                  id: 1031432,
                  name: 'Boston Celtics vs. Orlando Magic',
                  tag: 'NBA',
                  uri_name: 'celtics-magic-sd',
                  source_tag: 'SD | NBA League Pass',
                  locale: 'en',
                  iframe: 'https://taifood-blog.asia/embed/nba-game-sd',
                },
              ],
            },
          ],
        },
      ],
    };

    const result = normalizeApiResponse(mockData);
    expect(result.streams).toHaveLength(1);
    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].name).toBe('Basketball');
    expect(result.categories[0].count).toBe(1);

    const stream = result.streams[0];
    expect(stream.name).toBe('Boston Celtics vs. Orlando Magic');
    expect(stream.viewers).toBe(124);
    expect(stream.feeds).toHaveLength(2); // Main feed + 1 substream
    expect(stream.feeds[0].isMainFeed).toBe(true);
    expect(stream.feeds[1].isMainFeed).toBe(false);
  });

  // Scenario 2: The API returns an empty streams array
  it('Scenario 2: safely handles empty streams array', () => {
    const mockData: ApiResponse = {
      success: true,
      timestamp: 1793538590,
      streams: [],
    };
    const result = normalizeApiResponse(mockData);
    expect(result.streams).toHaveLength(0);
    expect(result.categories).toHaveLength(0);
  });

  // Scenario 6: A category has no events
  it('Scenario 6: handles category with empty streams array', () => {
    const mockData: ApiResponse = {
      success: true,
      timestamp: 1793538590,
      streams: [
        {
          id: 99,
          category: 'Tennis',
          always_live: false,
          streams: [],
        },
      ],
    };
    const result = normalizeApiResponse(mockData);
    expect(result.streams).toHaveLength(0);
    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].name).toBe('Tennis');
    expect(result.categories[0].count).toBe(0);
  });

  // Scenario 7: A stream has no start time (0 or negative)
  it('Scenario 7: safely handles stream with missing or zero start time without inventing fake schedule', () => {
    const raw = {
      id: 999,
      name: 'Channel with no schedule',
      starts_at: 0,
      ends_at: 0,
      always_live: 0,
    };
    const stream = normalizeStream(raw, 'Other', 1);
    expect(stream.startsAt).toBeNull();
    expect(stream.endsAt).toBeNull();
    expect(stream.status).toBe('unknown');
    expect(stream.statusText).toBe('On Air');
  });

  // Scenario 8: A stream has no iframe
  it('Scenario 8: handles stream with no iframe safely', () => {
    const raw = {
      id: 123,
      name: 'Stream without iframe',
      iframe: undefined,
    };
    const stream = normalizeStream(raw, 'Football', 1);
    expect(stream.iframeUrl).toBeNull();
    expect(stream.feeds[0].iframeUrl).toBeNull();
  });

  // Scenario 9: A stream has substreams
  it('Scenario 9: preserves distinction between parent stream and substreams', () => {
    const raw = {
      id: 500,
      name: 'Formula 1 Grand Prix',
      source_tag: 'HD | Sky Sports F1',
      iframe: 'https://taifood-blog.asia/embed/f1-hd',
      substreams: [
        {
          id: 501,
          name: 'Formula 1 Grand Prix (Italian)',
          source_tag: 'HD | Sky Sport F1 IT',
          locale: 'it',
          iframe: 'https://taifood-blog.asia/embed/f1-it',
        },
        {
          id: 502,
          name: 'Formula 1 Grand Prix (Spanish)',
          source_tag: 'SD | DAZN F1',
          locale: 'es',
          iframe: 'https://taifood-blog.asia/embed/f1-es',
        },
      ],
    };

    const stream = normalizeStream(raw, 'Motorsports', 35);
    expect(stream.feeds).toHaveLength(3);
    expect(stream.feeds[0].id).toBe('main-500');
    expect(stream.feeds[0].isMainFeed).toBe(true);
    expect(stream.feeds[0].sourceTag).toBe('HD | Sky Sports F1');
    expect(stream.feeds[1].id).toBe('501');
    expect(stream.feeds[1].locale).toBe('it');
    expect(stream.feeds[2].id).toBe('502');
    expect(stream.feeds[2].locale).toBe('es');
  });

  // Scenario 13: The API returns unexpected or missing optional fields
  it('Scenario 13: safely parses nulls, unexpected types, and unknown fields', () => {
    const raw = {
      id: 888,
      name: 'Null fields test stream',
      tag: null,
      source_tag: undefined,
      poster: null,
      blurhash: null,
      colors: 'invalid-string-instead-of-array' as unknown as string[],
      starts_at: 'bad-number' as unknown as number,
      ends_at: null as unknown as number,
      always_live: 1,
      viewers: 'not-a-number' as unknown as number,
      custom_unknown_field: { foo: 'bar' },
    };

    const stream = normalizeStream(raw as unknown as any, 'American Football', 26);
    expect(stream.id).toBe('888');
    expect(stream.name).toBe('Null fields test stream');
    expect(stream.poster).toBeNull();
    expect(stream.colors).toEqual([]);
    expect(stream.alwaysLive).toBe(true);
    expect(stream.status).toBe('always_live');
    expect(stream.viewers).toBe(0); // Safely defaulted
  });
});
