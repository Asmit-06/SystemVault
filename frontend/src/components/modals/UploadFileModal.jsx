import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, X, Trash2, AlertCircle } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes } from '../../utils/formatters';
import { getFileIcon } from '../../utils/fileIcons';

export const UploadFileModal = () => {
  const {
    isUploadOpen,
    setIsUploadOpen,
    currentFolder,
    handleUploadFiles,
    getAllFoldersList,
    setIsCreateFolderOpen
  } = useVault();

  const [files, setFiles] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [availableFolders, setAvailableFolders] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isUploadOpen) {
      getAllFoldersList().then((list) => {
        setAvailableFolders(list);
        if (currentFolder) {
          setSelectedFolderId(currentFolder._id);
        } else if (list.length > 0) {
          setSelectedFolderId(list[0]._id);
        }
      });
      setFiles([]);
    }
  }, [isUploadOpen, currentFolder]);

  if (!isUploadOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    const targetId = selectedFolderId || currentFolder?._id;
    if (!targetId) return;

    setIsUploadOpen(false);
    await handleUploadFiles(files, targetId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-dark-card border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-2xl p-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Upload Files
              </h3>
              <p className="text-[10px] text-zinc-400">
                Encrypted cloud storage
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Folder Selector */}
        <div className="mt-3.5">
          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Destination Folder
          </label>
          {availableFolders.length === 0 ? (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[11px]">Create a folder first.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUploadOpen(false);
                  setIsCreateFolderOpen(true);
                }}
                className="font-bold underline ml-2 text-[11px]"
              >
                Create
              </button>
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              >
                {availableFolders.map((f) => (
                  <option key={f._id} value={f._id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Drag and Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-3.5 border border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-brand-500 bg-brand-500/5 dropzone-active'
              : 'border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-9 h-9 mx-auto mb-1.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
            <UploadCloud className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Drag & drop files, or <span className="text-brand-500">browse</span>
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Documents, images, video, audio & code
          </p>
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="mt-3.5 max-h-36 overflow-y-auto space-y-1.5 pr-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Selected ({files.length})
            </p>
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs"
              >
                <div className="flex items-center space-x-2 truncate mr-2">
                  {getFileIcon(file, 'w-3.5 h-3.5')}
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate text-[11px]">
                    {file.name}
                  </span>
                  <span className="text-zinc-400 text-[10px]">
                    ({formatBytes(file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => setIsUploadOpen(false)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={files.length === 0 || !selectedFolderId}
            className="inline-flex items-center px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white active:scale-95 disabled:opacity-50 text-white dark:text-zinc-900 text-xs font-semibold transition-all shadow-sm"
          >
            Upload {files.length > 0 ? `(${files.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;
