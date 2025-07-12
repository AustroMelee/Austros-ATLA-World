import React from 'react';

type MyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function MyButton({ children, ...props }: MyButtonProps) {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" {...props}>
      {children}
    </button>
  );
}
