import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, MoreVertical, Edit3, FolderInput, Trash2 } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatDate } from '../../utils/formatters';

export const FolderCard = ({ folder }) => {
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
      className="group relative bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-4 transition-all duration-200 hover:shadow-card-hover cursor-pointer flex flex-col justify-between select-none"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-500 flex items-center justify-center transition-transform group-hover:scale-105">
          <Folder className="w-5 h-5 fill-amber-500/20" />
        </div>

        {/* 3-Dot Action Menu */}
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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

      <div className="mt-4">
        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-brand-500 transition-colors">
          {folder.name}
        </h4>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
          {formatDate(folder.createdAt || folder.date)}
        </p>
      </div>
    </div>
  );
};

export default FolderCard;
