import React, { useState, useEffect } from 'react';
import { FallbackPoster } from './FallbackPoster';

interface LazyImageProps {
  src?: string | null;
  alt: string;
  name: string;
  category: string;
  tag?: string;
  colors?: string[];
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  name,
  category,
  tag,
  colors,
  className = '',
  containerClassName = '',
  width = 640,
  height = 360,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset state if image src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(!src);
  }, [src]);

  // If no source provided or failed to load, show lightweight graphic fallback poster
  if (!src || hasError) {
    return (
      <div className={`w-full h-full aspect-[16/9] ${containerClassName}`}>
        <FallbackPoster
          name={name}
          category={category}
          tag={tag}
          colors={colors}
          className={className}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full aspect-[16/9] overflow-hidden bg-surface-raised ${containerClassName}`}
    >
      {/* Lightweight Placeholder Skeleton while downloading image */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-surface-raised animate-pulse z-0"
        />
      )}

      {/* Actual Image with explicit dimensions, native lazy loading, and async decoding */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};
