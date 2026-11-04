import { describe, it, expect } from 'vitest';
import { normalizeApiResponse } from '../streamNormalizer';
import { ApiResponse } from '../../types/sports';

describe('filtering and sorting logic tests', () => {
  const mockApiData: ApiResponse = {
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
            tag: 'Premier League',
            source_tag: 'HD | Sky Sports Main Event',
            starts_at: 1793560000,
            viewers: 500,
            always_live: 0,
          },
          {
            id: 2,
            name: 'Barcelona vs. Real Madrid',
            tag: 'La Liga',
            source_tag: 'HD | DAZN',
            starts_at: 1793580000,
            viewers: 1200,
            always_live: 0,
          },
        ],
      },
      {
        id: 37,
        category: 'Basketball',
        always_live: false,
        streams: [
          {
            id: 3,
            name: 'LA Lakers vs. Golden State Warriors',
            tag: 'NBA',
            source_tag: 'HD | ESPN',
            starts_at: 1793570000,
            viewers: 800,
            always_live: 0,
          },
        ],
      },
      {
        id: 14,
        category: '24/7 Streams',
        always_live: true,
        streams: [
          {
            id: 4,
            name: '24/7 Red Bull TV',
            tag: '24/7 channel',
            source_tag: 'HD | Red Bull TV',
            starts_at: 0,
            viewers: 50,
            always_live: 1,
          },
        ],
      },
    ],
  };

  const { streams } = normalizeApiResponse(mockApiData);

  it('filters by category accurately', () => {
    const footballOnly = streams.filter(
      (s) => s.category.toLowerCase() === 'football'
    );
    expect(footballOnly).toHaveLength(2);
    expect(footballOnly.map((s) => s.name)).toContain('Arsenal vs. Chelsea');

    const basketballOnly = streams.filter(
      (s) => s.category.toLowerCase() === 'basketball'
    );
    expect(basketballOnly).toHaveLength(1);
    expect(basketballOnly[0].name).toBe('LA Lakers vs. Golden State Warriors');
  });

  // Scenario 10: Search across name, tags, and source labels
  it('Scenario 10: searches across title, league tag, and source tag', () => {
    // Search by team name
    const query1 = 'lakers';
    const match1 = streams.filter((s) => s.name.toLowerCase().includes(query1));
    expect(match1).toHaveLength(1);
    expect(match1[0].name).toContain('LA Lakers');

    // Search by league tag
    const query2 = 'la liga';
    const match2 = streams.filter(
      (s) =>
        s.name.toLowerCase().includes(query2) ||
        s.tag.toLowerCase().includes(query2)
    );
    expect(match2).toHaveLength(1);
    expect(match2[0].name).toBe('Barcelona vs. Real Madrid');

    // Search by broadcaster source
    const query3 = 'dazn';
    const match3 = streams.filter(
      (s) =>
        s.name.toLowerCase().includes(query3) ||
        s.sourceTag.toLowerCase().includes(query3)
    );
    expect(match3).toHaveLength(1);
    expect(match3[0].name).toBe('Barcelona vs. Real Madrid');

    // Search returns empty state when no match
    const query4 = 'non-existent-team-xyz';
    const match4 = streams.filter(
      (s) =>
        s.name.toLowerCase().includes(query4) ||
        s.tag.toLowerCase().includes(query4) ||
        s.sourceTag.toLowerCase().includes(query4)
    );
    expect(match4).toHaveLength(0);
  });

  it('sorts by viewer count descending', () => {
    const sorted = [...streams].sort((a, b) => b.viewers - a.viewers);
    expect(sorted[0].name).toBe('Barcelona vs. Real Madrid');
    expect(sorted[0].viewers).toBe(1200);
    expect(sorted[1].viewers).toBe(800);
    expect(sorted[2].viewers).toBe(500);
    expect(sorted[3].viewers).toBe(50);
  });

  it('sorts alphabetically by event name', () => {
    const sorted = [...streams].sort((a, b) => a.name.localeCompare(b.name));
    expect(sorted[0].name).toBe('24/7 Red Bull TV');
    expect(sorted[1].name).toBe('Arsenal vs. Chelsea');
    expect(sorted[2].name).toBe('Barcelona vs. Real Madrid');
    expect(sorted[3].name).toBe('LA Lakers vs. Golden State Warriors');
  });
});
