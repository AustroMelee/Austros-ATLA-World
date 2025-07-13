import React from 'react';

type FilterTagProps = {
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
  active?: boolean;
  role?: string;
  ariaChecked?: boolean;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
};

export default function FilterTag({ label, onClick, onRemove, active, role, ariaChecked, tabIndex, onKeyDown }: FilterTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2 transition-colors duration-150 ${active ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'} ${onClick ? 'cursor-pointer' : ''}`}
      role={role}
      aria-checked={ariaChecked}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="ml-2 text-slate-400 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full px-1"
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
}
