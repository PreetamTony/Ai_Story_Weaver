import React from 'react';

interface ChoiceButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function ChoiceButton({ onClick, children }: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-6 py-4 bg-white/5 hover:bg-white/10 rounded-lg 
                 border border-white/10 transition-colors duration-200 backdrop-blur-sm
                 text-purple-200 hover:text-white hover:border-purple-500"
    >
      {children}
    </button>
  );
}