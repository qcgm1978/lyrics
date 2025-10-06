import { useState, useEffect } from 'react';
import { Song, Lyrics } from '../services/lyricsService';
import audioManager from '../utils/audioManager';

interface LyricsDisplayProps {
  song: Song;
  lyrics: Lyrics | null;
  onLyricClick: (text: string) => void;
  language: 'zh' | 'en';
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ song, lyrics, onLyricClick, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const checkAudioStatus = () => {
      setIsPlaying(audioManager.isAudioPlaying());
    };
    
    window.addEventListener('audioStatusChange', checkAudioStatus);
    return () => {
      window.removeEventListener('audioStatusChange', checkAudioStatus);
    };
  }, []);
  
  const handlePlayPreview = () => {
    if (song.preview_url) {
      if (isPlaying) {
        audioManager.stopAudio();
      } else {
        audioManager.toggleAudio({
          name: song.name,
          artists: [{ name: song.artist }],
          preview_url: song.preview_url
        });
      }
    }
  };
  
  if (!lyrics) {
    return (
      <div className="lyrics-container">
        <p>{language === 'zh' ? '请搜索歌曲以查看歌词' : 'Please search for a song to view lyrics'}</p>
      </div>
    );
  }
  
  return (
    <div className="lyrics-container">
      <div className="song-info">
        <h3>{song.name}</h3>
        <p>{song.artist}</p>
        {song.album && <p>{song.album}</p>}
        {song.preview_url && (
          <button 
            onClick={handlePlayPreview} 
            className="play-button"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        )}
      </div>
      
      <div className="lyrics-content">
        {lyrics.lines.map((line, index) => (
          <p 
            key={index} 
            className="lyric-line"
            onClick={() => onLyricClick(line)}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LyricsDisplay;