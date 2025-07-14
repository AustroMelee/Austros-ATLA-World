import React from 'react';

const NotFound: React.FC = () => (
  <main className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
    <h1 className="text-5xl font-extrabold text-neutral-200 mb-4">404 - Not Found</h1>
    <p className="text-lg text-slate-400 mb-8">Sorry, the page you are looking for does not exist.</p>
    <a href="/" className="px-6 py-3 rounded-lg bg-nation-water text-slate-900 font-semibold hover:bg-nation-earth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nation-water">Go Home</a>
  </main>
);

export default NotFound;
