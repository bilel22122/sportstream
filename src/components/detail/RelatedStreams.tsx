import React from 'react';
import { NormalizedStream } from '../../types/sports';
import { StreamCard } from '../home/StreamCard';
import { Trophy } from 'lucide-react';

interface RelatedStreamsProps {
  currentStreamId: string;
  category: string;
  allStreams: NormalizedStream[];
}

export const RelatedStreams: React.FC<RelatedStreamsProps> = ({
  currentStreamId,
  category,
  allStreams,
}) => {
  // Find other streams in the same category
  let related = allStreams.filter(
    (s) => s.id !== currentStreamId && s.category.toLowerCase() === category.toLowerCase()
  );

  // If few streams in category, supplement with other live/top streams
  if (related.length < 4) {
    const others = allStreams.filter(
      (s) => s.id !== currentStreamId && s.category.toLowerCase() !== category.toLowerCase()
    );
    related = [...related, ...others].slice(0, 4);
  } else {
    related = related.slice(0, 4);
  }

  if (related.length === 0) return null;

  return (
    <div className="w-full mt-12 pt-8 border-t border-surface-border">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-sports-red" />
        <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
          More {category} & Recommended Events
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {related.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  );
};
