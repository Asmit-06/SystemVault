import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, MoreVertical, Edit3, FolderInput, Trash2 } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatDate } from '../../utils/formatters';

export const FolderRow = ({ folder }) => {
  const navigate = useNavigate();
  const { setItemToRename, setItemToMove, setItemToDelete } = useVault();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleOpen = () => {
    navigate(`/folder/${folder._id}`);
  };

  return (
    <div
      onClick={handleOpen}
      className="group flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#121215] hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors cursor-pointer select-none"
    >
      <div className="flex items-center space-x-3 truncate flex-1 mr-4">
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
          <Folder className="w-4 h-4 fill-amber-500/20" />
        </div>
        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200 truncate group-hover:text-brand-500 transition-colors">
          {folder.name}
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <span className="text-[11px] text-zinc-400 hidden sm:inline">
          {formatDate(folder.createdAt || folder.date)}
        </span>

        {/* 3-Dot Menu */}
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-7 z-30 w-36 bg-white dark:bg-dark-surface border border-zinc-200 dark:border-zinc-700/80 rounded-2xl shadow-xl p-1 space-y-0.5 animate-scale-in text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setItemToRename({ type: 'folder', item: folder });
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Rename</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  setItemToMove({ type: 'folder', item: folder });
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <FolderInput className="w-3.5 h-3.5 text-zinc-400" />
                <span>Move</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  setItemToDelete({ type: 'folder', item: folder, isPermanent: false });
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderRow;
