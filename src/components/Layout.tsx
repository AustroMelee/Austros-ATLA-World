import React, { useState } from 'react';
import MatrixRain from './MatrixRain';
import Header from './Header';
import { useScrollToTop } from '../hooks/useScrollToTop';
// import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  modalOpen?: boolean;
}

export default function Layout({ children, modalOpen = false }: LayoutProps) {
  const [matrixRainEnabled, setMatrixRainEnabled] = useState(false);
  const { showBackToTop, scrollToTop } = useScrollToTop();

  const handleToggleMatrixRain = () => {
    setMatrixRainEnabled(!matrixRainEnabled);
  };

  return (
    // The `isolate` class is still important to ensure the z-index works correctly!
    <div className="flex flex-col bg-transparent relative isolate">
      {/* Header with Matrix Rain toggle and Back to Top button */}
      <Header
        matrixRainEnabled={matrixRainEnabled}
        onToggleMatrixRain={handleToggleMatrixRain}
        showBackToTop={showBackToTop}
        onBackToTop={scrollToTop}
      />
      
      {/* Matrix Rain - only show when enabled */}
      {matrixRainEnabled && <MatrixRain modalOpen={modalOpen} />}
      
      {/* <Navbar /> */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
