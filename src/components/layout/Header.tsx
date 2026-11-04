import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStreams } from '../../context/StreamsContext';
import {
  Flame,
  Search,
  X,
  Menu,
  RotateCw,
  Radio,
  Tv,
  Calendar,
  Layers,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    filterState,
    setSearchQuery,
    setStatusFilter,
    setSelectedCategory,
    resetFilters,
    refresh,
    isRefreshing,
    streams,
  } = useStreams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate live count
  const liveCount = streams.filter((s) => s.status === 'live').length;
  const upcomingCount = streams.filter((s) => s.status === 'upcoming').length;
  const alwaysLiveCount = streams.filter((s) => s.status === 'always_live').length;

  const handleNavClick = (status: 'all' | 'live' | 'upcoming' | 'always_live') => {
    setSelectedCategory('all');
    setStatusFilter(status);
    if (location.pathname !== '/') {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-surface-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => {
              resetFilters();
            }}
            className="flex items-center gap-2 group shrink-0"
            aria-label="SPORTSTREAM Homepage"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sports-red-dark via-sports-red to-orange-500 flex items-center justify-center shadow-glow-red group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-wider leading-none text-white">
                SPORT<span className="text-sports-red">STREAM</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                Live Directory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                filterState.statusFilter === 'all' && location.pathname === '/'
                  ? 'bg-surface-raised text-white border border-surface-border shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-surface/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Events
            </button>

            <button
              onClick={() => handleNavClick('live')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                filterState.statusFilter === 'live' && location.pathname === '/'
                  ? 'bg-sports-red/20 text-white border border-sports-red/50 shadow-glow-red'
                  : 'text-slate-400 hover:text-sports-red-light hover:bg-surface/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-sports-red animate-pulse" />
              Live Now
              {liveCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-sports-red text-white">
                  {liveCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                filterState.statusFilter === 'upcoming' && location.pathname === '/'
                  ? 'bg-sports-blue/20 text-sports-blue-light border border-sports-blue/50'
                  : 'text-slate-400 hover:text-sports-blue-light hover:bg-surface/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Upcoming
              {upcomingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-sports-blue/30 text-sports-blue-light">
                  {upcomingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('always_live')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                filterState.statusFilter === 'always_live' && location.pathname === '/'
                  ? 'bg-purple-900/30 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-purple-300 hover:bg-surface/60'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              24/7 Channels
              {alwaysLiveCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-900/50 text-purple-300">
                  {alwaysLiveCount}
                </span>
              )}
            </button>
          </nav>

          {/* Search bar & Refresh Action */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xs md:max-w-sm justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search teams, sports, leagues..."
                value={filterState.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg bg-surface border border-surface-border text-white placeholder-slate-500 focus:outline-none focus:border-sports-red focus:ring-1 focus:ring-sports-red transition-all"
              />
              {filterState.searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => refresh(true)}
              disabled={isRefreshing}
              title="Refresh stream listings"
              aria-label="Refresh stream listings"
              className={`p-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-white hover:border-slate-600 transition-colors shrink-0 ${
                isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <RotateCw
                className={`w-4 h-4 text-slate-300 ${isRefreshing ? 'animate-spin text-sports-red' : ''}`}
              />
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-background px-4 py-4 space-y-2">
          <button
            onClick={() => handleNavClick('all')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider text-slate-200 hover:bg-surface flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              All Events
            </span>
            <span className="text-xs text-slate-500">{streams.length}</span>
          </button>

          <button
            onClick={() => handleNavClick('live')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider text-sports-red-light hover:bg-surface flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-sports-red animate-pulse" />
              Live Now
            </span>
            {liveCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-sports-red text-white">
                {liveCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('upcoming')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider text-sports-blue-light hover:bg-surface flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sports-blue" />
              Upcoming Matches
            </span>
            {upcomingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-sports-blue/30 text-sports-blue-light">
                {upcomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('always_live')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider text-purple-300 hover:bg-surface flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-purple-400" />
              24/7 Channels
            </span>
            {alwaysLiveCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-900/40 text-purple-300">
                {alwaysLiveCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
