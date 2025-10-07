// @ts-ignore
import { useState } from 'react';
import SongSearch from './SongSearch';
import LyricsDisplay from './LyricsDisplay';
import { Song, Lyrics } from '../services/lyricsService';
import lyricsService from '../services/lyricsService';
import '../lyrics.css';
interface SongLyricsPageProps {
  onLyricClick?: (lyric: string) => void;
  language?: 'en' | 'zh';
  setIsApiKeyManagerOpen?: () => void;
}

const SongLyricsPage: React.FC<SongLyricsPageProps> = ({ 
  onLyricClick,
  language = 'zh',
  setIsApiKeyManagerOpen
}) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSongSelect = async (song: Song) => {
    setSelectedSong(song);
    setIsLoading(true);
    try {
      const songLyrics = await lyricsService.getLyrics(song.id,song.name,song);
      setLyrics(songLyrics);
    } catch (error) {
      console.error('Failed to fetch lyrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLyricClick = (lyric: string) => {
    if (onLyricClick) {
      onLyricClick(lyric);
    }
  };

  return (
    <div className="song-lyrics-page">
      <div className="song-search-section">
        <h2>{language === 'zh' ? '搜索歌曲' : 'Search Songs'}</h2>
        <SongSearch 
          onSongSelect={handleSongSelect} 
          language={language} 
          setIsApiKeyManagerOpen={setIsApiKeyManagerOpen}
        />
      </div>
      
      {isLoading && (
        <div className="loading-indicator">
          {language === 'zh' ? '加载歌词中...' : 'Loading lyrics...'}
        </div>
      )}
      
      {selectedSong && lyrics && (
        <div className="lyrics-display-section">
          <h2>{language === 'zh' ? '歌词展示' : 'Lyrics Display'}</h2>
          <LyricsDisplay 
            song={selectedSong} 
            lyrics={lyrics} 
            onLyricClick={handleLyricClick}
            language={language}
          />
        </div>
      )}
      
      {selectedSong && !lyrics && !isLoading && (
        <div className="no-lyrics-message">
          {language === 'zh' ? '暂无歌词数据' : 'No lyrics data available'}
        </div>
      )}
    </div>
  );
};

export default SongLyricsPage;