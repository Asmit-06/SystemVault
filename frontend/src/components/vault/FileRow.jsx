import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Eye,
  Download,
  Edit3,
  FolderInput,
  Trash2
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes, formatDate } from '../../utils/formatters';
import { getFileIcon } from '../../utils/fileIcons';
import fileService from '../../services/fileService';
import { useToast } from '../../context/ToastContext';

export const FileRow = ({ file, isFirst = false, isLast = false }) => {
  const { setPreviewFile, setItemToRename, setItemToMove, setItemToDelete } = useVault();
  const toast = useToast();
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

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      await fileService.downloadFile(file._id, file.name);
      toast.success(`Downloading "${file.name}"`);
    } catch {
      toast.error('Failed to download file');
    }
  };

  return (
    <div
      onClick={() => setPreviewFile(file)}
      className={`group relative flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#121215] hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800/80 last:border-b-0 transition-colors cursor-pointer select-none ${
        isFirst ? 'rounded-t-2xl' : ''
      } ${isLast ? 'rounded-b-2xl' : ''} ${showMenu ? 'z-40' : 'z-10'}`}
    >
      <div className="flex items-center space-x-3 truncate flex-1 mr-4">
        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
          {getFileIcon(file, 'w-4 h-4')}
        </div>
        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200 truncate group-hover:text-brand-500 transition-colors">
          {file.name}
        </span>
      </div>

      <div className="flex items-center space-x-4 sm:space-x-8">
        <span className="text-[11px] text-zinc-400 w-16 text-right">
          {formatBytes(file.size)}
        </span>

        <span className="text-[11px] text-zinc-400 hidden md:inline w-28 text-right">
          {formatDate(file.createdAt)}
        </span>

        {/* Action icons */}
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors hidden sm:inline-flex"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* 3-Dot Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1.5 z-50 w-40 bg-white dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-700/80 rounded-2xl shadow-2xl p-1 space-y-0.5 animate-scale-in text-xs">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setPreviewFile(file);
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    handleDownload(e);
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setItemToRename({ type: 'file', item: file });
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Rename</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setItemToMove({ type: 'file', item: file });
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <FolderInput className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Move</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setItemToDelete({ type: 'file', item: file, isPermanent: false });
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
    </div>
  );
};

export default FileRow;
