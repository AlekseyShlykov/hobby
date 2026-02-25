'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PlaceholderImageProps {
  name: string;
  width?: number;
  height?: number;
  /** When true, the image container fills the parent (100% width/height). Use inside aspect-square or fixed-size containers. */
  fill?: boolean;
  className?: string;
}

// Dreamy watercolor palette for placeholders
const colorMap: Record<string, { from: string; to: string }> = {
  // OCEAN (used only in RIASEC block now; OCEAN has no image)
  'q1': { from: '#c4b5fd', to: '#a78bfa' },
  'q2': { from: '#ddd6fe', to: '#c4b5fd' },
  'q3': { from: '#93c5fd', to: '#60a5fa' },
  'q4': { from: '#7dd3fc', to: '#38bdf8' },
  'q5': { from: '#fcd34d', to: '#fbbf24' },
  'q6': { from: '#fde68a', to: '#fcd34d' },
  'q7': { from: '#86efac', to: '#4ade80' },
  'q8': { from: '#6ee7b7', to: '#34d399' },
  'q9': { from: '#f9a8d4', to: '#f472b6' },
  'q10': { from: '#fbcfe8', to: '#f9a8d4' },

  // RIASEC
  'q11': { from: '#d6d3d1', to: '#a8a29e' },
  'q12': { from: '#a7f3d0', to: '#6ee7b7' },
  'q13': { from: '#bae6fd', to: '#7dd3fc' },
  'q14': { from: '#a5f3fc', to: '#67e8f9' },
  'q15': { from: '#f9a8d4', to: '#ec4899' },
  'q16': { from: '#e9d5ff', to: '#d8b4fe' },
  'q17': { from: '#86efac', to: '#4ade80' },
  'q18': { from: '#6ee7b7', to: '#34d399' },
  'q19': { from: '#fdba74', to: '#fb923c' },
  'q20': { from: '#fde68a', to: '#fcd34d' },
  'q21': { from: '#c7d2fe', to: '#a5b4fc' },
  'q22': { from: '#ddd6fe', to: '#c4b5fd' },

  // Visual
  'v1a': { from: '#a7f3d0', to: '#6ee7b7' },
  'v1b': { from: '#67e8f9', to: '#22d3ee' },
  'v1c': { from: '#fde68a', to: '#fcd34d' },
  'v1d': { from: '#f9a8d4', to: '#f472b6' },
  'v2a': { from: '#c7d2fe', to: '#a5b4fc' },
  'v2b': { from: '#a5f3fc', to: '#67e8f9' },
  'v2c': { from: '#ddd6fe', to: '#c4b5fd' },
  'v2d': { from: '#fbcfe8', to: '#f9a8d4' },
  'v3a': { from: '#86efac', to: '#4ade80' },
  'v3b': { from: '#d6d3d1', to: '#a8a29e' },
  'v3c': { from: '#bae6fd', to: '#7dd3fc' },
  'v3d': { from: '#e9d5ff', to: '#d8b4fe' },
  'v4a': { from: '#c4b5fd', to: '#a78bfa' },
  'v4b': { from: '#93c5fd', to: '#60a5fa' },
  'v4c': { from: '#67e8f9', to: '#22d3ee' },
  'v4d': { from: '#fcd34d', to: '#fbbf24' },
  'v5a': { from: '#a7f3d0', to: '#6ee7b7' },
  'v5b': { from: '#86efac', to: '#4ade80' },
  'v5c': { from: '#fdba74', to: '#fb923c' },
  'v5d': { from: '#f9a8d4', to: '#ec4899' },

  // Context
  'c1': { from: '#99f6e4', to: '#5eead4' },
  'c2': { from: '#fde68a', to: '#fcd34d' },
  'c3': { from: '#c4b5fd', to: '#a78bfa' },

  // Hero
  'hero': { from: '#c4b5fd', to: '#a78bfa' },
};

function getGradient(name: string): { from: string; to: string } {
  // Check exact match first
  if (colorMap[name]) return colorMap[name];

  // Check prefix match
  const prefix = name.split('-')[0];
  if (colorMap[prefix]) return colorMap[prefix];

  // Default gradient based on hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return {
    from: `hsl(${hue}, 50%, 50%)`,
    to: `hsl(${(hue + 30) % 360}, 50%, 40%)`
  };
}

function getLabel(name: string): string {
  const labels: Record<string, string> = {
    'q1-openness-new': 'New Horizons',
    'q2-openness-imagination': 'Imagination',
    'q3-conscientiousness-order': 'Order',
    'q4-conscientiousness-finish': 'Finish Line',
    'q5-extraversion-talk': 'Dialogue',
    'q6-extraversion-party': 'Party',
    'q7-agreeableness-care': 'Care',
    'q8-agreeableness-peace': 'Peace',
    'q9-neuroticism-worry': 'Crossroads',
    'q10-neuroticism-mood': 'Mood',
    'q11-realistic-hands': 'Hands',
    'q12-realistic-nature': 'Nature',
    'q13-investigative-howworks': 'How It Works',
    'q14-investigative-puzzle': 'Puzzle',
    'q15-artistic-create': 'Create',
    'q16-artistic-beauty': 'Beauty',
    'q17-social-help': 'Help',
    'q18-social-teach': 'Teach',
    'q19-enterprising-lead': 'Lead',
    'q20-enterprising-win': 'Win',
    'q21-conventional-data': 'Data',
    'q22-conventional-rules': 'Rules',
    'v1a-alone': 'Alone',
    'v1b-small-group': 'Small Group',
    'v1c-party': 'Party',
    'v1d-crowd': 'Crowd',
    'v2a-minimal': 'Minimal',
    'v2b-organized': 'Organized',
    'v2c-creative': 'Creative',
    'v2d-chaos': 'Chaos',
    'v3a-nature': 'Nature',
    'v3b-workshop': 'Workshop',
    'v3c-digital': 'Digital',
    'v3d-stage': 'Stage',
    'v4a-solo': 'Solo',
    'v4b-pair': 'Pair',
    'v4c-team': 'Team',
    'v4d-leader': 'Leader',
    'v5a-meditate': 'Meditate',
    'v5b-walk': 'Walk',
    'v5c-sport': 'Sport',
    'v5d-extreme': 'Extreme',
    'c1-time': 'Time',
    'c2-budget': 'Budget',
    'c3-activity': 'Activity',
    'hero-hobbies': 'Find Your Hobby',
  };

  return labels[name] || name.replace(/-/g, ' ').slice(0, 15);
}

export default function PlaceholderImage({
  name,
  width = 400,
  height = 300,
  fill = false,
  className = '',
}: PlaceholderImageProps) {
  const gradient = getGradient(name);
  const label = getLabel(name);
  const [imageError, setImageError] = useState(false);

  // basePath is required for GitHub Pages; Next.js does not add it to Image src in static export
  const basePath = typeof process.env.NEXT_PUBLIC_BASE_PATH === 'string' ? process.env.NEXT_PUBLIC_BASE_PATH : '';

  // Determine image path based on name pattern (include basePath for static host)
  const getImagePath = (name: string): string => {
    const root = basePath || '';
    if (name.startsWith('hero')) return `${root}/images/${name}.png`;
    if (name.startsWith('v')) return `${root}/images/visual/${name}.png`;
    if (name.startsWith('c')) return `${root}/images/context/${name}.png`;
    if (name.startsWith('q')) return `${root}/images/questions/${name}.png`;
    return `${root}/images/${name}.png`;
  };

  const imagePath = getImagePath(name);

  const containerStyle = fill
    ? { width: '100%', height: '100%', borderRadius: '1rem' as const }
    : { width: '100%', height, maxWidth: width, borderRadius: '1rem' as const };

  // If real image exists and loaded successfully, show it
  if (!imageError) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={containerStyle}
      >
        <Image
          src={imagePath}
          alt={label}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          priority={name.startsWith('hero')}
        />
      </div>
    );
  }

  // Fallback to gradient placeholder if image not found
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ ...containerStyle, background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
    >
      {/* Subtle overlay pattern for depth */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
        }}
      />
      <span className="relative text-slate-700 font-semibold text-lg drop-shadow-sm text-center px-4 tracking-wide">
        {label}
      </span>
    </div>
  );
}
