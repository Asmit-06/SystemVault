import api from './api';

export const folderService = {
  // Create a new folder
  async createFolder(name, parentFolder = null) {
    const response = await api.post('/folder', { name, parentFolder });
    return response.data;
  },

  // Get folders (root or child of parentFolder)
  async getFolders(parentFolderId = null) {
    const params = parentFolderId ? { parentFolder: parentFolderId } : {};
    const response = await api.get('/folder', { params });
    return response.data;
  },

  // Get folder by ID
  async getFolderById(id) {
    const response = await api.get(`/folder/${id}`);
    return response.data;
  },

  // Update folder (rename / change parent)
  async updateFolder(id, data) {
    const response = await api.patch(`/folder/${id}`, data);
    return response.data;
  },

  // Soft delete folder (move to trash)
  async deleteFolder(id) {
    const response = await api.delete(`/folder/${id}`);
    return response.data;
  },

  // Get trashed folders
  async getTrashFolders() {
    const response = await api.get('/folder/trash');
    return response.data;
  },

  // Restore folder from trash
  async restoreFolder(id) {
    const response = await api.patch(`/folder/restore/${id}`);
    return response.data;
  },

  // Permanently delete folder
  async permanentlyDeleteFolder(id) {
    const response = await api.delete(`/folder/permanent/${id}`);
    return response.data;
  },

  // Move folder to another parent
  async moveFolder(id, newParentId) {
    const response = await api.patch(`/folder/move/${id}`, { newParentId });
    return response.data;
  },
};

export default folderService;

