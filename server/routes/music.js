const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const { uploadSong, getAllSongs, getSongById, deleteSong, getGenres } = require('../controllers/musicController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') cb(null, 'uploads/audio/');
    else cb(null, 'uploads/thumbnails/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage }).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

router.get('/', getAllSongs);
router.get('/genres', getGenres);
router.get('/:id', getSongById);
router.post('/upload', authenticateToken, upload, uploadSong);
router.delete('/:id', authenticateToken, deleteSong);

module.exports = router;