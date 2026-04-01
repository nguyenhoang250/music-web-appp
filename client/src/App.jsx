// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Layout/Navbar';
import MusicPlayer from './components/Music/MusicPlayer';
import Home from './pages/Home';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Upload from './pages/Upload';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
      </Routes>
      <MusicPlayer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}