// client/src/pages/Upload.jsx
import { useState } from 'react';
import { uploadSong } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', artist: '', genre: '' });
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) return setError('Vui lòng chọn file nhạc');

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('artist', form.artist);
      formData.append('genre', form.genre);
      formData.append('audio', audioFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      await uploadSong(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload thất bại');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: '#1a1a2e',
    border: '1px solid #333', borderRadius: 8, color: '#fff',
    fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16,
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '48px 24px' }}>
      <h2 style={{ color: '#fff', marginBottom: 32 }}>⬆️ Upload Bài Hát</h2>

      {error && (
        <div style={{ background: '#3d1515', color: '#f09595', padding: '10px 16px',
          borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input style={inputStyle} placeholder="Tên bài hát *" required
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input style={inputStyle} placeholder="Nghệ sĩ *" required
          value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
        <input style={inputStyle} placeholder="Thể loại (Pop, Rock, Jazz...)"
          value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />

        <label style={{ color: '#aaa', fontSize: 13, marginBottom: 6, display: 'block' }}>
          File nhạc (MP3, WAV, OGG) *
        </label>
        <input type="file" accept="audio/*" required
          onChange={(e) => setAudioFile(e.target.files[0])}
          style={{ ...inputStyle, padding: '10px 12px' }} />

        <label style={{ color: '#aaa', fontSize: 13, marginBottom: 6, display: 'block' }}>
          Ảnh bìa (JPG, PNG - tuỳ chọn)
        </label>
        <input type="file" accept="image/*"
          onChange={(e) => setThumbnailFile(e.target.files[0])}
          style={{ ...inputStyle, padding: '10px 12px' }} />

        <button type="submit" disabled={loading}
          style={{
            width: '100%', padding: '14px', background: '#534ab7',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 16,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: 8,
          }}>
          {loading ? 'Đang upload...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}