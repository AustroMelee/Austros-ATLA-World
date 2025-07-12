import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center w-full py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-nation-water border-t-transparent"></div>
    </div>
  );
}
