import React from 'react';
import {
  FaChild,
  FaUserGraduate,
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
  FaGhost,
  FaPlay,
} from 'react-icons/fa';

export const nations = [
  { key: 'air', image: '/assets/images/air_nation.png', color: '#FF9933', glow: '#FF993350' },
  { key: 'water', image: '/assets/images/water_nation.png', color: '#60A5FA', glow: '#60A5FA50' },
  { key: 'earth', image: '/assets/images/earth_nation.png', color: '#34D399', glow: '#34D39950' },
  { key: 'fire', image: '/assets/images/fire_nation.png', color: '#F87171', glow: '#F8717150' },
];

export const coreFilters = ['characters', 'foods', 'locations', 'groups', 'fauna', 'spirits', 'episodes'];

export const characterSubfilterIcons: Record<string, React.ReactNode> = {
  child: <FaChild className="w-5 h-5" />,
  teen: <FaUserGraduate className="w-5 h-5" />,
  adult: <FaUserFriends className="w-5 h-5" />,
  elder: <FaUserNinja className="w-5 h-5" />,
  heroes: <FaShieldAlt className="w-5 h-5" />,
  villains: <FaUserSecret className="w-5 h-5" />,
  mentors: <FaGraduationCap className="w-5 h-5" />,
  bender: <FaFire className="w-5 h-5" />,
  nonbender: <FaUserSlash className="w-5 h-5" />,
};

export const faunaSubfilterIcons: Record<string, React.ReactNode> = {
  predators_hunters: <FaShieldAlt className="w-5 h-5" />,
  domesticated_mounts: <FaPaw className="w-5 h-5" />,
  aquatic_marine: <FaGhost className="w-5 h-5" />,
  flying_aerial: <FaGhost className="w-5 h-5" />,
  sacred_spiritual: <FaGhost className="w-5 h-5" />,
  hybrid_mixed: <FaGhost className="w-5 h-5" />,
  small_insects: <FaGhost className="w-5 h-5" />,
  reptiles_amphibians: <FaGhost className="w-5 h-5" />,
};

export const characterSubfilterColors: Record<string, string> = {
  child: 'text-yellow-300',
  teen: 'text-blue-300',
  adult: 'text-purple-300',
  elder: 'text-gray-300',
  heroes: 'text-green-400',
  villains: 'text-red-400',
  mentors: 'text-blue-400',
  bender: 'text-orange-400',
  nonbender: 'text-gray-400',
};

export const faunaSubfilterColors: Record<string, string> = {
  predators_hunters: 'text-red-400',
  domesticated_mounts: 'text-green-400',
  aquatic_marine: 'text-blue-400',
  flying_aerial: 'text-cyan-400',
  sacred_spiritual: 'text-purple-400',
  hybrid_mixed: 'text-yellow-400',
  small_insects: 'text-orange-400',
  reptiles_amphibians: 'text-gray-400',
};

export const episodeSubfilterIcons: Record<string, React.ReactNode> = {
  series_premiere: <FaPlay className="w-5 h-5" />,
  avatar_discovery: <FaShieldAlt className="w-5 h-5" />,
  airbending: <FaFire className="w-5 h-5" />,
  waterbending: <FaFire className="w-5 h-5" />,
  fire_nation: <FaFire className="w-5 h-5" />,
  iceberg: <FaGhost className="w-5 h-5" />,
  flying_bison: <FaPaw className="w-5 h-5" />,
  hundred_year_war: <FaShieldAlt className="w-5 h-5" />,
  southern_water_tribe: <FaMapMarkerAlt className="w-5 h-5" />,
  prince_zuko: <FaUserSecret className="w-5 h-5" />,
  uncle_iroh: <FaUserGraduate className="w-5 h-5" />,
  gran_gran: <FaUserFriends className="w-5 h-5" />,
  penguin_sledding: <FaPaw className="w-5 h-5" />,
  booby_trap: <FaShieldAlt className="w-5 h-5" />,
  flare_signal: <FaFire className="w-5 h-5" />,
};

export const episodeSubfilterColors: Record<string, string> = {
  series_premiere: 'text-purple-400',
  avatar_discovery: 'text-blue-400',
  airbending: 'text-cyan-400',
  waterbending: 'text-blue-400',
  fire_nation: 'text-red-400',
  iceberg: 'text-cyan-400',
  flying_bison: 'text-gray-400',
  hundred_year_war: 'text-red-400',
  southern_water_tribe: 'text-blue-400',
  prince_zuko: 'text-red-400',
  uncle_iroh: 'text-orange-400',
  gran_gran: 'text-blue-400',
  penguin_sledding: 'text-cyan-400',
  booby_trap: 'text-red-400',
  flare_signal: 'text-yellow-400',
};

export const coreFilterIcons: Record<string, React.ReactNode> = {
  characters: <FaUsers className="w-5 h-5" />,
  foods: <FaUtensils className="w-5 h-5" />,
  locations: <FaMapMarkerAlt className="w-5 h-5" />,
  groups: <FaLayerGroup className="w-5 h-5" />,
  fauna: <FaPaw className="w-5 h-5" />,
  spirits: <FaGhost className="w-5 h-5" />,
  episodes: <FaPlay className="w-5 h-5" />,
};

export const coreFilterColors: Record<string, string> = {
  characters: 'text-blue-400',
  foods: 'text-orange-400',
  locations: 'text-green-400',
  groups: 'text-purple-400',
  fauna: 'text-yellow-400',
  spirits: 'text-cyan-400',
  episodes: 'text-purple-400',
}; 