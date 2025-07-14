import React from 'react';

type FilterTagProps = {
  label: React.ReactNode;
  onClick: () => void;
  active: boolean;
};

export default function FilterTag({ label, onClick, active }: FilterTagProps) {
  const baseClasses = "rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary";
  
  // Use primary styles when active, ghost-like styles when inactive
  const activeClasses = "bg-primary text-white";
  const inactiveClasses = "bg-surface text-subtle hover:bg-highlight hover:border-primary/50 border border-subtle/30";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
