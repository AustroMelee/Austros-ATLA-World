import React from 'react';

interface Props {
  isInCollection: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CollectionCardButton({ isInCollection, onClick }: Props) {
  const baseClasses = 'absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-black/40 backdrop-blur-sm border border-[#70ab6c]/20 rounded-full transition-all';
  const hoverClasses = 'hover:text-[#c8ffc8] hover:shadow-[0_0_15px_rgba(112,171,108,0.4)]';
  const activeClasses = 'text-[#c8ffc8] shadow-[0_0_15px_rgba(112,171,108,0.4)]';
  const inactiveClasses = 'text-[#70ab6c] shadow-[0_0_10px_rgba(112,171,108,0.2)]';

  return (
    <button
      type="button"
      aria-label={isInCollection ? 'Manage in collections' : 'Add to collection'}
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${isInCollection ? activeClasses : inactiveClasses}`}
    >
      {isInCollection ? '✓' : '+'}
    </button>
  );
} 