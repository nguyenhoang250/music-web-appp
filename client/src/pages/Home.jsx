// client/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { getAllSongs, getGenres } from '../services/api';
import MusicCard from '../components/Music/MusicCard';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedGenre) params.genre = selectedGenre;
      const res = await getAllSongs(params);
      setSongs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGenres().then((res) => setGenres(res.data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchSongs, 400);
    return () => clearTimeout(timer);
  }, [search, selectedGenre]);

  return (
    <div style={{ padding: '24px', paddingBottom: 100 }}>
      <h1 style={{ color: '#fff', marginBottom: 24 }}>🎵 Khám Phá Âm Nhạc</h1>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Tìm kiếm bài hát, nghệ sĩ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 240, padding: '10px 16px',
            background: '#1a1a2e', border: '1px solid #333',
            borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none',
          }}
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{
            padding: '10px 16px', background: '#1a1a2e',
            border: '1px solid #333', borderRadius: 8,
            color: '#fff', fontSize: 14, outline: 'none',
          }}
        >
          <option value="">Tất cả thể loại</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Song Grid */}
      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: 48 }}>Đang tải...</div>
      ) : songs.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', padding: 48 }}>
          Không tìm thấy bài hát nào
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}>
          {songs.map((song) => (
            <MusicCard key={song.id} song={song} songList={songs} />
          ))}
        </div>
      )}
    </div>
  );
}