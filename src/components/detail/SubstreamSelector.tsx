import React from 'react';
import { StreamFeed } from '../../types/sports';
import { QualityBadge } from '../common/Badge';
import { Tv, Radio, Check, Globe } from 'lucide-react';

interface SubstreamSelectorProps {
  feeds: StreamFeed[];
  activeFeedId: string;
  onSelectFeed: (feed: StreamFeed) => void;
}

export const SubstreamSelector: React.FC<SubstreamSelectorProps> = ({
  feeds,
  activeFeedId,
  onSelectFeed,
}) => {
  if (feeds.length <= 1) return null;

  return (
    <div className="w-full bg-surface border border-surface-border rounded-xl p-4 sm:p-5 mb-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-sports-red" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-white">
            Available Broadcast Feeds ({feeds.length})
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Switch stream source or language
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {feeds.map((feed, index) => {
          const isActive = feed.id === activeFeedId;

          return (
            <button
              key={feed.id}
              onClick={() => onSelectFeed(feed)}
              className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-200 ${
                isActive
                  ? 'bg-sports-red/15 border-sports-red text-white shadow-glow-red'
                  : 'bg-surface-raised/70 border-surface-border hover:bg-surface-raised hover:border-slate-600 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                    isActive ? 'bg-sports-red text-white' : 'bg-surface border border-surface-border text-slate-400'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs truncate text-slate-100">
                      {feed.sourceTag || feed.name}
                    </span>
                    <QualityBadge quality={feed.quality} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    {feed.isMainFeed && (
                      <span className="text-sports-red font-semibold uppercase">
                        Primary Feed
                      </span>
                    )}
                    {feed.locale && (
                      <span className="flex items-center gap-0.5 uppercase">
                        <Globe className="w-2.5 h-2.5" />
                        {feed.locale}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isActive ? (
                <div className="w-5 h-5 rounded-full bg-sports-red text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <Radio className="w-4 h-4 text-slate-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
