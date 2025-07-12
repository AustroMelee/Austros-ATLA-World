import React from 'react';

type FilterTagProps = {
  label: string;
  onRemove?: () => void;
};

export default function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center bg-slate-700 text-slate-200 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2">
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="ml-2 text-slate-400 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full px-1"
        >
          ×
        </button>
      )}
    </span>
  );
}
