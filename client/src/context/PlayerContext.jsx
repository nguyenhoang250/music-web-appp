// client/src/context/PlayerContext.jsx
import { createContext, useContext, useState } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song, songList = []) => {
    setCurrentSong(song);
    setQueue(songList);
    setIsPlaying(true);
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const nextSong = queue[currentIndex + 1];
    if (nextSong) setCurrentSong(nextSong);
  };

  const playPrev = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevSong = queue[currentIndex - 1];
    if (prevSong) setCurrentSong(prevSong);
  };

  return (
    <PlayerContext.Provider value={{ currentSong, queue, isPlaying, setIsPlaying, playSong, playNext, playPrev }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);