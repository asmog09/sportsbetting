import React from 'react';

interface LogoProps {
  type?: 'text' | 'image';
}

export function Logo({ type = 'text' }: LogoProps) {
  if (type === 'image') {
    return (
      <img 
        src="/logo.png" 
        alt="Round by Round Tracker" 
        className="h-10 w-auto"
      />
    );
  }

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="bg-blue-600 text-white p-2 rounded-lg min-w-[40px] flex items-center justify-center">
        <span className="font-bold text-sm">RBR</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Round by Round Tracker
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Track. Analyze. Win.</p>
      </div>
    </div>
  );
} 