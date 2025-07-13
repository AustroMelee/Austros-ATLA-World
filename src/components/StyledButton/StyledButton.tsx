import React from 'react';

type StyledButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export default function StyledButton({ children, variant = 'primary', className, ...props }: StyledButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-colors duration-150";

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-surface border border-primary text-primary hover:bg-highlight',
    ghost: 'bg-transparent text-subtle hover:bg-surface hover:text-white',
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
} 