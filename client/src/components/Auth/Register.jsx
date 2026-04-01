// client/src/pages/Register.jsx
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Mật khẩu không khớp');
    if (form.password.length < 6) return setError('Mật khẩu phải từ 6 ký tự trở lên');

    setLoading(true);
    setError('');
    try {
      await register(form.username, form.email, form.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
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
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: 32 }}>Đăng Ký</h2>

      {error && (
        <div style={{ background: '#3d1515', color: '#f09595', padding: '10px 16px',
          borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {[
          { key: 'username', placeholder: 'Username', type: 'text' },
          { key: 'email', placeholder: 'Email', type: 'email' },
          { key: 'password', placeholder: 'Mật khẩu', type: 'password' },
          { key: 'confirm', placeholder: 'Xác nhận mật khẩu', type: 'password' },
        ].map(({ key, placeholder, type }) => (
          <input key={key} style={inputStyle} type={type} placeholder={placeholder} required
            value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        ))}

        <button type="submit" disabled={loading}
          style={{
            width: '100%', padding: '14px', background: '#534ab7',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 16,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
        </button>
      </form>

      <p style={{ color: '#888', textAlign: 'center', marginTop: 20, fontSize: 14 }}>
        Đã có tài khoản?{' '}
        <Link to="/login" style={{ color: '#7f77dd' }}>Đăng nhập</Link>
      </p>
    </div>
  );
}