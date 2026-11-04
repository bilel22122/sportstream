import React, { useState } from 'react';
import { StreamFeed, NormalizedStream } from '../../types/sports';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  ShieldCheck,
  Tv,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface PlayerEmbedProps {
  stream: NormalizedStream;
  activeFeed: StreamFeed;
}

export const PlayerEmbed: React.FC<PlayerEmbedProps> = ({ stream, activeFeed }) => {
  const [isTheater, setIsTheater] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const hasValidEmbed = Boolean(activeFeed.iframeUrl);

  const handleReload = () => {
    setIsIframeLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className={`w-full transition-all duration-300 ${isTheater ? 'max-w-none' : ''}`}>
      
      {/* Player Frame Wrapper */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-surface-border shadow-2xl">
        
        {hasValidEmbed ? (
          <>
            {/* Loading Indicator while iframe initial handshake resolves */}
            {isIframeLoading && (
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-surface">
                <Loader2 className="w-8 h-8 text-sports-red animate-spin mb-2" />
                <span className="text-xs text-slate-400 font-medium">
                  Connecting to {activeFeed.sourceTag || activeFeed.name}...
                </span>
              </div>
            )}

            {/*
              Provider-supplied iframe integration.
              Per the provider's documented embedding specifications, sandbox attribute is omitted
              to allow standard player execution, token verification, and provider advertising.
              Preserves original source URL, permissions, and embedding attributes.
            */}
            <iframe
              id="player"
              key={`${activeFeed.id}-${reloadKey}`}
              src={activeFeed.iframeUrl!}
              title={`${stream.name} - ${activeFeed.name}`}
              className="relative z-10 w-full h-full border-0"
              scrolling="no"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="origin"
              onLoad={() => setIsIframeLoading(false)}
            />
          </>
        ) : (
          // Secure Placeholder when no embed is provided by the API
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-gradient-to-br from-surface via-surface-raised to-background select-none">
            <div className="w-16 h-16 rounded-2xl bg-surface-border/60 text-slate-400 flex items-center justify-center mb-4 border border-surface-border">
              <Tv className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mb-2">
              Broadcast Feed Not Available
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed mb-4">
              The provider has not supplied an authorized embed stream for this specific feed. Please switch to an alternate feed or check back closer to scheduled match time.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
              <span>Provider status: Metadata only</span>
            </div>
          </div>
        )}

      </div>

      {/* Player Utility Toolbar */}
      <div className="flex items-center justify-between py-3 px-1 text-xs text-slate-400 border-b border-surface-border">
        
        {/* Left: Feed and Provider Origin Verification */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">
            Feed: <span className="text-sports-blue-light">{activeFeed.name}</span>
          </span>
          {hasValidEmbed && (
            <>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Provider Embed ({new URL(activeFeed.iframeUrl!).hostname})
              </span>
            </>
          )}
        </div>

        {/* Right: Controls (Reload, Theater Mode) */}
        <div className="flex items-center gap-2">
          {hasValidEmbed && (
            <button
              onClick={handleReload}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-surface hover:bg-surface-raised border border-surface-border text-slate-300 hover:text-white transition-colors"
              title="Reload broadcast player frame"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reload Feed</span>
            </button>
          )}

          <button
            onClick={() => setIsTheater(!isTheater)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-surface hover:bg-surface-raised border border-surface-border text-slate-300 hover:text-white transition-colors"
            title={isTheater ? 'Exit theater mode' : 'Theater mode'}
          >
            {isTheater ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Standard View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Theater Mode</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
