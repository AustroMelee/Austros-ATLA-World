import React from 'react';

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
  const nations = [
    { key: 'air', image: '/assets/images/air_nation.png', color: '#FF9933', glow: '#FF993350' },
    { key: 'water', image: '/assets/images/water_nation.png', color: '#60A5FA', glow: '#60A5FA50' },
    { key: 'earth', image: '/assets/images/earth_nation.png', color: '#34D399', glow: '#34D39950' },
    { key: 'fire', image: '/assets/images/fire_nation.png', color: '#F87171', glow: '#F8717150' }
  ];
  const coreFilters = ['characters', 'foods', 'locations', 'bending', 'fauna', 'spirits'];

  return (
    <div className="w-full max-w-4xl mb-6 flex flex-col items-center">
      {/* Nations Filter - Glowing Terminal Indicators */}
      <div className="mb-4 flex justify-center">
        <div className="flex flex-wrap gap-3 justify-center">
          {nations.map(({ key, image, color, glow }) => {
            const isActive = activeNations.has(key);
            return (
              <button
                key={key}
                onClick={() => onToggleNation(key)}
                className={`
                  relative w-12 h-12 rounded-full 
                  bg-black/40 backdrop-blur-sm 
                  border-2 
                  transition-all duration-300 ease-in-out
                  transform hover:scale-110
                  flex items-center justify-center
                  ${isActive 
                    ? 'border-opacity-100 scale-110' 
                    : 'border-opacity-40 opacity-60 hover:opacity-100'
                  }
                `}
                style={{
                  borderColor: isActive ? color : '#70ab6c',
                  boxShadow: isActive ? `0 0 15px ${glow}, 0 0 5px ${color}` : 'none',
                }}
                aria-label={`Filter by ${key} nation`}
              >
                <img 
                  src={image}
                  alt={`${key} nation`}
                  className={`w-6 h-6 transition-all ${isActive ? 'filter brightness-200 drop-shadow-[0_0_8px_rgba(200,255,200,0.8)]' : ''}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Filters - Sharp Terminal Keys */}
      <div className="mb-4 flex justify-center">
        <div className="flex flex-wrap gap-2 justify-center">
          {coreFilters.map((filter) => {
            return (
              <button
                key={filter}
                onClick={() => onSetCoreFilter(filter)}
                className={`px-4 py-2 rounded-none border-2 font-tty-glass text-sm transition-all duration-300 transform hover:scale-105 ${
                    activeCoreFilter === filter
                      ? 'bg-black/60 backdrop-blur-sm border-[#c8ffc8] text-[#c8ffc8] crt-glow-text-subtle shadow-[0_0_15px_rgba(200,255,200,0.6)]'
                      : 'bg-black/40 backdrop-blur-sm border-[#70ab6c] text-[#70ab6c] hover:border-[#c8ffc8] hover:text-[#c8ffc8] hover:bg-black/50'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub Filters - Terminal Keys */}
      {activeCoreFilter && subFilterOptions.length > 0 && (
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap gap-2 justify-center">
              {subFilterOptions.map((subFilter) => {
                const isActive = activeSubFilters.has(subFilter.key);
                return (
                  <button
                    key={subFilter.key}
                    onClick={() => onToggleSubFilter(subFilter.key)}
                    className={`
                      px-3 py-1 rounded-md 
                      bg-black/40 backdrop-blur-sm 
                      border border-[#70ab6c]/30
                      font-tty-glass text-xs 
                      transition-all duration-200
                      crt-screen
                      active:scale-95 
                      ${isActive
                        ? 'bg-[#70ab6c]/20 border-[#70ab6c]/60 text-[#c8ffc8] crt-glow-text'
                        : 'text-[#70ab6c] hover:bg-[#70ab6c]/10 hover:border-[#70ab6c]/50 hover:text-[#c8ffc8] crt-glow-text-subtle'
                      }
                    `}
                  >
                    {subFilter.symbol ? (
                      <div className={`${isActive ? 'filter brightness-200 drop-shadow-[0_0_8px_rgba(200,255,200,0.8)]' : ''}`}>
                        {subFilter.symbol}
                      </div>
                    ) : (
                      subFilter.key.charAt(0).toUpperCase() + subFilter.key.slice(1)
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 