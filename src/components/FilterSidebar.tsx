import React from 'react';
import FilterTag from './FilterTag';

export interface FilterSidebarProps {
  filters: Record<string, string[]>;
  activeFilters: Record<string, string[]>;
  onToggle: (filterKey: string, value: string) => void;
  filterConfig: { key: string; label: string }[]; // New prop
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, activeFilters, onToggle, filterConfig }) => (
  <aside className="w-64 min-w-[16rem] bg-slate-800 rounded-lg p-4 mr-8 flex-col gap-4 hidden lg:flex" aria-label="Character Filters">
    <h2 className="text-slate-200 text-lg font-semibold mb-2">Filter Characters</h2>
    {filterConfig.map(({ key, label }) => (
      <div key={key} className="mb-3">
        <h3 className="text-slate-300 text-sm font-semibold mb-2">{label}</h3>
        <div className="flex flex-wrap gap-2">
          {(filters[key] && filters[key].length > 0) ? (
            filters[key].map(option => (
              <FilterTag
                key={option}
                label={option.charAt(0).toUpperCase() + option.slice(1)}
                onClick={() => onToggle(key, option)}
                active={activeFilters[key]?.includes(option)}
              />
            ))
          ) : (
            <span className="text-slate-500 text-xs italic">No options</span>
          )}
        </div>
      </div>
    ))}
  </aside>
);

export default FilterSidebar;
