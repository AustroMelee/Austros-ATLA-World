import React from 'react';
import type { EnrichedCharacter } from '../../types';
import ThemedCard from '../ThemedCard/ThemedCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NationIcon from '../NationIcon/NationIcon';
import { FaBookOpen, FaStar, FaHandshake, FaTheaterMasks, FaMagic } from 'react-icons/fa';

interface ItemCardProps {
  item: EnrichedCharacter;
  expanded: boolean;
  onExpand: () => void;
}

function toTitleCase(str?: string): string {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    if (words[0].length <= 4) return words[0][0].toUpperCase();
    return words[0].substring(0, 2).toUpperCase();
  }
  // Multi-word: first letter of first and last word
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function ItemCard({ item, expanded, onExpand }: ItemCardProps) {
  const iconText = getInitials(item.name);

  // Fallbacks for known edge cases
  const imageFallbacks: Record<string, string> = {
    'combustion-man': 'combustion-man.jpg',
    'unknown': 'combustion-man.jpg', // Combustion Man's slug is 'unknown' in data
    'gyatso': 'monk-gyatso.jpg',
    'toph-beifong': 'toph.jpg',
    'yue': 'yue-avatar.jpg',
  };
  const [imgSrc, setImgSrc] = React.useState(item.slug ? `/assets/images/${item.slug}.jpg` : undefined);
  React.useEffect(() => {
    setImgSrc(item.slug ? `/assets/images/${item.slug}.jpg` : undefined);
  }, [item.slug]);

  return (
    <ThemedCard
      nation={item.nation}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (expanded) e.stopPropagation();
        else onExpand();
      }}
      // NOTE: If hover/focus effects are clipped, ensure parent container does NOT have overflow: hidden
      className={
        expanded
          ? 'shadow-md shadow-black/20 cursor-pointer transition-all duration-200 relative group z-10'
          : 'shadow-md shadow-black/20 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-white/5 focus-within:scale-105 focus-within:shadow-lg focus-within:bg-white/5 relative group z-10 group-hover:z-20'
      }
      aria-label={`View details for ${item.name}`}
    >
      {/* Chevron icon for interactivity clarity */}
      {!expanded && (
        <span className="absolute top-4 right-4 text-subtle opacity-0 group-hover:opacity-80 group-focus-within:opacity-80 transition-opacity duration-150 pointer-events-none text-2xl select-none" aria-hidden="true">›</span>
      )}
      <div className="pb-4 pt-6 flex flex-col min-h-[420px]">
        {/* AVATAR/IMAGE SECTION - Padded Separately */}
        <div className="mb-4 flex justify-center w-full px-4">
          <div className="w-44 h-44 sm:w-48 sm:h-48 flex-shrink-0 bg-background rounded-2xl flex items-center justify-center border border-subtle/20 overflow-hidden shadow-lg">
            {item.slug ? (
              <img
                src={imgSrc}
                alt={item.name}
                className="w-full h-full rounded-2xl object-cover border-none"
                draggable={false}
                onError={e => {
                  // If first try fails and fallback exists, try fallback
                  if (imgSrc && imageFallbacks[item.slug] && !imgSrc.endsWith(imageFallbacks[item.slug])) {
                    setImgSrc(`/assets/images/${imageFallbacks[item.slug]}`);
                  } else {
                    // fallback to initials if all fail
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class='font-bold text-subtle text-4xl'>${iconText}</span>`;
                    }
                  }
                }}
              />
            ) : (
              <span className="font-bold text-subtle text-4xl">{iconText}</span>
            )}
          </div>
        </div>

        {/* TITLE & DESCRIPTION SECTION - Padded Separately */}
        <div className="w-full mt-auto px-4">
          <div className="flex items-center justify-end gap-2">
            <h3 className="font-bold text-2xl text-white truncate">{toTitleCase(item.name)}</h3>
            {item.nation && <NationIcon nation={item.nation} size={24} className="align-middle flex-shrink-0" />}
          </div>
          <div className="text-right text-lg text-subtle mt-1 font-medium">Character</div>
        </div>
        {/* EXPANDED VIEW - Padded Separately */}
        {expanded && (
          <div className="prose prose-sm prose-invert max-w-none text-slate-300 mt-4 w-full text-left px-4">
            {item.expandedView ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h3: (props) => {
                    // Map header text to icon
                    const text = String(props.children).toLowerCase();
                    let icon = null;
                    if (text.includes('overview')) icon = <FaBookOpen className="inline-block align-middle text-blue-400 mr-2" size={18} />;
                    else if (text.includes('narrative')) icon = <FaMagic className="inline-block align-middle text-purple-400 mr-2" size={18} />;
                    else if (text.includes('role')) icon = <FaTheaterMasks className="inline-block align-middle text-pink-400 mr-2" size={18} />;
                    else if (text.includes('relationships')) icon = <FaHandshake className="inline-block align-middle text-green-400 mr-2" size={18} />;
                    else if (text.includes('notable')) icon = <FaStar className="inline-block align-middle text-yellow-400 mr-2" size={18} />;
                    return (
                      <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                        {icon}
                        <span className="align-middle">{props.children}</span>
                      </h3>
                    );
                  },
                  ul: (props) => (
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-200 border-t border-white/10 pt-4 mt-4" {...props} />
                  ),
                  li: (props) => (
                    <li className="leading-snug" {...props} />
                  ),
                  strong: (props) => (
                    <strong className="font-semibold text-white" {...props} />
                  ),
                  em: (props) => (
                    <em className="italic text-blue-300" {...props} />
                  ),
                  p: (props) => (
                    <p className="mt-4 mb-2" {...props} />
                  ),
                  // Label-value formatting for Name, Nation, etc.
                  // (Assumes markdown uses e.g. **Name:** value)
                  // Optionally, you could parse and style these more deeply if needed
                }}
              >{item.expandedView}</ReactMarkdown>
            ) : (
              <p className="italic text-subtle">No detailed view available.</p>
            )}
          </div>
        )}
      </div>
      {item.role && (
        <div className="absolute bottom-2 right-4">
          <span className="inline-block text-xs text-blue-300 bg-zinc-900/80 px-2 py-1 rounded shadow-md border border-blue-400/30 font-semibold pointer-events-none select-none">
            {item.role}
          </span>
        </div>
      )}
    </ThemedCard>
  );
}
