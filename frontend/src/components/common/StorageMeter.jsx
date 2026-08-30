import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatBytes } from '../../utils/formatters';
import { HardDrive } from 'lucide-react';

export const StorageMeter = ({ compact = false }) => {
  const { user } = useAuth();

  const used = user?.usedStorage || 0;
  const limit = user?.storageLimit || 1073741824; // 1 GB default
  const percentage = Math.min(Math.round((used / limit) * 100), 100);

  const getProgressColor = () => {
    if (percentage > 90) return 'bg-rose-500';
    if (percentage > 75) return 'bg-amber-500';
    return 'bg-gradient-to-r from-brand-500 to-indigo-500';
  };

  if (compact) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mb-1">
          <span>Storage</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-200">
              Storage
            </h4>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {formatBytes(used)} of {formatBytes(limit)}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          {percentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    </div>
  );
};

export default StorageMeter;
