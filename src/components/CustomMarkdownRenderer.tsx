import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaBookOpen, FaStar, FaHandshake, FaTheaterMasks, FaMagic } from 'react-icons/fa';
import type { Components } from 'react-markdown';

interface CustomMarkdownRendererProps {
  markdown: string;
}

// Memoize icon components to prevent recreation
const icons = {
  overview: <FaBookOpen className="inline-block align-middle text-blue-400 mr-2" size={18} />,
  narrative: <FaMagic className="inline-block align-middle text-purple-400 mr-2" size={18} />,
  role: <FaTheaterMasks className="inline-block align-middle text-pink-400 mr-2" size={18} />,
  relationships: <FaHandshake className="inline-block align-middle text-green-400 mr-2" size={18} />,
  notable: <FaStar className="inline-block align-middle text-yellow-400 mr-2" size={18} />
};

export function CustomMarkdownRenderer({ markdown }: CustomMarkdownRendererProps) {
  // Memoize the components object to prevent recreation on every render
  const components = useMemo<Components>(() => ({
    h3: ({ children, ...props }) => {
      const text = String(children).toLowerCase();
      let icon = null;
      if (text.includes('overview')) icon = icons.overview;
      else if (text.includes('narrative')) icon = icons.narrative;
      else if (text.includes('role')) icon = icons.role;
      else if (text.includes('relationships')) icon = icons.relationships;
      else if (text.includes('notable')) icon = icons.notable;
      
      return (
        <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2" {...props}>
          {icon}
          <span className="align-middle">{children}</span>
        </h3>
      );
    },
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-6 space-y-1 text-sm text-gray-200 border-t border-white/10 pt-4 mt-4" {...props}>
        {children}
      </ul>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-snug" {...props}>{children}</li>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-white" {...props}>{children}</strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic text-blue-300" {...props}>{children}</em>
    ),
    p: ({ children, ...props }) => (
      <p className="mt-4 mb-2" {...props}>{children}</p>
    ),
  }), []); // Empty dependency array since these don't depend on props

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >{markdown}</ReactMarkdown>
  );
}
