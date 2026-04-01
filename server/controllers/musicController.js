const db = require('../config/db');
const fs = require('fs');

const uploadSong = async (req, res) => {
  try {
    const { title, artist, genre } = req.body;
    const audioFile = req.files?.audio?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    if (!audioFile) return res.status(400).json({ message: 'File nhạc là bắt buộc' });

    const [result] = await db.execute(
      'INSERT INTO songs (title, artist, genre, file_path, thumbnail, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, artist, genre || 'Unknown', `uploads/audio/${audioFile.filename}`,
       thumbnailFile ? `uploads/thumbnails/${thumbnailFile.filename}` : null, req.user.id]
    );
    res.status(201).json({ message: 'Upload thành công', songId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getAllSongs = async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = 'SELECT s.*, u.username as uploader FROM songs s JOIN users u ON s.user_id = u.id WHERE 1=1';
    const params = [];

    if (search) { query += ' AND (s.title LIKE ? OR s.artist LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (genre) { query += ' AND s.genre = ?'; params.push(genre); }
    query += ' ORDER BY s.created_at DESC';

    const [songs] = await db.execute(query, params);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getSongById = async (req, res) => {
  try {
    const [songs] = await db.execute(
      'SELECT s.*, u.username as uploader FROM songs s JOIN users u ON s.user_id = u.id WHERE s.id = ?',
      [req.params.id]
    );
    if (songs.length === 0) return res.status(404).json({ message: 'Không tìm thấy bài hát' });
    await db.execute('UPDATE songs SET play_count = play_count + 1 WHERE id = ?', [req.params.id]);
    res.json(songs[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const deleteSong = async (req, res) => {
  try {
    const [songs] = await db.execute('SELECT * FROM songs WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (songs.length === 0) return res.status(404).json({ message: 'Không tìm thấy bài hát' });
    const song = songs[0];
    if (fs.existsSync(song.file_path)) fs.unlinkSync(song.file_path);
    if (song.thumbnail && fs.existsSync(song.thumbnail)) fs.unlinkSync(song.thumbnail);
    await db.execute('DELETE FROM songs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getGenres = async (req, res) => {
  try {
    const [genres] = await db.execute('SELECT DISTINCT genre FROM songs ORDER BY genre');
    res.json(genres.map((g) => g.genre));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { uploadSong, getAllSongs, getSongById, deleteSong, getGenres };