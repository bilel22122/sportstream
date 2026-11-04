import React, { useRef } from 'react';
import { useStreams } from '../../context/StreamsContext';
import { getSportTheme } from '../../utils/imageUtils';
import {
  Trophy,
  Shield,
  Flag,
  Goal,
  Activity,
  Snowflake,
  Tv,
  Compass,
  Swords,
  PlayCircle,
  Zap,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const CategoryPills: React.FC = () => {
  const { categories, streams, filterState, setSelectedCategory, isLoading } = useStreams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const renderSportIcon = (categoryName: string, isSelected: boolean) => {
    const theme = getSportTheme(categoryName);
    const className = `w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'opacity-80'}`;

    switch (theme.iconName) {
      case 'Goal':
        return <Goal className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Shield':
        return <Shield className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Trophy':
        return <Trophy className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Flag':
        return <Flag className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Snowflake':
        return <Snowflake className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Activity':
        return <Activity className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Compass':
        return <Compass className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Swords':
        return <Swords className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Tv':
        return <Tv className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      case 'Zap':
        return <Zap className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
      default:
        return <PlayCircle className={className} style={{ color: isSelected ? undefined : theme.primaryColor }} />;
    }
  };

  const isAllSelected = filterState.selectedCategory === 'all';

  return (
    <div className="relative mb-6">
      {/* Scroll Controls for Desktop */}
      <div className="hidden sm:flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Sports Categories
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-md bg-surface border border-surface-border text-slate-400 hover:text-white hover:bg-surface-raised transition-colors"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-md bg-surface border border-surface-border text-slate-400 hover:text-white hover:bg-surface-raised transition-colors"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All Sports Pill */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            isAllSelected
              ? 'bg-sports-red text-white shadow-glow-red scale-102'
              : 'bg-surface hover:bg-surface-raised border border-surface-border text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Sports</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              isAllSelected ? 'bg-black/30 text-white' : 'bg-surface-raised text-slate-400'
            }`}
          >
            {streams.length}
          </span>
        </button>

        {/* Dynamic Categories from API */}
        {categories.map((cat) => {
          const isSelected = filterState.selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.id || cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isSelected
                  ? 'bg-sports-red text-white shadow-glow-red scale-102'
                  : 'bg-surface hover:bg-surface-raised border border-surface-border text-slate-300 hover:text-white'
              }`}
            >
              {renderSportIcon(cat.name, isSelected)}
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-surface-raised text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}

        {/* Skeleton Pill Placeholders during initial load if no categories yet */}
        {isLoading && categories.length === 0 && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`cat-skel-${i}`}
                aria-hidden="true"
                className="shrink-0 h-8 w-28 rounded-xl bg-surface-raised animate-pulse"
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
