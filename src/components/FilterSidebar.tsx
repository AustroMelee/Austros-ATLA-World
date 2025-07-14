import React from 'react';

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

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filterConfig }) => {
  return (
    <aside className="w-full">
      {filterConfig.map((group, groupIdx) => (
        <div
          key={group.label}
          className={`backdrop-blur-md bg-slate-900/60 rounded-xl p-4${groupIdx !== 0 ? ' mt-8' : ''} mb-6`}
        >
          <h3 className="text-lg font-semibold uppercase tracking-widest mb-2 mt-6">{group.label}</h3>
          {group.filters.map(({ key, label }, filterIdx) => (
            <div key={key} className={`mb-6${filterIdx !== 0 ? ' mt-4' : ''}`}> {/* More margin between sections */}
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{label}</h4>
              {/* Filter controls are fully functional but have been hidden from the UI per user request. */}
              {/* Filter buttons removed as requested */}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
};

export default FilterSidebar;
