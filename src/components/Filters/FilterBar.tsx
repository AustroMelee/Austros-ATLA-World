import React from 'react';
import {
  nations,
  coreFilters,
  characterSubfilterIcons,
  characterSubfilterColors,
  faunaSubfilterIcons,
  faunaSubfilterColors,
  episodeSubfilterIcons,
  episodeSubfilterColors,
  coreFilterIcons,
  coreFilterColors,
} from './filterConstants';

interface FilterBarProps {
  activeNations: Set<string>;
  onToggleNation: (nation: string) => void;
  activeCoreFilter: string | null;
  onSetCoreFilter: (filter: string | null) => void;
  activeSubFilters: Set<string>;
  onToggleSubFilter: (subFilter: string) => void;
  subFilterOptions: Array<{key: string, symbol?: React.ReactNode}>;
}

export default function FilterBar({
  activeNations,
  onToggleNation,
  activeCoreFilter,
  onSetCoreFilter,
  activeSubFilters,
  onToggleSubFilter,
  subFilterOptions,
}: FilterBarProps) {

  return (
    <div className="w-full max-w-4xl mb-6 flex flex-col items-center">
      {/* Nations Filter - Glowing Terminal Indicators */}
      <div className="mb-4 flex justify-center">
        <div className="flex flex-wrap gap-3 justify-center">
          {nations.map(({ key, image, color, glow }: { key: string; image: string; color: string; glow: string }) => {
            const isActive = activeNations.has(key);
            return (
              <button
                key={key}
                onClick={() => onToggleNation(key)}
                className={`
                  relative w-12 h-12 rounded-full 
                  bg-black 
                  border-2 
                  transition-all duration-300 ease-in-out
                  transform hover:scale-110
                  flex items-center justify-center
                  ${isActive 
                    ? 'border-opacity-100 scale-110' 
                    : 'border-opacity-40'
                  }
                `}
                style={{
                  borderColor: isActive ? color : 'rgba(112, 171, 108, 0.4)',
                  boxShadow: isActive 
                    ? `0 0 20px ${glow}, inset 0 0 20px ${glow}` 
                    : 'none'
                }}
                aria-label={`Filter by ${key} nation`}
              >
                <img 
                  src={image} 
                  alt={`${key} nation`}
                  className="w-8 h-8 object-contain"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Filters - Perfect DOS Font */}
      <div className="mb-4 flex justify-center">
        <div className="flex flex-wrap gap-2 justify-center">
          {coreFilters.map((filter: string) => {
            const isActive = activeCoreFilter === filter;
            const icon = coreFilterIcons[filter];
            const color = coreFilterColors[filter];
            
            return (
              <button
                key={filter}
                onClick={() => onSetCoreFilter(isActive ? null : filter)}
                className={`
                  px-4 py-2 rounded-lg
                  font-perfect-dos font-bold text-sm
                  transition-all duration-300 ease-in-out
                  transform hover:scale-105
                  border-2
                  ${isActive 
                    ? 'bg-green-900 border-green-400 text-green-400 shadow-[0_0_15px_rgba(112,171,108,0.6)]' 
                    : 'bg-black border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }
                `}
                aria-label={`Filter by ${filter}`}
              >
                <div className="flex items-center gap-2">
                  <span className={color}>{icon}</span>
                  <span className="capitalize">{filter}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Filters - Dynamic Options */}
      {activeCoreFilter && subFilterOptions.length > 0 && (
        <div className="mb-4 flex justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {subFilterOptions.map(({ key, symbol }) => {
              const isActive = activeSubFilters.has(key);
              let icon, color;
              
              if (activeCoreFilter === 'fauna') {
                icon = faunaSubfilterIcons[key];
                color = faunaSubfilterColors[key];
              } else if (activeCoreFilter === 'episodes') {
                icon = episodeSubfilterIcons[key];
                color = episodeSubfilterColors[key];
              } else {
                icon = characterSubfilterIcons[key];
                color = characterSubfilterColors[key];
              }
              
              return (
                <button
                  key={key}
                  onClick={() => onToggleSubFilter(key)}
                  className={`
                    px-3 py-2 rounded-lg
                    font-perfect-dos text-sm
                    transition-all duration-300 ease-in-out
                    transform hover:scale-105
                    border-2
                    ${isActive 
                      ? 'bg-green-900 border-green-400 text-green-400 shadow-[0_0_15px_rgba(112,171,108,0.6)]' 
                      : 'bg-black border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                    }
                  `}
                  aria-label={`Filter by ${key}`}
                >
                  <div className="flex items-center gap-2">
                    {icon && <span className="text-green-400">{icon}</span>}
                    {symbol ? (
                      <span className="text-green-400">{symbol}</span>
                    ) : (
                      <span className={`capitalize ${color || 'text-gray-300'}`}>
                        {key}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 