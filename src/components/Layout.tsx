import React from 'react';
import MatrixRain from './MatrixRain';
// import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    // The `isolate` class is still important to ensure the z-index works correctly!
    <div className="flex flex-col min-h-screen bg-transparent relative isolate">
      {/* 
        Replace ALL 24 of the old divs with this one component.
        We also set the parent background to transparent so the canvas is visible.
      */}
      <MatrixRain />
      
      {/* <Navbar /> */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
