import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStreams } from '../context/StreamsContext';
import { StreamFeed } from '../types/sports';
import { PlayerEmbed } from '../components/detail/PlayerEmbed';
import { SubstreamSelector } from '../components/detail/SubstreamSelector';
import { StreamInfo } from '../components/detail/StreamInfo';
import { RelatedStreams } from '../components/detail/RelatedStreams';
import { ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getStreamById, streams, isLoading } = useStreams();

  const stream = id ? getStreamById(id) : undefined;
  const [activeFeed, setActiveFeed] = useState<StreamFeed | null>(null);

  // Set default active feed whenever stream is resolved or changed
  useEffect(() => {
    if (stream && stream.feeds.length > 0) {
      setActiveFeed(stream.feeds[0]);
    }
  }, [stream]);

  // Loading state
  if (isLoading && !stream) {
    return (
      <div className="w-full space-y-6 animate-pulse py-6">
        <div className="h-4 w-48 bg-surface-raised rounded" />
        <div className="aspect-[16/9] w-full bg-surface-raised rounded-2xl" />
        <div className="h-28 w-full bg-surface-raised rounded-xl" />
      </div>
    );
  }

  // Not Found State (as required in Section 8)
  if (!stream) {
    return (
      <div className="w-full rounded-2xl bg-surface border border-surface-border p-8 sm:p-14 text-center max-w-lg mx-auto my-12 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-surface-raised text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white mb-2">
          Event Not Found
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
          The requested event (&ldquo;{id}&rdquo;) could not be found in the current live sports directory. It may have concluded or the identifier has changed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sports-red hover:bg-sports-red-dark text-white font-bold text-xs uppercase tracking-wider shadow-glow-red transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sports Directory</span>
        </Link>
      </div>
    );
  }

  const currentFeed = activeFeed || stream.feeds[0];

  return (
    <div className="w-full pb-12">
      
      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-4 text-xs">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-slate-400 truncate">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-600" />
          <Link
            to={`/?category=${encodeURIComponent(stream.category)}`}
            className="hover:text-white transition-colors"
          >
            {stream.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-600" />
          <span className="text-slate-200 font-semibold truncate">
            {stream.name}
          </span>
        </nav>

        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-raised border border-surface-border text-slate-300 hover:text-white font-medium shrink-0 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Directory</span>
        </Link>
      </div>

      {/* Main Video / Player Embed */}
      <div className="mb-6">
        <PlayerEmbed stream={stream} activeFeed={currentFeed} />
      </div>

      {/* Alternate Feeds / Substreams Selector */}
      <SubstreamSelector
        feeds={stream.feeds}
        activeFeedId={currentFeed.id}
        onSelectFeed={(feed: StreamFeed) => setActiveFeed(feed)}
      />

      {/* Detailed Stream Information & Schedule */}
      <StreamInfo stream={stream} />

      {/* Related Events in Category */}
      <RelatedStreams
        currentStreamId={stream.id}
        category={stream.category}
        allStreams={streams}
      />

    </div>
  );
};
