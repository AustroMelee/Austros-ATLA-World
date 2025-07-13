import React from 'react';
// import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      {/* <Navbar /> */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
