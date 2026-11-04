import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStreams } from '../context/StreamsContext';
import { FeaturedHero } from '../components/home/FeaturedHero';
import { CategoryPills } from '../components/home/CategoryPills';
import { FilterBar } from '../components/home/FilterBar';
import { StreamGrid } from '../components/home/StreamGrid';
import { StatusFilter } from '../types/sports';

export const HomePage: React.FC = () => {
  const {
    filteredStreams,
    featuredStream,
    isLoading,
    error,
    refresh,
    resetFilters,
    setStatusFilter,
    setSelectedCategory,
  } = useStreams();

  const [searchParams] = useSearchParams();

  // Handle URL query parameters (e.g., ?status=live or ?category=Basketball)
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const categoryParam = searchParams.get('category');

    if (
      statusParam &&
      ['all', 'live', 'upcoming', 'always_live'].includes(statusParam)
    ) {
      setStatusFilter(statusParam as StatusFilter);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, setStatusFilter, setSelectedCategory]);

  return (
    <div className="w-full">
      {/* Marquee Featured Event from API */}
      <FeaturedHero stream={featuredStream} isLoading={isLoading} />

      {/* Dynamic Sports Categories */}
      <CategoryPills />

      {/* Instant Filter & Sort Controls */}
      <FilterBar />

      {/* Responsive Grid of Stream Cards */}
      <StreamGrid
        streams={filteredStreams}
        isLoading={isLoading}
        error={error}
        onRetry={() => refresh(true)}
        onResetFilters={resetFilters}
      />
    </div>
  );
};
