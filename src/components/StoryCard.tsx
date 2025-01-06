import React from 'react';
import { Character } from '../types/story';

interface StoryCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function StoryCard({ title, children, className = '' }: StoryCardProps) {
  return (
    <div className={`bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-6 ${className}`}>
      <h3 className="font-medium text-lg mb-3 text-purple-300">{title}</h3>
      {children}
    </div>
  );
}