// client/src/components/Music/MusicPlayer.jsx
import { usePlayer } from '../../context/PlayerContext';

const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export default function MusicPlayer() {
  const { currentSong, playNext, playPrev, isPlaying, setIsPlaying } = usePlayer();

  if (!currentSong) return null;

  const audioUrl = `${BASE_URL}/${currentSong.file_path}`;
  const thumbnailUrl = currentSong.thumbnail
    ? `${BASE_URL}/${currentSong.thumbnail}`
    : '/default-thumbnail.png';

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#1a1a2e', color: '#fff', padding: '12px 24px',
      display: 'flex', alignItems: 'center', gap: '16px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)', zIndex: 1000,
    }}>
      <img src={thumbnailUrl} alt={currentSong.title}
        style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {currentSong.title}
        </div>
        <div style={{ fontSize: 12, color: '#aaa' }}>{currentSong.artist}</div>
      </div>
      <audio
        key={currentSong.id}
        src={audioUrl}
        autoPlay={isPlaying}
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={playNext}
        style={{ flex: 2 }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={playPrev} style={btnStyle}>⏮</button>
        <button onClick={playNext} style={btnStyle}>⏭</button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: 'none', color: '#fff',
  width: 36, height: 36, borderRadius: '50%',
  cursor: 'pointer', fontSize: 16,
};