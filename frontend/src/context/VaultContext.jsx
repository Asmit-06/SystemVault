import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import folderService from '../services/folderService';
import fileService from '../services/fileService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getErrorMessage } from '../utils/formatters';

const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const { isAuthenticated, refreshUserProfile } = useAuth();
  const toast = useToast();

  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ _id: null, name: 'My Vault' }]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // View & Sorting options
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('systemvault_view_mode') || 'grid');
  const [sortBy, setSortBy] = useState('date'); // 'name' | 'date' | 'size'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'video' | 'document' | etc.

  // Modals state
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [itemToRename, setItemToRename] = useState(null); // { type: 'folder' | 'file', item: object }
  const [itemToMove, setItemToMove] = useState(null); // { type: 'folder' | 'file', item: object }
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'folder' | 'file', item: object, isPermanent: boolean }

  // Upload Queue State
  const [uploadQueue, setUploadQueue] = useState([]);

  // Save view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('systemvault_view_mode', mode);
  };

  // Helper to build breadcrumb trail
  const buildBreadcrumbs = async (folder) => {
    if (!folder) {
      setBreadcrumbs([{ _id: null, name: 'My Vault' }]);
      return;
    }

    const trail = [{ _id: folder._id, name: folder.name }];
    let currentParentId = folder.parentFolder;

    // Fetch up to 10 levels of parents
    let depth = 0;
    while (currentParentId && depth < 10) {
      try {
        const parent = await folderService.getFolderById(currentParentId);
        if (parent) {
          trail.unshift({ _id: parent._id, name: parent.name });
          currentParentId = parent.parentFolder;
        } else {
          break;
        }
      } catch {
        break;
      }
      depth++;
    }

    trail.unshift({ _id: null, name: 'My Vault' });
    setBreadcrumbs(trail);
  };

  // Fetch folder contents
  const fetchFolderContents = useCallback(async (folderId = null) => {
    if (!isAuthenticated) return;
    setIsLoading(true);

    try {
      if (folderId) {
        const folderData = await folderService.getFolderById(folderId);
        setCurrentFolder(folderData);
        await buildBreadcrumbs(folderData);

        // Fetch subfolders and files inside this folder
        const [subfolders, folderFiles] = await Promise.all([
          folderService.getFolders(folderId),
          fileService.getFiles(folderId).catch(() => []),
        ]);

        setFolders(subfolders || []);
        setFiles(folderFiles || []);
      } else {
        // Root view
        setCurrentFolder(null);
        setBreadcrumbs([{ _id: null, name: 'My Vault' }]);

        const rootFolders = await folderService.getFolders(null);
        setFolders(rootFolders || []);
        setFiles([]); // Backend files require a folderId, root has folders
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error(getErrorMessage(error, 'Failed to load folder contents'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  // Refresh current view
  const refreshCurrentFolder = useCallback(() => {
    fetchFolderContents(currentFolder?._id || null);
    refreshUserProfile();
  }, [currentFolder, fetchFolderContents, refreshUserProfile]);

  // Create folder action
  const handleCreateFolder = async (name, parentFolderId = null) => {
    try {
      const parent = parentFolderId !== undefined ? parentFolderId : (currentFolder?._id || null);
      const newFolder = await folderService.createFolder(name, parent);
      toast.success(`Folder "${name}" created successfully`);
      refreshCurrentFolder();
      return newFolder;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create folder'));
      throw error;
    }
  };

  // Rename action
  const handleRename = async (type, id, newName) => {
    try {
      if (type === 'folder') {
        await folderService.updateFolder(id, { name: newName });
        toast.success('Folder renamed successfully');
      } else {
        await fileService.updateFile(id, newName);
        toast.success('File renamed successfully');
      }
      refreshCurrentFolder();
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to rename ${type}`));
      throw error;
    }
  };

  // Soft delete action (move to trash)
  const handleDelete = async (type, id, name = 'Item') => {
    try {
      if (type === 'folder') {
        await folderService.deleteFolder(id);
        toast.success(`Folder "${name}" moved to Trash`);
      } else {
        await fileService.deleteFile(id);
        toast.success(`File "${name}" moved to Trash`);
      }
      refreshCurrentFolder();
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to delete ${type}`));
      throw error;
    }
  };

  // Move action
  const handleMove = async (type, id, targetFolderId) => {
    try {
      if (type === 'folder') {
        await folderService.moveFolder(id, targetFolderId || null);
        toast.success('Folder moved successfully');
      } else {
        if (!targetFolderId) {
          toast.error('Files must be placed inside a folder');
          return;
        }
        await fileService.moveFile(id, targetFolderId);
        toast.success('File moved successfully');
      }
      refreshCurrentFolder();
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to move ${type}`));
      throw error;
    }
  };

  // Upload files with progress tracking
  const handleUploadFiles = async (fileList, targetFolderId) => {
    const destinationFolderId = targetFolderId || currentFolder?._id;

    if (!destinationFolderId) {
      toast.error('Please open or create a folder before uploading files');
      return;
    }

    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    for (const file of filesArray) {
      const uploadId = Math.random().toString(36).substring(7);
      
      // Add to queue
      setUploadQueue((prev) => [
        ...prev,
        { id: uploadId, name: file.name, size: file.size, progress: 0, status: 'uploading' }
      ]);

      try {
        await fileService.uploadFile(file, destinationFolderId, (progress) => {
          setUploadQueue((prev) =>
            prev.map((item) => (item.id === uploadId ? { ...item, progress } : item))
          );
        });

        setUploadQueue((prev) =>
          prev.map((item) => (item.id === uploadId ? { ...item, status: 'completed', progress: 100 } : item))
        );

        toast.success(`"${file.name}" uploaded successfully`);
      } catch (error) {
        setUploadQueue((prev) =>
          prev.map((item) => (item.id === uploadId ? { ...item, status: 'error' } : item))
        );
        toast.error(getErrorMessage(error, `Failed to upload "${file.name}"`));
      }
    }

    refreshCurrentFolder();
    
    // Clear completed uploads from queue after 4 seconds
    setTimeout(() => {
      setUploadQueue((prev) => prev.filter((item) => item.status === 'uploading'));
    }, 4000);
  };

  // Fetch all user folders for destination picker
  const getAllFoldersList = async () => {
    try {
      const rootFolders = await folderService.getFolders(null);
      const all = [...(rootFolders || [])];
      for (const f of rootFolders || []) {
        try {
          const children = await folderService.getFolders(f._id);
          if (children && children.length > 0) {
            all.push(...children);
          }
        } catch {
          // ignore
        }
      }
      return all;
    } catch {
      return [];
    }
  };

  return (
    <VaultContext.Provider
      value={{
        currentFolder,
        setCurrentFolder,
        breadcrumbs,
        folders,
        files,
        isLoading,
        viewMode,
        toggleViewMode,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        filterType,
        setFilterType,
        fetchFolderContents,
        refreshCurrentFolder,
        handleCreateFolder,
        handleRename,
        handleDelete,
        handleMove,
        handleUploadFiles,
        getAllFoldersList,
        uploadQueue,
        // Modal states
        isCreateFolderOpen,
        setIsCreateFolderOpen,
        isUploadOpen,
        setIsUploadOpen,
        previewFile,
        setPreviewFile,
        itemToRename,
        setItemToRename,
        itemToMove,
        setItemToMove,
        itemToDelete,
        setItemToDelete,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};

