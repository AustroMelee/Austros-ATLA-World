import React from 'react';
import type { EnrichedCharacter } from '../../types/domainTypes';

interface ItemCardProps {
  item: EnrichedCharacter;
  expanded: boolean;
  onExpand: () => void;
  onAddToCollection?: () => void;
}

function toTitleCase(str?: string): string {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export default function ItemCard({ item, expanded, onExpand, onAddToCollection }: ItemCardProps) {
  const iconText = (item.name || 'UNK').substring(0, 3).toUpperCase();
  const nationInitial = item.nation?.charAt(0).toUpperCase() || '?';
  
  const baseClasses = "w-full text-left transition-all duration-300 ease-in-out rounded-xl";
  const expandedClasses = expanded ? "bg-slate-800 ring-2 ring-blue-500 p-4" : "bg-slate-800 hover:bg-slate-700 p-3";

  return (
    <div
      onClick={onExpand} // Always allow toggle
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onExpand()} // Always allow toggle
      aria-expanded={expanded}
      aria-label={`View details for ${item.name}`}
      className={`${baseClasses} ${expandedClasses}`}
    >
      {/* Header (visible in both states, slightly different layout) */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 flex-shrink-0 bg-slate-700 rounded-lg flex items-center justify-center">
          <span className="font-bold text-slate-300">{iconText}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{toTitleCase(item.name)}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            {item.nation && <span>{toTitleCase(item.nation)}</span>}
            {item.bendingElement && <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full">{toTitleCase(item.bendingElement)}</span>}
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
          {expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCollection?.(); }}
              className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-lg hover:bg-slate-600"
              aria-label={`Add ${item.name} to a collection`}
            >
              +
            </button>
          )}
          <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border border-slate-500">
            {nationInitial}
          </div>
        </div>
      </div>

      {/* Default/Compact Description */}
      {!expanded && (
        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.description}</p>
      )}

      {/* Expanded Detail View */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-3 text-sm text-slate-300">
          <p>{item.overview || item.description}</p>
          {item.highlights && item.highlights.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-1">Highlights:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {item.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}
           {item.traits && item.traits.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-1">Traits:</h4>
              <p className="text-slate-400">{item.traits.join(', ')}</p>
            </div>
          )}
          {item.quotes && item.quotes.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-1">Quotes:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {item.quotes.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
