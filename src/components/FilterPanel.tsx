import React from 'react';

type FilterPanelProps = {
  children: React.ReactNode;
};

export default function FilterPanel({ children }: FilterPanelProps) {
  return <div className="flex flex-wrap gap-3 items-center mb-4">{children}</div>;
}
