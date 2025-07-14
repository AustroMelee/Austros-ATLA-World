import React from 'react';

const navItems = [
  { label: 'Search', href: '/search' },
  { label: 'Characters', href: '/characters' },
  { label: 'Bending', href: '/bending' },
  { label: 'Locations', href: '/locations' },
  { label: 'Fauna', href: '/fauna' },
  { label: 'Food', href: '/food' },
  { label: 'Spirit World', href: '/spirit-world' },
];

export default function Navbar() {
  return (
    <nav className="w-full bg-zinc-900 border-b border-neutral-800 px-4 py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
      <span className="font-extrabold text-xl text-neutral-200 tracking-tight mr-4">Austros ATLA World Encyclopedia</span>
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-neutral-200 font-medium px-3 py-1 rounded hover:bg-white/5 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-150"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
