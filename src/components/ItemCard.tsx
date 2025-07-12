import React from 'react';

interface ItemCardProps {
  name: string;
  type: string;
  tags: string[];
  nation: string;
  icon: React.ReactNode;
  expanded?: boolean;
  inCollection?: boolean;
  onAdd?: () => void;
  onExpand?: () => void;
}

const nationAccent: Record<string, string> = {
  'Earth Kingdom': 'border-l-nation-earth',
  'Fire Nation': 'border-l-nation-fire',
  'Water Tribe': 'border-l-nation-water',
  'Air Nomads': 'border-l-nation-air',
};

export default function ItemCard({
  name,
  type,
  tags,
  nation,
  icon,
  expanded = false,
  inCollection = false,
  onAdd,
  onExpand,
}: ItemCardProps) {
  const isInteractive = typeof onExpand === 'function';
  const interactiveProps = isInteractive
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick: onExpand,
        onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onExpand();
          }
        },
        'aria-expanded': expanded,
      }
    : {};
  return (
    <div
      className={`relative bg-slate-800 text-slate-100 rounded-xl p-5 shadow border-l-4 ${nationAccent[nation] || 'border-l-slate-600'} transition-transform duration-200 cursor-pointer ${expanded ? 'scale-105 z-10' : 'hover:scale-105'} mb-2`}
      {...interactiveProps}
    >
      <button
        className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-lg font-bold transition-colors ${inCollection ? 'bg-nation-earth text-slate-900' : 'hover:bg-nation-water hover:text-white'}`}
        title={inCollection ? 'In Collection' : 'Add to Collection'}
        onClick={e => { e.stopPropagation(); onAdd && onAdd(); }}
        aria-pressed={inCollection}
      >
        {inCollection ? '✓' : '+'}
      </button>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center text-3xl bg-slate-900 rounded-lg border border-slate-700">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">{name}</h2>
          <p className="text-slate-400 text-sm mb-1">{type} • {tags.join(', ')}</p>
        </div>
      </div>
      {/* Expansion content can be added here if needed */}
    </div>
  );
}
