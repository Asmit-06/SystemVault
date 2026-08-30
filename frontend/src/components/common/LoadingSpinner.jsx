import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-brand-500`} />
      {text && <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{text}</p>}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-dark-card border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between h-36">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
        <div className="space-y-2 flex-1">
          <div className="h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4"></div>
          <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3"></div>
    </div>
  );
};

export default LoadingSpinner;
