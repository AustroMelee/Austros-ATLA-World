import React from 'react';
import { 
  FaChild, 
  FaUserGraduate, 
  FaUserTie, 
  FaUserFriends, 
  FaUserNinja, 
  FaShieldAlt, 
  FaUserSecret, 
  FaGraduationCap, 
  FaFire, 
  FaUserSlash,
  FaUsers,
  FaUtensils,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaPaw,
  FaGhost
} from 'react-icons/fa';

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
  const coreFilters = ['characters', 'foods', 'locations', 'groups', 'fauna', 'spirits'];

  // Character subfilter icons mapping
  const characterSubfilterIcons: Record<string, React.ReactNode> = {
    'child': <FaChild className="w-5 h-5" />,
    'teen': <FaUserGraduate className="w-5 h-5" />,
    'young adult': <FaUserTie className="w-5 h-5" />,
    'adult': <FaUserFriends className="w-5 h-5" />,
    'elder': <FaUserNinja className="w-5 h-5" />,
    'heroes': <FaShieldAlt className="w-5 h-5" />,
    'villains': <FaUserSecret className="w-5 h-5" />,
    'mentors': <FaGraduationCap className="w-5 h-5" />,
    'bender': <FaFire className="w-5 h-5" />,
    'nonbender': <FaUserSlash className="w-5 h-5" />
  };

  // Character subfilter text colors mapping
  const characterSubfilterColors: Record<string, string> = {
    'child': 'text-yellow-300',
    'teen': 'text-blue-300',
    'young adult': 'text-green-300',
    'adult': 'text-purple-300',
    'elder': 'text-gray-300',
    'heroes': 'text-green-400',
    'villains': 'text-red-400',
    'mentors': 'text-blue-400',
    'bender': 'text-orange-400',
    'nonbender': 'text-gray-400'
  };

  // Core filter icons and colors mapping
  const coreFilterIcons: Record<string, React.ReactNode> = {
    'characters': <FaUsers className="w-5 h-5" />,
    'foods': <FaUtensils className="w-5 h-5" />,
    'locations': <FaMapMarkerAlt className="w-5 h-5" />,
    'groups': <FaLayerGroup className="w-5 h-5" />,
    'fauna': <FaPaw className="w-5 h-5" />,
    'spirits': <FaGhost className="w-5 h-5" />
  };

  const coreFilterColors: Record<string, string> = {
    'characters': 'text-blue-400',
    'foods': 'text-orange-400',
    'locations': 'text-green-400',
    'groups': 'text-purple-400',
    'fauna': 'text-yellow-400',
    'spirits': 'text-cyan-400'
  };

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
                  borderColor: isActive ? color : '#70ab6c',
                  boxShadow: isActive ? `0 0 15px ${glow}, 0 0 5px ${color}` : 'none',
                }}
                aria-label={`Filter by ${key} nation`}
              >
                <img 
                  src={image}
                  alt={`${key} nation`}
                  className={`w-6 h-6 transition-all ${isActive ? 'filter brightness-200 drop-shadow-[0_0_8px_rgba(200,255,200,0.8)]' : 'filter brightness-150'}`}
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
            const isActive = activeCoreFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => onSetCoreFilter(filter)}
                className={`px-4 py-2 rounded-none border-2 font-perfect-dos text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? 'bg-black backdrop-blur-sm border-[#c8ffc8] text-[#c8ffc8] crt-glow-text-subtle shadow-[0_0_15px_rgba(200,255,200,0.6)]'
                      : 'bg-black backdrop-blur-sm border-[#70ab6c] text-[#70ab6c] hover:border-[#c8ffc8] hover:text-[#70ab6c] hover:bg-black'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`${isActive ? 'filter brightness-200 drop-shadow-[0_0_8px_rgba(200,255,200,0.8)]' : ''}`}>
                    {coreFilterIcons[filter]}
                  </div>
                  <span className={isActive ? 'text-[#c8ffc8]' : coreFilterColors[filter] || 'text-[#70ab6c]'}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </span>
                </div>
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
                      px-4 py-2 rounded-md 
                      bg-black backdrop-blur-sm 
                      border-2 border-[#70ab6c]/40
                      font-perfect-dos text-sm font-bold
                      transition-all duration-200
                      crt-screen
                      active:scale-95 
                      shadow-lg
                      ${isActive
                        ? 'bg-[#70ab6c] border-[#70ab6c] text-black shadow-[0_0_10px_rgba(112,171,108,0.8)]'
                        : 'text-[#c8ffc8] hover:bg-[#70ab6c]/60 hover:border-[#70ab6c] hover:text-black hover:shadow-[0_0_8px_rgba(112,171,108,0.6)]'
                      }
                    `}
                  >
                    {activeCoreFilter === 'characters' && characterSubfilterIcons[subFilter.key] ? (
                      <div className="flex items-center gap-2">
                        <div className={`${isActive ? 'filter brightness-200 drop-shadow-[0_0_8px_rgba(200,255,200,0.8)]' : ''}`}>
                          {characterSubfilterIcons[subFilter.key]}
                        </div>
                        <span className={characterSubfilterColors[subFilter.key] || 'text-[#c8ffc8]'}>
                          {subFilter.key.charAt(0).toUpperCase() + subFilter.key.slice(1)}
                        </span>
                      </div>
                    ) : subFilter.symbol ? (
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