/**
 * Maps sports categories to appropriate themes, gradients, and icon keys
 */
export interface SportVisualTheme {
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
}

export function getSportTheme(categoryName?: string): SportVisualTheme {
  const norm = (categoryName || '').toLowerCase().trim();

  if (norm.includes('football') && !norm.includes('american') && !norm.includes('australian')) {
    // Soccer / Football
    return {
      primaryColor: '#10b981',
      secondaryColor: '#047857',
      gradient: 'from-emerald-900/80 via-slate-900 to-black',
      iconName: 'Goal',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badgeText: 'Football',
    };
  }

  if (norm.includes('american football')) {
    return {
      primaryColor: '#ea580c',
      secondaryColor: '#9a3412',
      gradient: 'from-orange-950/80 via-slate-900 to-black',
      iconName: 'Shield',
      badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      badgeText: 'American Football',
    };
  }

  if (norm.includes('basketball')) {
    return {
      primaryColor: '#f97316',
      secondaryColor: '#c2410c',
      gradient: 'from-amber-950/80 via-slate-900 to-black',
      iconName: 'Trophy',
      badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badgeText: 'Basketball',
    };
  }

  if (norm.includes('motor') || norm.includes('f1') || norm.includes('racing')) {
    return {
      primaryColor: '#ef4444',
      secondaryColor: '#991b1b',
      gradient: 'from-red-950/90 via-slate-900 to-black',
      iconName: 'Flag',
      badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30',
      badgeText: 'Motorsports',
    };
  }

  if (norm.includes('hockey')) {
    return {
      primaryColor: '#06b6d4',
      secondaryColor: '#0e7490',
      gradient: 'from-cyan-950/80 via-slate-900 to-black',
      iconName: 'Snowflake',
      badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      badgeText: 'Ice Hockey',
    };
  }

  if (norm.includes('cricket')) {
    return {
      primaryColor: '#84cc16',
      secondaryColor: '#4d7c0f',
      gradient: 'from-lime-950/80 via-slate-900 to-black',
      iconName: 'Activity',
      badgeBg: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
      badgeText: 'Cricket',
    };
  }

  if (norm.includes('rugby') || norm.includes('australian')) {
    return {
      primaryColor: '#8b5cf6',
      secondaryColor: '#6d28d9',
      gradient: 'from-purple-950/80 via-slate-900 to-black',
      iconName: 'Zap',
      badgeBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      badgeText: 'Rugby',
    };
  }

  if (norm.includes('golf')) {
    return {
      primaryColor: '#22c55e',
      secondaryColor: '#15803d',
      gradient: 'from-green-950/80 via-slate-900 to-black',
      iconName: 'Compass',
      badgeBg: 'bg-green-500/20 text-green-400 border-green-500/30',
      badgeText: 'Golf',
    };
  }

  if (norm.includes('combat') || norm.includes('mma') || norm.includes('boxing')) {
    return {
      primaryColor: '#e11d48',
      secondaryColor: '#881337',
      gradient: 'from-rose-950/90 via-slate-900 to-black',
      iconName: 'Swords',
      badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      badgeText: 'Combat Sports',
    };
  }

  if (norm.includes('24/7')) {
    return {
      primaryColor: '#00d2ff',
      secondaryColor: '#0369a1',
      gradient: 'from-sky-950/80 via-slate-900 to-black',
      iconName: 'Tv',
      badgeBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      badgeText: '24/7 Channels',
    };
  }

  // Default theme
  return {
    primaryColor: '#ff2d4a',
    secondaryColor: '#1e293b',
    gradient: 'from-slate-900 via-surface to-black',
    iconName: 'PlayCircle',
    badgeBg: 'bg-slate-700/50 text-slate-300 border-slate-600',
    badgeText: categoryName || 'Sports',
  };
}

/**
 * Sanitizes poster URLs and verifies valid format
 */
export function sanitizePosterUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return null;
}
