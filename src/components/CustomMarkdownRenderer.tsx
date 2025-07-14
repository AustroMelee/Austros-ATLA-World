import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaBookOpen, FaStar, FaHandshake, FaTheaterMasks, FaMagic } from 'react-icons/fa';

interface CustomMarkdownRendererProps {
  markdown: string;
}

export function CustomMarkdownRenderer({ markdown }: CustomMarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h3: (props) => {
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
      }}
    >{markdown}</ReactMarkdown>
  );
}
