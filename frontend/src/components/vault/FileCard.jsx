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
import { getFileIcon, getFileTypeCategory } from '../../utils/fileIcons';
import fileService from '../../services/fileService';
import { useToast } from '../../context/ToastContext';

export const FileCard = ({ file }) => {
  const { setPreviewFile, setItemToRename, setItemToMove, setItemToDelete } = useVault();
  const toast = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef(null);

  const category = getFileTypeCategory(file);
  const isImage = category === 'image' && !imgError;

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
      className="group relative bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-3 transition-all duration-200 hover:shadow-card-hover cursor-pointer flex flex-col justify-between select-none"
    >
      {/* Top Media / Thumbnail Section */}
      <div className="relative w-full h-28 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 overflow-hidden flex items-center justify-center mb-2.5">
        {isImage ? (
          <img
            src={file.fileUrl}
            alt={file.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="transition-transform group-hover:scale-110">
            {getFileIcon(file, 'w-8 h-8')}
          </div>
        )}

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewFile(file);
            }}
            className="p-1.5 rounded-lg bg-white/90 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 hover:scale-110 shadow-sm transition-transform"
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-110 shadow-sm transition-transform"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* File Details & 3-Dot Menu */}
      <div className="flex items-start justify-between">
        <div className="overflow-hidden flex-1 mr-1.5">
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-brand-500 transition-colors">
            {file.name}
          </h4>
          <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            <span>{formatBytes(file.size)}</span>
            <span>•</span>
            <span>{formatDate(file.createdAt)}</span>
          </div>
        </div>

        {/* 3-Dot Dropdown */}
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 bottom-7 z-30 w-36 bg-white dark:bg-dark-surface border border-zinc-200 dark:border-zinc-700/80 rounded-2xl shadow-xl p-1 space-y-0.5 animate-scale-in text-xs">
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
  );
};

export default FileCard;
