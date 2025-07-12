import React from 'react';

const pageLinks = [
  { label: 'Search', href: '/search' },
  { label: 'Characters', href: '/characters' },
  { label: 'Bending Arts', href: '/bending' },
  { label: 'Locations', href: '/locations' },
  { label: 'Fauna', href: '/fauna' },
  { label: 'Food', href: '/food' },
  { label: 'Spirit World', href: '/spirit-world' },
];

export default function Home() {
  return (
    <section className="w-full max-w-3xl mx-auto text-center py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 mb-4 tracking-tight drop-shadow-lg">
        Austros ATLA World Encyclopedia
      </h1>
      <p className="text-lg text-slate-300 mb-8">
        Welcome! Explore the world of Avatar through characters, bending arts, locations, fauna, and more.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {pageLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block bg-slate-800 hover:bg-indigo-600 text-slate-100 font-semibold py-4 px-6 rounded-xl shadow transition-colors duration-200 text-lg text-center border border-slate-700 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {item.label}
          </a>
        ))}
      </div>
    </section>
  );
}
