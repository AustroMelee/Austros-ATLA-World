import React from 'react';
import FilterTag from './FilterTag';

export interface FilterConfigItem {
  key: string;
  label: string;
}

export interface FilterGroup {
  label: string;
  filters: FilterConfigItem[];
}

export interface FilterSidebarProps {
  filters: Record<string, string[]>;
  activeFilters: Record<string, string[]>;
  onToggle: (filterKey: string, value: string) => void;
  filterConfig: FilterGroup[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, activeFilters, onToggle, filterConfig }) => {
  return (
    <aside 
      className="w-64 min-w-[16rem] bg-surface rounded-xl p-4 flex-col gap-4 hidden lg:flex border border-subtle/20" 
      aria-label="Character Filters"
    >
      <h2 className="text-white text-lg font-bold">Filter Characters</h2>
      {filterConfig.map((group) => (
        <div key={group.label} className="py-2">
          {group.filters.map(({ key, label }) => (
            <div key={key} className="mb-4">
              <h3 className="text-slate-400 text-sm font-semibold mb-2">{label}</h3>
              <div className="flex flex-wrap gap-2">
                {(filters[key] && filters[key].length > 0) ? (
                  filters[key].map(option => (
                    <FilterTag
                      key={option}
                      label={option.charAt(0).toUpperCase() + option.slice(1)}
                      onClick={() => onToggle(key, option)}
                      active={activeFilters[key]?.some(v => v.toLowerCase() === option.toLowerCase())}
                    />
                  ))
                ) : (
                  <span className="text-subtle/50 text-xs italic">No options</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
};

export default FilterSidebar;
