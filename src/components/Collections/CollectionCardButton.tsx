import React from 'react';

interface Props {
  isInCollection: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CollectionCardButton({ isInCollection, onClick }: Props) {
  const baseClasses = 'absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-black/80 backdrop-blur-md border-2 rounded-full transition-all duration-300 z-10';
  const hoverClasses = 'hover:scale-110 hover:shadow-[0_0_20px_rgba(112,171,108,0.6)] hover:border-[#70ab6c]';
  const activeClasses = 'text-[#c8ffc8] border-[#70ab6c] shadow-[0_0_20px_rgba(112,171,108,0.8)] bg-[#70ab6c]/20';
  const inactiveClasses = 'text-[#70ab6c] border-[#70ab6c]/60 shadow-[0_0_15px_rgba(112,171,108,0.3)] hover:bg-[#70ab6c]/10';

  return (
    <button
      type="button"
      aria-label={isInCollection ? 'Manage in collections' : 'Add to collection'}
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${isInCollection ? activeClasses : inactiveClasses}`}
    >
      {isInCollection ? (
        <span className="text-sm font-bold drop-shadow-[0_0_8px_rgba(200,255,200,0.8)]">✓</span>
      ) : (
        <span className="text-lg font-bold drop-shadow-[0_0_8px_rgba(112,171,108,0.8)]">+</span>
      )}
    </button>
  );
} 