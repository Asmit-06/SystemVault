import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Folder,
  RefreshCw,
} from 'lucide-react';
import folderService from '../services/folderService';
import fileService from '../services/fileService';
import { useVault } from '../context/VaultContext';
import { useToast } from '../context/ToastContext';
import { formatBytes, formatDate } from '../utils/formatters';
import { getFileIcon } from '../utils/fileIcons';
import EmptyState from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TrashPage = () => {
  const { setItemToDelete } = useVault();
  const toast = useToast();

  const [trashFolders, setTrashFolders] = useState([]);
  const [trashFiles, setTrashFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchTrashItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const [folders, files] = await Promise.all([
        folderService.getTrashFolders().catch(() => []),
        fileService.getTrashFiles().catch(() => []),
      ]);
      setTrashFolders(folders || []);
      setTrashFiles(files || []);
    } catch (err) {
      toast.error('Failed to load trash items');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTrashItems();
  }, [fetchTrashItems]);

  const handleRestoreFolder = async (id, name) => {
    try {
      await folderService.restoreFolder(id);
      toast.success(`Folder "${name}" restored`);
      fetchTrashItems();
    } catch {
      toast.error(`Failed to restore folder "${name}"`);
    }
  };

  const handleRestoreFile = async (id, name) => {
    try {
      await fileService.restoreFile(id);
      toast.success(`File "${name}" restored`);
      fetchTrashItems();
    } catch {
      toast.error(`Failed to restore file "${name}"`);
    }
  };

  const handlePermanentDeleteFolder = (folder) => {
    setItemToDelete({
      type: 'Folder',
      item: folder,
      isPermanent: true,
      onConfirmPermanent: async () => {
        await folderService.permanentlyDeleteFolder(folder._id);
        toast.success(`Folder "${folder.name}" deleted permanently`);
        fetchTrashItems();
      }
    });
  };

  const handlePermanentDeleteFile = (file) => {
    setItemToDelete({
      type: 'File',
      item: file,
      isPermanent: true,
      onConfirmPermanent: async () => {
        await fileService.permanentDeleteFile(file._id);
        toast.success(`File "${file.name}" deleted permanently`);
        fetchTrashItems();
      }
    });
  };

  const totalTrashCount = trashFolders.length + trashFiles.length;

  return (
    <div className="min-h-[85vh] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Trash & Bin
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Restore items or permanently delete them
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchTrashItems}
          className="self-start sm:self-auto p-2 rounded-xl bg-white dark:bg-dark-card border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all shadow-xs"
          title="Refresh Trash"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Warning Notice */}
      <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-amber-900 dark:text-amber-300/90 text-xs flex items-center space-x-2.5">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
        <span>
          Permanently deleted items cannot be recovered and are purged from cloud storage.
        </span>
      </div>

      {/* Tabs */}
      {totalTrashCount > 0 && (
        <div className="flex items-center space-x-1 border-b border-zinc-200/80 dark:border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            All ({totalTrashCount})
          </button>
          <button
            onClick={() => setActiveTab('folders')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'folders'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Folders ({trashFolders.length})
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'files'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Files ({trashFiles.length})
          </button>
        </div>
      )}

      {/* Main List */}
      {isLoading ? (
        <LoadingSpinner text="Fetching trash..." />
      ) : totalTrashCount === 0 ? (
        <EmptyState
          type="trash"
          title="Trash is empty"
          description="Deleted folders and files will appear here."
        />
      ) : (
        <div className="space-y-5">
          {/* Trashed Folders */}
          {(activeTab === 'all' || activeTab === 'folders') && trashFolders.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Deleted Folders ({trashFolders.length})
              </h3>
              <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-xs">
                {trashFolders.map((folder) => (
                  <div
                    key={folder._id}
                    className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3 truncate mr-4">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                          {folder.name}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {formatDate(folder.deletedAt || folder.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleRestoreFolder(folder._id, folder.name)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-medium transition-colors"
                        title="Restore Folder"
                      >
                        <RotateCcw className="w-3 h-3 text-emerald-500" />
                        <span className="hidden sm:inline">Restore</span>
                      </button>

                      <button
                        onClick={() => handlePermanentDeleteFolder(folder)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trashed Files */}
          {(activeTab === 'all' || activeTab === 'files') && trashFiles.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Deleted Files ({trashFiles.length})
              </h3>
              <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-xs">
                {trashFiles.map((file) => (
                  <div
                    key={file._id}
                    className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3 truncate mr-4">
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        {getFileIcon(file, 'w-4 h-4')}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {formatBytes(file.size)} • {formatDate(file.deletedAt || file.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleRestoreFile(file._id, file.name)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-medium transition-colors"
                        title="Restore File"
                      >
                        <RotateCcw className="w-3 h-3 text-emerald-500" />
                        <span className="hidden sm:inline">Restore</span>
                      </button>

                      <button
                        onClick={() => handlePermanentDeleteFile(file)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
