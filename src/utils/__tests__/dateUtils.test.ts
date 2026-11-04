import { describe, it, expect } from 'vitest';
import {
  parseUnixTimestamp,
  determineStreamStatus,
  formatEventDate,
  formatEventTime,
  getRelativeCountdown,
} from '../dateUtils';

describe('dateUtils tests', () => {
  it('correctly converts Unix seconds to milliseconds', () => {
    const seconds = 1793565000;
    const ms = parseUnixTimestamp(seconds);
    expect(ms).toBe(1793565000 * 1000);
  });

  it('safely handles 0, negative, and invalid timestamps', () => {
    expect(parseUnixTimestamp(0)).toBeNull();
    expect(parseUnixTimestamp(-60)).toBeNull();
    expect(parseUnixTimestamp(null)).toBeNull();
    expect(parseUnixTimestamp(undefined)).toBeNull();
    expect(parseUnixTimestamp('invalid')).toBeNull();
  });

  it('determines 24/7 channels accurately without fake schedules', () => {
    const res1 = determineStreamStatus(0, 0, 1, 'American Football', '24/7 channel');
    expect(res1.status).toBe('always_live');
    expect(res1.statusText).toBe('24/7 Channel');

    const res2 = determineStreamStatus(0, 0, false, '24/7 Streams', 'general');
    expect(res2.status).toBe('always_live');
  });

  it('identifies upcoming events and calculates countdowns', () => {
    const futureSec = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now
    const res = determineStreamStatus(futureSec, futureSec + 7200, 0, 'Basketball', 'NBA');
    expect(res.status).toBe('upcoming');
    expect(res.statusText).toContain('Starts in');

    const countdown = getRelativeCountdown(futureSec * 1000);
    expect(countdown).toMatch(/In (?:1h \d+m|2h)/);
  });

  it('identifies currently live matches based on start/end window', () => {
    const pastStartSec = Math.floor(Date.now() / 1000) - 1800; // Started 30 min ago
    const futureEndSec = Math.floor(Date.now() / 1000) + 5400; // Ends in 90 min
    const res = determineStreamStatus(pastStartSec, futureEndSec, 0, 'Football', 'Serie A');
    expect(res.status).toBe('live');
    expect(res.statusText).toBe('LIVE NOW');
  });

  it('formats dates into readable local strings', () => {
    const todayMs = Date.now();
    expect(formatEventDate(todayMs)).toBe('Today');

    const tomorrowMs = Date.now() + 24 * 60 * 60 * 1000;
    expect(formatEventDate(tomorrowMs)).toBe('Tomorrow');

    const timeStr = formatEventTime(todayMs);
    expect(typeof timeStr).toBe('string');
    expect(timeStr.length).toBeGreaterThan(0);
  });
});
