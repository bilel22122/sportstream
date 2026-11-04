import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldAlert, Radio, Clock, RefreshCw } from 'lucide-react';
import { useStreams } from '../../context/StreamsContext';

export const Footer: React.FC = () => {
  const { lastUpdated, streams, categories } = useStreams();

  return (
    <footer className="w-full bg-background-subtle border-t border-surface-border text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-surface-border">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sports-red flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-white">
                SPORT<span className="text-sports-red">STREAM</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Professional live sports directory providing schedule indexing, category organization, and public broadcast metadata in real time.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sports-red" />
                <span>{streams.length} Total Streams Indexed</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sports-blue" />
                <span>{categories.length} Sports Categories</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Directory Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  All Sports Schedule
                </Link>
              </li>
              <li>
                <Link to="/?status=live" className="hover:text-sports-red-light transition-colors">
                  Live Broadcasts
                </Link>
              </li>
              <li>
                <Link to="/?status=upcoming" className="hover:text-sports-blue-light transition-colors">
                  Upcoming Matches
                </Link>
              </li>
              <li>
                <Link to="/?status=always_live" className="hover:text-purple-300 transition-colors">
                  24/7 Sports Channels
                </Link>
              </li>
            </ul>
          </div>

          {/* Data & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Sync & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>Auto-refresh: 60s interval</span>
              </li>
              {lastUpdated && (
                <li className="text-[11px] text-slate-400">
                  Last sync: {lastUpdated.toLocaleTimeString()}
                </li>
              )}
              <li className="pt-2">
                <a
                  href="mailto:support@sportstream.directory"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Contact SPORTSTREAM Support: support@sportstream.directory');
                  }}
                  className="inline-flex items-center text-xs text-sports-blue hover:underline"
                >
                  Contact SPORTSTREAM Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Informational Disclaimer as required */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300 font-semibold">Disclaimer:</strong> SPORTSTREAM is an independent directory application that aggregates publicly accessible sports metadata via the PPV.st public API. This platform is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any sports league, team, broadcaster, network, or content rights holder. All product names, logos, and brands are property of their respective owners.
            </p>
          </div>
          <div className="shrink-0 text-slate-400 text-[11px]">
            &copy; {new Date().getFullYear()} SPORTSTREAM. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
