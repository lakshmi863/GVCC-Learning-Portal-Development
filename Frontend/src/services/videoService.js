import API from './api';

export const getVideos = async () => {
  const response = await API.get('/videos');
  return response.data;
};

export const getVideoById = async (id) => {
  const response = await API.get(`/videos/${id}`);
  return response.data;
};