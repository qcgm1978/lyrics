// @ts-ignore
import React, { useState } from 'react';
import { Song } from '../services/lyricsService';
import lyricsService from '../services/lyricsService';

interface SongSearchProps {
  onSongSelect: (song: Song) => void;
  language?: 'en' | 'zh';
  setIsApiKeyManagerOpen?: () => void;
}

const SongSearch: React.FC<SongSearchProps> = ({ 
  onSongSelect, 
  language = 'zh',
  setIsApiKeyManagerOpen
}) => {
  const [query, setQuery] = useState<string>('泡沫');
  const [results, setResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      setHasSearched(true);
      try {
        const searchResults = await lyricsService.searchSongs(query);
        setResults(searchResults);
        if(searchResults.length==0 && setIsApiKeyManagerOpen){
          setIsApiKeyManagerOpen();
        }
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelectSong = (song: Song) => {
    onSongSelect(song);
    setResults([]);
    setQuery('');
  };

  return (
    <div className="song-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === 'zh' ? '输入歌曲名或艺术家搜索...' : 'Search by song name or artist...'}
          className="search-input"
        />
        <button type="submit" disabled={isSearching} className="search-button">
          {isSearching ? (language === 'zh' ? '搜索中...' : 'Searching...') : (language === 'zh' ? '搜索' : 'Search')}
        </button>
      </form>
      
      {results.length > 0 && (
        <div className="search-results">
          {results.map((song) => (
            <div 
              key={song.id} 
              className="song-result-item"
              onClick={() => handleSelectSong(song)}
            >
              <div className="song-name">{song.name}</div>
              <div className="song-artist">{song.artist}</div>
              {song.album && <div className="song-album">{song.album}</div>}
            </div>
          ))}
        </div>
      )}
      
      {hasSearched && isSearching === false && results.length === 0 && query.trim() !== '' && (
        <div className="no-results">
          {language === 'zh' ? '未找到匹配的歌曲' : 'No matching songs found'}
        </div>
      )}
    </div>
  );
};

export default SongSearch;