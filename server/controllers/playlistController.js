const db = require('../config/db');

const createPlaylist = async (req, res) => {
  try {
    const [result] = await db.execute('INSERT INTO playlists (name, user_id) VALUES (?, ?)', [req.body.name, req.user.id]);
    res.status(201).json({ message: 'Tạo playlist thành công', playlistId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const [playlists] = await db.execute(
      'SELECT p.*, COUNT(ps.song_id) as song_count FROM playlists p LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id WHERE p.user_id = ? GROUP BY p.id ORDER BY p.created_at DESC',
      [req.user.id]
    );
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getPlaylistSongs = async (req, res) => {
  try {
    const [songs] = await db.execute(
      'SELECT s.*, u.username as uploader FROM playlist_songs ps JOIN songs s ON ps.song_id = s.id JOIN users u ON s.user_id = u.id WHERE ps.playlist_id = ? ORDER BY ps.added_at DESC',
      [req.params.id]
    );
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const [existing] = await db.execute(
      'SELECT id FROM playlist_songs WHERE playlist_id = ? AND song_id = ?', [req.params.id, req.body.songId]
    );
    if (existing.length > 0) return res.status(400).json({ message: 'Bài hát đã có trong playlist' });
    await db.execute('INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)', [req.params.id, req.body.songId]);
    res.json({ message: 'Thêm vào playlist thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    await db.execute('DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?', [req.params.id, req.params.songId]);
    res.json({ message: 'Xóa khỏi playlist thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    await db.execute('DELETE FROM playlists WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Xóa playlist thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { createPlaylist, getUserPlaylists, getPlaylistSongs, addSongToPlaylist, removeSongFromPlaylist, deletePlaylist };
