import { StreamStatus } from '../types/sports';

/**
 * Safely parses Unix timestamp in seconds to milliseconds
 */
export function parseUnixTimestamp(seconds: unknown): number | null {
  if (typeof seconds !== 'number' && typeof seconds !== 'string') {
    return null;
  }
  const numeric = typeof seconds === 'string' ? Number(seconds) : seconds;
  if (isNaN(numeric) || numeric <= 0) {
    return null;
  }
  // If timestamp already appears to be in milliseconds (e.g. > 1e11)
  if (numeric > 10000000000) {
    return numeric;
  }
  return numeric * 1000;
}

/**
 * Determines stream status based on defensible rules
 */
export function determineStreamStatus(
  startsAtSec?: number | null,
  endsAtSec?: number | null,
  alwaysLiveFlag?: boolean | number,
  categoryName?: string,
  tag?: string
): { status: StreamStatus; statusText: string } {
  // Check if explicitly 24/7 or always live
  const isAlwaysLive = Boolean(
    alwaysLiveFlag === 1 ||
    alwaysLiveFlag === true ||
    (categoryName && categoryName.toLowerCase().includes('24/7')) ||
    (tag && tag.toLowerCase().includes('24/7'))
  );

  if (isAlwaysLive) {
    return {
      status: 'always_live',
      statusText: '24/7 Channel',
    };
  }

  const startMs = parseUnixTimestamp(startsAtSec);
  const now = Date.now();

  if (!startMs) {
    // Missing or zero start time and not 24/7
    return {
      status: 'unknown',
      statusText: 'On Air',
    };
  }

  // End time determination:
  // If ends_at is provided and greater than starts_at, use it.
  // Otherwise, sports broadcasts typically last 3 hours (10,800,000 ms).
  const endMs = parseUnixTimestamp(endsAtSec);
  const effectiveEndMs = (endMs && endMs > startMs) ? endMs : startMs + (3 * 60 * 60 * 1000);

  // If start is in the future
  if (now < startMs) {
    const diffMinutes = Math.floor((startMs - now) / (60 * 1000));
    let text = 'Upcoming';
    if (diffMinutes <= 15) {
      text = 'Starting Soon';
    } else if (diffMinutes < 60) {
      text = `Starts in ${diffMinutes}m`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      text = `Starts in ${hours}h`;
    }
    return {
      status: 'upcoming',
      statusText: text,
    };
  }

  // If current time is between start and end
  if (now >= startMs && now <= effectiveEndMs) {
    return {
      status: 'live',
      statusText: 'LIVE NOW',
    };
  }

  // If past end time
  return {
    status: 'ended',
    statusText: 'Concluded',
  };
}

/**
 * Formats a timestamp into a user-friendly local date string
 */
export function formatEventDate(timestampMs: number | null): string {
  if (!timestampMs) return '';
  const date = new Date(timestampMs);
  const now = new Date();
  
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  if (isToday) {
    return 'Today';
  }
  if (isTomorrow) {
    return 'Tomorrow';
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats a timestamp into local time (e.g., 7:30 PM)
 */
export function formatEventTime(timestampMs: number | null): string {
  if (!timestampMs) return '';
  const date = new Date(timestampMs);
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formats a full date and time string
 */
export function formatFullDateTime(timestampMs: number | null): string {
  if (!timestampMs) return 'Schedule TBA';
  const date = new Date(timestampMs);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

/**
 * Returns formatted relative countdown
 */
export function getRelativeCountdown(timestampMs: number | null): string {
  if (!timestampMs) return '';
  const now = Date.now();
  const diffMs = timestampMs - now;

  if (diffMs <= 0) {
    return 'In Progress';
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `In ${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `In ${hours}h ${minutes}m`;
  }
  return `In ${minutes}m`;
}
