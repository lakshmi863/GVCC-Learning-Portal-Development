import API from './api';

export const saveBookmark = async (bookmarkData) => {
  const response = await API.post('/bookmarks', bookmarkData);
  return response.data;
};

export const getBookmarks = async (videoId) => {
  const response = await API.get(`/bookmarks/${videoId}`);
  return response.data;
};

export const updateBookmark = async (id, bookmarkName) => {
  const response = await API.put(`/bookmarks/${id}`, { bookmarkName });
  return response.data;
};

export const deleteBookmark = async (id) => {
  const response = await API.delete(`/bookmarks/${id}`);
  return response.data;
};