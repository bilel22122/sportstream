import React from 'react';
import { Link } from 'react-router-dom';
import { NormalizedStream } from '../../types/sports';
import { StatusBadge } from '../common/Badge';
import { LazyImage } from '../common/LazyImage';
import { formatEventDate, formatEventTime, getRelativeCountdown } from '../../utils/dateUtils';
import { Play, Radio, Sparkles, Tv } from 'lucide-react';

interface FeaturedHeroProps {
  stream: NormalizedStream | null;
  isLoading?: boolean;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = React.memo(({ stream, isLoading }) => {
  // Loading skeleton state during initial fetch without cached data
  if (isLoading && !stream) {
    return (
      <div
        aria-hidden="true"
        className="relative w-full rounded-2xl overflow-hidden bg-surface border border-surface-border h-[320px] sm:h-[380px] lg:h-[420px] animate-shimmer mb-8"
      />
    );
  }

  // Neutral welcome section if no suitable event is found
  if (!stream) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-surface via-surface-raised to-surface border border-surface-border p-8 sm:p-12 mb-8 shadow-xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sports-red/10 border border-sports-red/30 text-sports-red text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Live Sports Hub
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase text-white">
            Live & Scheduled <span className="text-sports-red">Sports Streams</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Browse real-time professional sports streams, upcoming fixtures, and 24/7 sports networks indexed dynamically from the public directory.
          </p>
        </div>
      </div>
    );
  }

  const dateStr = formatEventDate(stream.startsAt);
  const timeStr = formatEventTime(stream.startsAt);
  const countdown = getRelativeCountdown(stream.startsAt);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-surface border border-surface-border mb-8 shadow-2xl group">
      
      {/* Background Poster with Vignette / Dark Gradients */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src={stream.poster}
          alt={stream.name}
          name={stream.name}
          category={stream.category}
          tag={stream.tag}
          colors={stream.colors}
          width={1280}
          height={720}
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        {/* Layered overlays to guarantee high contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 p-6 sm:p-8 lg:p-10 flex flex-col justify-end min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] max-w-3xl">
        
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-white border border-white/20">
            {stream.category}
          </span>

          <StatusBadge status={stream.status} statusText={stream.statusText} />

          {stream.feeds.length > 1 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sports-blue/20 border border-sports-blue/40 text-[11px] text-sports-blue-light font-medium">
              <Tv className="w-3 h-3" />
              {stream.feeds.length} Feeds
            </span>
          )}
        </div>

        {/* Featured Tagline */}
        <div className="flex items-center gap-2 text-sports-red text-xs font-bold uppercase tracking-wider mb-2">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Featured Match / Marquee Event</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wide text-white leading-tight drop-shadow-md mb-3">
          {stream.name}
        </h1>

        {/* Source & Schedule Details */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300 mb-6">
          {stream.sourceTag && (
            <span className="font-semibold text-slate-200 bg-surface/80 px-2.5 py-1 rounded border border-surface-border">
              {stream.sourceTag}
            </span>
          )}

          {stream.startsAt && (
            <div className="flex items-center gap-2">
              <span>{dateStr} at {timeStr}</span>
              {countdown && (
                <span className="text-sports-blue-light font-medium">
                  ({countdown})
                </span>
              )}
            </div>
          )}

          {stream.tag && stream.tag !== stream.category && (
            <span className="text-slate-400">
              League: <strong className="text-slate-200">{stream.tag}</strong>
            </span>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to={`/event/${encodeURIComponent(stream.uriName || stream.id)}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sports-red hover:bg-sports-red-dark text-white font-bold text-sm uppercase tracking-wider shadow-glow-red hover:scale-102 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch Stream
          </Link>
          
          <Link
            to={`/event/${encodeURIComponent(stream.uriName || stream.id)}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface/80 hover:bg-surface-raised border border-surface-border text-slate-200 font-semibold text-sm transition-all backdrop-blur-sm"
          >
            Event Details
          </Link>
        </div>

      </div>
    </div>
  );
});

FeaturedHero.displayName = 'FeaturedHero';
