// client/src/components/Layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#0a0a15', borderBottom: '1px solid #222',
      padding: '0 24px', height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/" style={{ color: '#7f77dd', textDecoration: 'none', fontSize: 20, fontWeight: 700 }}>
        🎵 MusicApp
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={linkStyle}>Trang chủ</Link>
        {user && <Link to="/upload" style={linkStyle}>Upload</Link>}
        {user && <Link to="/playlists" style={linkStyle}>Playlist</Link>}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#aaa', fontSize: 14 }}>👤 {user.username}</span>
            <button onClick={handleLogout}
              style={{ background: '#2a1a1a', border: '1px solid #444', color: '#f09595',
                padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" style={{ ...linkStyle, background: '#534ab7', padding: '6px 16px', borderRadius: 6 }}>
              Đăng nhập
            </Link>
            <Link to="/register" style={{ ...linkStyle, border: '1px solid #534ab7', padding: '6px 16px', borderRadius: 6 }}>
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

const linkStyle = { color: '#ccc', textDecoration: 'none', fontSize: 14 };