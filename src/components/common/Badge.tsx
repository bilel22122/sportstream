import React from 'react';
import { StreamStatus } from '../../types/sports';
import { Radio, Clock, Tv, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: StreamStatus;
  statusText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusText,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  switch (status) {
    case 'live':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-sports-red/20 text-white border border-sports-red/60 shadow-glow-red uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sports-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sports-red"></span>
          </span>
          <Radio className="w-3.5 h-3.5 text-sports-red animate-pulse" />
          <span>{statusText || 'LIVE NOW'}</span>
        </span>
      );

    case 'upcoming':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-sports-blue/15 text-sports-blue-light border border-sports-blue/40 tracking-wide font-medium ${sizeClasses} ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-sports-blue" />
          <span>{statusText || 'Upcoming'}</span>
        </span>
      );

    case 'always_live':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/40 tracking-wide font-medium ${sizeClasses} ${className}`}
        >
          <Tv className="w-3.5 h-3.5 text-purple-400" />
          <span>{statusText || '24/7 Channel'}</span>
        </span>
      );

    case 'ended':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-800 text-slate-400 border border-slate-700 tracking-wide ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{statusText || 'Concluded'}</span>
        </span>
      );

    case 'unknown':
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 tracking-wide ${sizeClasses} ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>{statusText || 'On Air'}</span>
        </span>
      );
  }
};

interface QualityBadgeProps {
  quality?: 'HD' | 'SD' | '4K' | 'Unknown';
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ quality }) => {
  if (!quality || quality === 'Unknown') return null;

  const colorClasses = {
    '4K': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'HD': 'bg-sports-blue/20 text-sports-blue-light border-sports-blue/40',
    'SD': 'bg-slate-700/60 text-slate-300 border-slate-600',
  }[quality];

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colorClasses}`}
    >
      {quality}
    </span>
  );
};
