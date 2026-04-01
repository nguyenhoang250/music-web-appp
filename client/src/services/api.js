// client/src/services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Tự động thêm token vào header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Music
export const getAllSongs = (params) => API.get('/music', { params });
export const getSongById = (id) => API.get(`/music/${id}`);
export const uploadSong = (formData) =>
  API.post('/music/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteSong = (id) => API.delete(`/music/${id}`);
export const getGenres = () => API.get('/music/genres');

// Playlist
export const getUserPlaylists = () => API.get('/playlists');
export const createPlaylist = (data) => API.post('/playlists', data);
export const getPlaylistSongs = (id) => API.get(`/playlists/${id}/songs`);
export const addSongToPlaylist = (playlistId, songId) =>
  API.post(`/playlists/${playlistId}/songs`, { songId });
export const removeSongFromPlaylist = (playlistId, songId) =>
  API.delete(`/playlists/${playlistId}/songs/${songId}`);
export const deletePlaylist = (id) => API.delete(`/playlists/${id}`);