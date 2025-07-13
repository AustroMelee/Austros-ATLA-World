import React from 'react';

type StyledCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function StyledCard({ children, className, ...props }: StyledCardProps) {
  // These classes define the new high-contrast, interactive card style.
  const baseClasses = "bg-surface border border-subtle/20 rounded-xl p-4 transition-all duration-200 ease-in-out hover:border-primary/50 hover:-translate-y-px hover:shadow-xl hover:shadow-primary/5";
  
  return (
    <div className={`${baseClasses} ${className || ''}`} {...props}>
      {children}
    </div>
  );
} 