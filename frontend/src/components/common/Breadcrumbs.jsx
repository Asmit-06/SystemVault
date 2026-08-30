import React from 'react';
import { ChevronRight, Home, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVault } from '../../context/VaultContext';

export const Breadcrumbs = () => {
  const { breadcrumbs } = useVault();
  const navigate = useNavigate();

  const handleNavigate = (folderId) => {
    if (folderId) {
      navigate(`/folder/${folderId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-xs overflow-x-auto py-1 scrollbar-none">
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        const isRoot = idx === 0;

        return (
          <React.Fragment key={crumb._id || 'root'}>
            {idx > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 flex-shrink-0" />
            )}
            <button
              onClick={() => handleNavigate(crumb._id)}
              disabled={isLast}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                isLast
                  ? 'font-semibold text-zinc-900 dark:text-white bg-zinc-200/50 dark:bg-zinc-800/60 cursor-default'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
              }`}
            >
              {isRoot ? (
                <Home className="w-3.5 h-3.5 text-brand-500" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{crumb.name}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
