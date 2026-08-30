import api from './api';

export const fileService = {
  // Upload a single file with optional progress callback
  async uploadFile(file, folderId, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

    const response = await api.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Get files inside a folder
  async getFiles(folderId) {
    const response = await api.get('/file', {
      params: { folderId },
    });
    return response.data.files || [];
  },

  // Get single file details
  async getFileById(id) {
    const response = await api.get(`/file/${id}`);
    return response.data.file;
  },

  // Rename file
  async updateFile(id, name) {
    const response = await api.patch(`/file/${id}`, { name });
    return response.data.file || response.data;
  },

  // Soft delete file (move to trash)
  async deleteFile(id) {
    const response = await api.delete(`/file/${id}`);
    return response.data;
  },

  // Download file blob
  async downloadFile(id, fileName) {
    const response = await api.get(`/file/download/${id}`, {
      responseType: 'blob',
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'download');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Get trash files
  async getTrashFiles() {
    const response = await api.get('/file/trash');
    return response.data.files || [];
  },

  // Restore file
  async restoreFile(id) {
    const response = await api.patch(`/file/restore/${id}`);
    return response.data.file || response.data;
  },

  // Permanently delete file
  async permanentDeleteFile(id) {
    const response = await api.delete(`/file/permanent/${id}`);
    return response.data.file || response.data;
  },

  // Move file to another folder
  async moveFile(id, folderId) {
    const response = await api.patch(`/file/move/${id}`, { folderId });
    return response.data.file || response.data;
  },
};

export default fileService;

