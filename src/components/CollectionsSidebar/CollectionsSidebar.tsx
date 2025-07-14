import React from 'react';
// import { Badge } from '../Badge/Badge';

interface CollectionsSidebarProps {
  collections: { id: string; name: string }[];
}

export default function CollectionsSidebar({
  collections,
}: CollectionsSidebarProps) {
  return (
    <aside className="w-[270px] max-w-[320px] min-w-[250px] bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-800 self-start max-h-[70vh] overflow-y-auto flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold tracking-tight text-white">My Collections</h2>
        <span className="text-xs text-slate-500">{collections.length} total</span>
      </div>
      {/* Collection controls are fully functional but have been hidden from the UI per user request. */}
      {/* All collection and item buttons removed as requested */}
    </aside>
  );
} 