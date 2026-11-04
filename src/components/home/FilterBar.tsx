import React from 'react';
import { useStreams } from '../../context/StreamsContext';
import { SortOption } from '../../types/sports';
import { Radio, Calendar, Tv, Layers, ArrowUpDown, X, RotateCw } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const {
    filterState,
    setStatusFilter,
    setSortBy,
    resetFilters,
    filteredStreams,
    streams,
    isRefreshing,
  } = useStreams();

  const isFiltered =
    filterState.searchQuery !== '' ||
    filterState.selectedCategory !== 'all' ||
    filterState.statusFilter !== 'all' ||
    filterState.sortBy !== 'default';

  const liveCount = streams.filter((s) => s.status === 'live').length;
  const upcomingCount = streams.filter((s) => s.status === 'upcoming').length;
  const alwaysLiveCount = streams.filter((s) => s.status === 'always_live').length;

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-4 mb-6 border-b border-surface-border">
      
      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
            filterState.statusFilter === 'all'
              ? 'bg-surface-raised text-white border border-surface-border shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-surface'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All</span>
          <span className="text-[10px] opacity-75">({streams.length})</span>
        </button>

        <button
          onClick={() => setStatusFilter('live')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
            filterState.statusFilter === 'live'
              ? 'bg-sports-red/20 text-white border border-sports-red/50 shadow-glow-red'
              : 'text-slate-400 hover:text-sports-red-light hover:bg-surface'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-sports-red animate-pulse" />
          <span>Live</span>
          {liveCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sports-red text-white">
              {liveCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setStatusFilter('upcoming')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
            filterState.statusFilter === 'upcoming'
              ? 'bg-sports-blue/20 text-sports-blue-light border border-sports-blue/50'
              : 'text-slate-400 hover:text-sports-blue-light hover:bg-surface'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Upcoming</span>
          {upcomingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sports-blue/30 text-sports-blue-light">
              {upcomingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setStatusFilter('always_live')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
            filterState.statusFilter === 'always_live'
              ? 'bg-purple-900/30 text-purple-300 border border-purple-500/50'
              : 'text-slate-400 hover:text-purple-300 hover:bg-surface'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>24/7</span>
          {alwaysLiveCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-900/50 text-purple-300">
              {alwaysLiveCount}
            </span>
          )}
        </button>
      </div>

      {/* Sorting & Filter Actions */}
      <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
        
        {/* Results Counter & Background Sync Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">
            Showing <strong className="text-white font-semibold">{filteredStreams.length}</strong> event{filteredStreams.length === 1 ? '' : 's'}
          </span>
          {isRefreshing && (
            <span className="inline-flex items-center gap-1 text-[11px] text-sports-red-light bg-sports-red/10 px-2 py-0.5 rounded-full border border-sports-red/20">
              <RotateCw className="w-3 h-3 animate-spin text-sports-red" />
              <span>Updating...</span>
            </span>
          )}
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface hover:bg-surface-raised border border-surface-border text-sports-red-light font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Sort Select */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterState.sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-surface border border-surface-border text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-sports-red transition-colors"
          >
            <option value="default">Default Order</option>
            <option value="upcoming_first">Upcoming First</option>
            <option value="viewers_desc">Most Popular</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

    </div>
  );
};
