// client/src/components/Music/MusicCard.jsx
import { usePlayer } from '../../context/PlayerContext';
import { addSongToPlaylist, getUserPlaylists } from '../../services/api';
import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export default function MusicCard({ song, songList = [] }) {
  const { playSong, currentSong } = usePlayer();
  const [showMenu, setShowMenu] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const isPlaying = currentSong?.id === song.id;
  const thumbnailUrl = song.thumbnail
    ? `${BASE_URL}/${song.thumbnail}`
    : '/default-thumbnail.png';

  const handleAddToPlaylist = async () => {
    const res = await getUserPlaylists();
    setPlaylists(res.data);
    setShowMenu(true);
  };

  const handleSelectPlaylist = async (playlistId) => {
    await addSongToPlaylist(playlistId, song.id);
    setShowMenu(false);
    alert('Đã thêm vào playlist!');
  };

  return (
    <div style={{
      background: isPlaying ? '#16213e' : '#0f0f1a',
      border: isPlaying ? '1px solid #7f77dd' : '1px solid #222',
      borderRadius: 12, padding: 16, cursor: 'pointer',
      transition: 'all 0.2s', position: 'relative',
    }}>
      <img src={thumbnailUrl} alt={song.title}
        onClick={() => playSong(song, songList)}
        style={{ width: '100%', aspectRatio: '1', borderRadius: 8, objectFit: 'cover', marginBottom: 10 }} />
      <div style={{ fontWeight: 600, color: '#fff', fontSize: 14, marginBottom: 4,
        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {song.title}
      </div>
      <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>{song.artist}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#555', background: '#1a1a2e', padding: '2px 8px', borderRadius: 20 }}>
          {song.genre}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); handleAddToPlaylist(); }}
          style={{ background: 'none', border: 'none', color: '#7f77dd', cursor: 'pointer', fontSize: 18 }}
          title="Thêm vào playlist"
        >+</button>
      </div>

      {showMenu && (
        <div style={{
          position: 'absolute', bottom: '100%', right: 0,
          background: '#1a1a2e', border: '1px solid #333',
          borderRadius: 8, padding: 8, zIndex: 100, minWidth: 160,
        }}>
          <div style={{ color: '#aaa', fontSize: 12, padding: '4px 8px', marginBottom: 4 }}>
            Chọn playlist:
          </div>
          {playlists.map((pl) => (
            <div key={pl.id}
              onClick={() => handleSelectPlaylist(pl.id)}
              style={{ padding: '6px 12px', color: '#fff', cursor: 'pointer',
                borderRadius: 4, fontSize: 13,
                ':hover': { background: '#2a2a3e' } }}>
              {pl.name}
            </div>
          ))}
          <div onClick={() => setShowMenu(false)}
            style={{ padding: '6px 12px', color: '#888', cursor: 'pointer', fontSize: 12 }}>
            Hủy
          </div>
        </div>
      )}
    </div>
  );
}