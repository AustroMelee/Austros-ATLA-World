import React, { forwardRef } from 'react';

interface Props {
  isInCollection: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CollectionCardButton = forwardRef<HTMLButtonElement, Props>(({ isInCollection, onClick }, ref) => {
  const baseClasses = `
    absolute top-2 right-2 
    flex items-center justify-center 
    w-7 h-7 
    bg-black/60 
    backdrop-blur-sm 
    border-2 border-[#70ab6c]/40 
    rounded-full 
    transition-all 
    text-lg 
    leading-none 
    font-bold
  `;
  const hoverClasses = `
    hover:text-[#c8ffc8] 
    hover:border-[#c8ffc8]/60
    hover:bg-black/80
    hover:shadow-[0_0_15px_rgba(112,171,108,0.6)]
    hover:scale-110
  `;
  const activeClasses = `
    text-[#c8ffc8] 
    border-[#c8ffc8]/60
    shadow-[0_0_15px_rgba(112,171,108,0.6)]
  `;
  const inactiveClasses = `
    text-[#70ab6c] 
    shadow-[0_0_10px_rgba(112,171,108,0.3)]
  `;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={isInCollection ? 'Manage in collections' : 'Add to collection'}
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${isInCollection ? activeClasses : inactiveClasses}`}
    >
      <span className="inline-flex items-center justify-center h-full translate-y-[-1px]">
        {isInCollection ? '✓' : '+'}
      </span>
    </button>
  );
});

CollectionCardButton.displayName = 'CollectionCardButton';

export default CollectionCardButton; 