import React from 'react';
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
} from 'lucide-react';

interface FallbackPosterProps {
  name: string;
  category: string;
  tag?: string;
  className?: string;
  colors?: string[];
}

export const FallbackPoster: React.FC<FallbackPosterProps> = ({
  name,
  category,
  tag,
  className = '',
  colors,
}) => {
  const theme = getSportTheme(category);

  // Render sport category icon
  const renderIcon = () => {
    const iconClass = "w-10 h-10 opacity-70 group-hover:scale-110 transition-transform duration-300";
    switch (theme.iconName) {
      case 'Goal':
        return <Goal className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Shield':
        return <Shield className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Trophy':
        return <Trophy className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Flag':
        return <Flag className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Snowflake':
        return <Snowflake className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Activity':
        return <Activity className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Compass':
        return <Compass className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Swords':
        return <Swords className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Tv':
        return <Tv className={iconClass} style={{ color: theme.primaryColor }} />;
      case 'Zap':
        return <Zap className={iconClass} style={{ color: theme.primaryColor }} />;
      default:
        return <PlayCircle className={iconClass} style={{ color: theme.primaryColor }} />;
    }
  };

  // Custom inline background if stream colors exist, otherwise use sports theme gradient
  const customBgStyle = colors && colors.length >= 2
    ? { background: `linear-gradient(135deg, ${colors[0]} 0%, #0a0f1d 70%, ${colors[1]} 100%)` }
    : undefined;

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-4 overflow-hidden select-none bg-gradient-to-br ${theme.gradient} ${className}`}
      style={customBgStyle}
    >
      {/* Dynamic diagonal sports stripes background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`stripe-${category.replace(/\s+/g, '')}`} width="40" height="40" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#ffffff" strokeWidth="6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#stripe-${category.replace(/\s+/g, '')})`} />
        </svg>
      </div>

      {/* Top row: Sport Tag & Category */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur text-slate-200 border border-white/10">
          {category}
        </span>
        {tag && (
          <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-white/10 backdrop-blur text-slate-300">
            {tag}
          </span>
        )}
      </div>

      {/* Center icon with subtle pulse */}
      <div className="relative z-10 flex items-center justify-center my-auto py-2">
        <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-lg">
          {renderIcon()}
        </div>
      </div>

      {/* Bottom title preview */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
          {name}
        </p>
      </div>
    </div>
  );
};
