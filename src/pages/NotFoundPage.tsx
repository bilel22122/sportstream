import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-surface border border-surface-border p-8 sm:p-16 text-center max-w-lg mx-auto my-16 shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-sports-red/20 text-sports-red flex items-center justify-center mx-auto mb-4 border border-sports-red/30">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-wider text-white mb-2">
        404
      </h1>
      <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-300 mb-3">
        Page Not Found
      </h2>
      <p className="text-slate-400 text-xs sm:text-sm mb-8 leading-relaxed">
        The page you are looking for does not exist or has been moved. Explore all live and scheduled games on the home directory.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sports-red hover:bg-sports-red-dark text-white font-bold text-xs uppercase tracking-wider shadow-glow-red transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Sports Directory</span>
      </Link>
    </div>
  );
};
