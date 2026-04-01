// client/src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
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
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px' }}>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: 32 }}>Đăng Nhập</h2>

      {error && (
        <div style={{ background: '#3d1515', color: '#f09595', padding: '10px 16px',
          borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input style={inputStyle} type="email" placeholder="Email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={inputStyle} type="password" placeholder="Mật khẩu" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" disabled={loading}
          style={{
            width: '100%', padding: '14px', background: '#534ab7',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 16,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
      </form>

      <p style={{ color: '#888', textAlign: 'center', marginTop: 20, fontSize: 14 }}>
        Chưa có tài khoản?{' '}
        <Link to="/register" style={{ color: '#7f77dd' }}>Đăng ký ngay</Link>
      </p>
    </div>
  );
}