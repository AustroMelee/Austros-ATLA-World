import React from 'react';

type ErrorBoundaryProps = {
  error?: Error;
  children?: React.ReactNode;
};

export default function ErrorBoundary({ error, children }: ErrorBoundaryProps) {
  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Something went wrong:</strong>
      <span className="block sm:inline"> {error.message}</span>
    </div>;
  }
  return <>{children}</>;
}
