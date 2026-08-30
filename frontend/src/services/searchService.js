import api from './api';

export const searchService = {
  async search(query) {
    if (!query || !query.trim()) {
      return { folders: [], files: [] };
    }
    const response = await api.get('/search', {
      params: { q: query.trim() },
    });
    return response.data;
  },
};

export default searchService;

