import React from 'react';
import { FolderPlus, UploadCloud, Trash2, Search } from 'lucide-react';

export const EmptyState = ({ type = 'empty', title, description, actionText, onAction }) => {
  const configs = {
    empty: {
      icon: <FolderPlus className="w-8 h-8 text-amber-500" />,
      title: title || 'This folder is empty',
      description: description || 'Create a subfolder or upload files to get started.',
      actionText: actionText || 'Create Folder',
    },
    trash: {
      icon: <Trash2 className="w-8 h-8 text-zinc-400" />,
      title: title || 'Trash is empty',
      description: description || 'Items moved to trash will appear here for 30 days before permanent deletion.',
      actionText: actionText || null,
    },
    search: {
      icon: <Search className="w-8 h-8 text-zinc-400" />,
      title: title || 'No results found',
      description: description || 'Try checking for typos or use a different search keyword.',
      actionText: actionText || null,
    },
    upload: {
      icon: <UploadCloud className="w-8 h-8 text-brand-500" />,
      title: title || 'Drop files here to upload',
      description: description || 'Upload images, documents, videos, and any other files safely to SystemVault.',
      actionText: actionText || 'Upload Files',
    }
  };

  const config = configs[type] || configs.empty;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm my-6 transition-all">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center mb-3 shadow-inner">
        {config.icon}
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        {config.title}
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-5">
        {config.description}
      </p>
      {onAction && config.actionText && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-all active:scale-95 shadow-sm"
        >
          {config.actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
