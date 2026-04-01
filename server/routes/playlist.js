const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createPlaylist, getUserPlaylists, getPlaylistSongs,
  addSongToPlaylist, removeSongFromPlaylist, deletePlaylist,
} = require('../controllers/playlistController');

router.get('/', authenticateToken, getUserPlaylists);
router.post('/', authenticateToken, createPlaylist);
router.get('/:id/songs', getPlaylistSongs);
router.post('/:id/songs', authenticateToken, addSongToPlaylist);
router.delete('/:id/songs/:songId', authenticateToken, removeSongFromPlaylist);
router.delete('/:id', authenticateToken, deletePlaylist);

module.exports = router;