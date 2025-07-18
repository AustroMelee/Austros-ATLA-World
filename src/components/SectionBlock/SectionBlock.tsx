import React from 'react';

/**
 * SectionBlock visually groups a section with optional title and icon.
 * @param title - Section heading.
 * @param icon - Optional icon to display next to the title.
 * @param children - Section content.
 * @param variant - Visual variant ('default', 'highlight', 'subtle').
 * @param type - Optional section type for extensibility (e.g., 'traits', 'relationships').
 */
export interface SectionBlockProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'subtle';
  type?: string; // e.g. 'traits', 'relationships', etc.
}

const typeVariantMap: Record<string, SectionBlockProps['variant']> = {
  traits: 'highlight',
  relationships: 'default',
  quotes: 'subtle',
};

const variantMap: Record<string, string> = {
  default: 'bg-zinc-900/70 border-l-4 border-blue-700',
  highlight: 'bg-blue-900/80 border-l-4 border-blue-400',
  subtle: 'bg-zinc-950/40 border-l-4 border-neutral-800',
};

export const SectionBlock: React.FC<SectionBlockProps> = ({ title, icon, children, variant = 'default', type }) => {
  const resolvedVariant = type ? typeVariantMap[type] || variant : variant;
  const base = 'rounded-lg p-4 mb-4 shadow-inner';
  const variantClass = variantMap[resolvedVariant] || variantMap.default;
  return (
    <section className={`${base} ${variantClass} transition-all duration-200 ease-out hover:ring-2 hover:ring-blue-400 focus-within:ring-2 focus-within:ring-blue-400 motion-reduce:transition-none`} aria-label={title}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-blue-300">
          {icon}
          {title}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};

export default SectionBlock; 