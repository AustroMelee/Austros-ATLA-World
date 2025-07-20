import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

interface HeaderProps {
  matrixRainEnabled: boolean;
  onToggleMatrixRain: () => void;
  showBackToTop: boolean;
  onBackToTop: () => void;
}

const Header: React.FC<HeaderProps> = ({
  matrixRainEnabled,
  onToggleMatrixRain,
  showBackToTop,
  onBackToTop,
}) => {
  return (
    <>
      {/* Header - just the Matrix Rain toggle button */}
      <header className="fixed top-4 right-4 z-50">
        <button
          onClick={onToggleMatrixRain}
          className={`px-4 py-2 rounded-md font-perfect-dos text-sm font-bold transition-all duration-200 crt-screen active:scale-95 shadow-lg ${
            matrixRainEnabled
              ? 'bg-[#70ab6c] text-black border-2 border-[#70ab6c] shadow-[0_0_8px_rgba(112,171,108,0.6)]'
              : 'bg-black/80 backdrop-blur-sm text-[#c8ffc8] border-2 border-[#70ab6c]/40 hover:bg-[#70ab6c]/60 hover:border-[#70ab6c] hover:text-black hover:shadow-[0_0_8px_rgba(112,171,108,0.6)]'
          }`}
        >
          {matrixRainEnabled ? 'EXIT MATRIX' : 'ENTER MATRIX'}
        </button>
      </header>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={onBackToTop}
          className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-black/80 backdrop-blur-sm border-2 border-[#70ab6c]/40 text-[#c8ffc8] hover:bg-[#70ab6c]/60 hover:border-[#70ab6c] hover:text-black transition-all duration-200 crt-screen active:scale-95 shadow-lg hover:shadow-[0_0_8px_rgba(112,171,108,0.6)]"
          aria-label="Back to top"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Header; 