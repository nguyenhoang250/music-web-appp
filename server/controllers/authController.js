const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?', [email, username]
    );
    if (existing.length > 0) return res.status(400).json({ message: 'Email hoặc username đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: 'Đăng ký thành công', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?', [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ message: 'User không tồn tại' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { register, login, getProfile };