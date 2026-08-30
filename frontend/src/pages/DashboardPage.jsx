import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  FolderPlus,
  UploadCloud,
  Folder as FolderIcon,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import FolderCard from '../components/vault/FolderCard';
import FolderRow from '../components/vault/FolderRow';
import FileCard from '../components/vault/FileCard';
import FileRow from '../components/vault/FileRow';
import EmptyState from '../components/common/EmptyState';
import { LoadingSpinner, SkeletonCard } from '../components/common/LoadingSpinner';
import { getFileTypeCategory } from '../utils/fileIcons';

export const DashboardPage = () => {
  const { id: folderId } = useParams();
  const {
    currentFolder,
    folders,
    files,
    isLoading,
    viewMode,
    sortBy,
    sortOrder,
    filterType,
    setFilterType,
    fetchFolderContents,
    refreshCurrentFolder,
    setIsCreateFolderOpen,
    setIsUploadOpen,
    handleUploadFiles
  } = useVault();

  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetchFolderContents(folderId || null);
  }, [folderId, fetchFolderContents]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (currentFolder) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (currentFolder) {
        handleUploadFiles(e.dataTransfer.files, currentFolder._id);
      } else {
        setIsUploadOpen(true);
      }
    }
  };

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];

    if (filterType !== 'all') {
      result = result.filter((file) => {
        const cat = getFileTypeCategory(file);
        return cat === filterType;
      });
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        comparison = a.size - b.size;
      } else {
        comparison = new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [files, filterType, sortBy, sortOrder]);

  const sortedFolders = useMemo(() => {
    let result = [...folders];
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [folders, sortBy, sortOrder]);

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'image', label: 'Images' },
    { id: 'document', label: 'Documents' },
    { id: 'video', label: 'Media' },
    { id: 'pdf', label: 'PDFs' },
    { id: 'code', label: 'Code' },
  ];

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-[85vh] transition-all relative ${
        isDragOver ? 'ring-2 ring-brand-500 ring-offset-2 rounded-3xl bg-brand-500/5' : ''
      }`}
    >
      {/* Drag Over Overlay Alert */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="bg-white dark:bg-dark-card border border-dashed border-brand-500 rounded-3xl p-8 shadow-2xl flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center animate-bounce">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Drop files to upload to "{currentFolder?.name || 'Vault'}"
            </h3>
            <p className="text-xs text-zinc-400">Release anywhere to upload</p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <Breadcrumbs />
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-1">
            {currentFolder ? currentFolder.name : 'My Vault'}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => refreshCurrentFolder()}
            className="p-2 rounded-xl bg-white dark:bg-dark-card border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsCreateFolderOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-dark-card border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-semibold shadow-xs transition-all"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
            <span>New Folder</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 active:scale-95 text-xs font-semibold shadow-xs transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      {files.length > 0 && (
        <div className="flex items-center space-x-1 overflow-x-auto pb-1.5 mb-4 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Explorer Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : folders.length === 0 && files.length === 0 ? (
        <EmptyState
          type="empty"
          title={currentFolder ? `Folder "${currentFolder.name}" is empty` : 'Welcome to your SystemVault'}
          description={
            currentFolder
              ? 'Upload files or create subfolders to keep your vault organized.'
              : 'Create a folder to start uploading files, documents, and media.'
          }
          actionText={currentFolder ? 'Upload Files' : 'Create Folder'}
          onAction={() => {
            if (currentFolder) {
              setIsUploadOpen(true);
            } else {
              setIsCreateFolderOpen(true);
            }
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Folders Section */}
          {sortedFolders.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
                <FolderIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Folders ({sortedFolders.length})</span>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {sortedFolders.map((folder) => (
                    <FolderCard key={folder._id} folder={folder} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs">
                  {sortedFolders.map((folder) => (
                    <FolderRow key={folder._id} folder={folder} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Files Section */}
          {filteredAndSortedFiles.length > 0 ? (
            <section>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                <span>Files ({filteredAndSortedFiles.length})</span>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredAndSortedFiles.map((file) => (
                    <FileCard key={file._id} file={file} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs">
                  {filteredAndSortedFiles.map((file) => (
                    <FileRow key={file._id} file={file} />
                  ))}
                </div>
              )}
            </section>
          ) : filterType !== 'all' ? (
            <div className="p-8 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              No files matching "{filterType}" in this folder.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
