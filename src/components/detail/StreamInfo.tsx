import React from 'react';
import { NormalizedStream } from '../../types/sports';
import { StatusBadge } from '../common/Badge';
import { formatFullDateTime, getRelativeCountdown } from '../../utils/dateUtils';
import {
  Calendar,
  Clock,
  Tv,
  Layers,
} from 'lucide-react';

interface StreamInfoProps {
  stream: NormalizedStream;
}

export const StreamInfo: React.FC<StreamInfoProps> = ({ stream }) => {
  const startFull = formatFullDateTime(stream.startsAt);
  const endFull = formatFullDateTime(stream.endsAt);
  const countdown = getRelativeCountdown(stream.startsAt);

  return (
    <div className="w-full bg-surface border border-surface-border rounded-xl p-5 sm:p-6 mb-8">
      
      {/* Title & Badges */}
      <div className="flex flex-col gap-3 pb-6 border-b border-surface-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-surface-raised border border-surface-border text-sports-blue-light">
            {stream.category}
          </span>
          {stream.tag && stream.tag !== stream.category && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-surface-raised border border-surface-border text-slate-300">
              {stream.tag}
            </span>
          )}
          <StatusBadge status={stream.status} statusText={stream.statusText} />
        </div>

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-white">
          {stream.name}
        </h1>
      </div>

      {/* Structured Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        
        {/* Scheduled Start */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-raised/50 border border-surface-border">
          <Calendar className="w-5 h-5 text-sports-red shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="text-slate-400 block font-medium">Scheduled Start</span>
            {stream.startsAt ? (
              <>
                <strong className="text-slate-100 font-semibold block mt-0.5">
                  {startFull}
                </strong>
                {countdown && (
                  <span className="text-sports-blue-light text-[11px] font-medium">
                    {countdown}
                  </span>
                )}
              </>
            ) : stream.alwaysLive ? (
              <span className="text-purple-300 font-medium mt-0.5 block">
                Continuous 24/7 Channel
              </span>
            ) : (
              <span className="text-slate-400 mt-0.5 block">
                Schedule TBA
              </span>
            )}
          </div>
        </div>

        {/* Scheduled End */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-raised/50 border border-surface-border">
          <Clock className="w-5 h-5 text-sports-blue shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="text-slate-400 block font-medium">Scheduled End</span>
            {stream.endsAt ? (
              <strong className="text-slate-100 font-semibold block mt-0.5">
                {endFull}
              </strong>
            ) : stream.alwaysLive ? (
              <span className="text-purple-300 font-medium mt-0.5 block">
                Always Live
              </span>
            ) : (
              <span className="text-slate-400 mt-0.5 block">
                Open broadcast window
              </span>
            )}
          </div>
        </div>

        {/* Primary Source / Channel */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-raised/50 border border-surface-border">
          <Tv className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="text-slate-400 block font-medium">Broadcast Source</span>
            <strong className="text-slate-100 font-semibold block mt-0.5">
              {stream.sourceTag || 'Standard Broadcast Feed'}
            </strong>
            <span className="text-slate-400 text-[11px]">
              Locale: {stream.locale.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Multi-Feed Summary */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-raised/50 border border-surface-border">
          <Layers className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="text-slate-400 block font-medium">Available Streams</span>
            <strong className="text-slate-100 font-semibold block mt-0.5">
              {stream.feeds.length} Feed{stream.feeds.length === 1 ? '' : 's'} Indexed
            </strong>
            <span className="text-slate-400 text-[11px]">
              {stream.substreams.length} alternate substreams
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
