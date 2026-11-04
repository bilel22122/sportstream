import React from 'react';
import { NormalizedStream } from '../../types/sports';
import { StreamCard } from './StreamCard';
import { RefreshCw, SearchX, WifiOff } from 'lucide-react';

interface StreamGridProps {
  streams: NormalizedStream[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onResetFilters: () => void;
}

export const StreamGrid: React.FC<StreamGridProps> = ({
  streams,
  isLoading,
  error,
  onRetry,
  onResetFilters,
}) => {
  // 1. Loading Skeleton State
  if (isLoading && streams.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden bg-surface border border-surface-border flex flex-col"
          >
            <div className="aspect-[16/9] w-full animate-shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-1/3 rounded bg-surface-raised animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-surface-raised animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-surface-raised animate-pulse" />
              <div className="pt-2 border-t border-surface-border/60 flex justify-between">
                <div className="h-3 w-1/4 rounded bg-surface-raised animate-pulse" />
                <div className="h-3 w-1/4 rounded bg-surface-raised animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State with Retry Button
  if (error && streams.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-surface border border-sports-red/30 p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-glow-red">
        <div className="w-14 h-14 rounded-full bg-sports-red/20 text-sports-red border border-sports-red/40 flex items-center justify-center mx-auto mb-4">
          <WifiOff className="w-7 h-7" />
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mb-2">
          Unable to Load Sports Streams
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sports-red hover:bg-sports-red-dark text-white font-bold text-xs uppercase tracking-wider shadow-glow-red transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // 3. Empty State (No matching results)
  if (streams.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-surface border border-surface-border p-8 sm:p-12 text-center max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-surface-raised text-slate-400 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-white mb-2">
          No Matching Sports Events Found
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
          We couldn&apos;t find any streams matching your search keywords or active category filters. Try checking your spelling or clearing filters.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-raised hover:bg-sports-red text-slate-200 hover:text-white border border-surface-border hover:border-sports-red text-xs font-bold uppercase tracking-wider transition-all"
        >
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  // 4. Responsive Grid of Stream Cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {streams.map((stream) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
};
