import React from 'react';
import { Link } from 'react-router-dom';
import { NormalizedStream } from '../../types/sports';
import { StatusBadge } from '../common/Badge';
import { LazyImage } from '../common/LazyImage';
import { formatEventDate, formatEventTime, getRelativeCountdown } from '../../utils/dateUtils';
import { Tv, Play } from 'lucide-react';

interface StreamCardProps {
  stream: NormalizedStream;
}

export const StreamCard: React.FC<StreamCardProps> = React.memo(({ stream }) => {
  const dateStr = formatEventDate(stream.startsAt);
  const timeStr = formatEventTime(stream.startsAt);
  const countdown = getRelativeCountdown(stream.startsAt);

  const detailUrl = `/event/${encodeURIComponent(stream.uriName || stream.id)}`;

  return (
    <article className="group flex flex-col rounded-xl overflow-hidden bg-surface border border-surface-border hover:border-slate-600 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      
      {/* Poster Image Container with fixed explicit 16:9 aspect ratio */}
      <Link
        to={detailUrl}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-surface-subtle"
        tabIndex={-1}
        aria-hidden="true"
      >
        <LazyImage
          src={stream.poster}
          alt={stream.name}
          name={stream.name}
          category={stream.category}
          tag={stream.tag}
          colors={stream.colors}
          width={640}
          height={360}
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Floating Status Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <StatusBadge status={stream.status} statusText={stream.statusText} size="sm" />
        </div>

        {/* Substreams Feed Count Badge */}
        {stream.feeds.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-bold text-sports-blue-light border border-sports-blue/40">
              <Tv className="w-3 h-3" />
              {stream.feeds.length} Feeds
            </span>
          </div>
        )}

        {/* Play Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full bg-sports-red flex items-center justify-center shadow-glow-red scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Card Details Body */}
      <div className="flex flex-col flex-1 p-4 justify-between gap-3">
        
        <div>
          {/* Category & Tag meta row */}
          <div className="flex items-center gap-2 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="text-sports-blue-light">{stream.category}</span>
            {stream.tag && stream.tag !== stream.category && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 truncate max-w-[120px]">{stream.tag}</span>
              </>
            )}
          </div>

          {/* Event Title */}
          <h3 className="font-semibold text-sm text-slate-100 group-hover:text-sports-red-light transition-colors line-clamp-2 leading-snug">
            <Link to={detailUrl}>
              {stream.name}
            </Link>
          </h3>
        </div>

        {/* Bottom meta row: Source Tag, Date/Time & CTA */}
        <div className="pt-2 border-t border-surface-border/60 flex flex-col gap-2">
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            {/* Source Tag */}
            {stream.sourceTag ? (
              <span className="font-medium text-slate-300 truncate max-w-[140px] text-[11px] px-1.5 py-0.5 rounded bg-surface-raised border border-surface-border">
                {stream.sourceTag}
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Live Feed</span>
            )}

            {/* Time / Countdown */}
            {stream.startsAt ? (
              <span className="text-[11px] text-slate-300 text-right">
                {dateStr} {timeStr}
                {countdown && stream.status === 'upcoming' && (
                  <span className="block text-[10px] text-sports-blue-light font-medium">
                    {countdown}
                  </span>
                )}
              </span>
            ) : stream.alwaysLive ? (
              <span className="text-[11px] text-purple-300 font-medium">
                24/7 Channel
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                Continuous Stream
              </span>
            )}
          </div>

          {/* Action Button */}
          <Link
            to={detailUrl}
            className="w-full mt-1 py-2 px-3 rounded-lg bg-surface-raised group-hover:bg-sports-red text-slate-200 group-hover:text-white text-xs font-bold uppercase tracking-wider text-center transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <span>Watch Event</span>
            <Play className="w-3 h-3 fill-current" />
          </Link>

        </div>

      </div>

    </article>
  );
});

StreamCard.displayName = 'StreamCard';
