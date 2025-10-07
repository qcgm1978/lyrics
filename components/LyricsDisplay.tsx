// @ts-ignore
import { useState, useEffect } from 'react';
import { Song, Lyrics } from '../services/lyricsService';
import audioManager from '../utils/audioManager';
import { segmentChineseText } from './ContentDisplay';

interface LyricsDisplayProps {
  song: Song;
  lyrics: Lyrics | null;
  onLyricClick: (text: string) => void;
  language: 'zh' | 'en';
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ song, lyrics, onLyricClick, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  
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
  
  const cleanSegment = (segment: string): string => {
    return segment.replace(/[.,!?;:()"'，。！？；：（）""'']/g, "");
  };
  
  const isClickableSegment = (segment: string): boolean => {
    if (/[\u4e00-\u9fff]/.test(segment) && segment.length >= 2) {
      return true;
    }
    
    if (/^[a-zA-Z]{2,}$/.test(segment)) {
      return true;
    }
    return false;
  };
  
  const handleWordClick = (segment: string, cleanSegment: string, line: string) => {
    if (isMultiSelectMode) {
      setSelectedWords((prev) => {
        if (prev.includes(cleanSegment)) {
          return prev.filter((w) => w !== cleanSegment);
        } else {
          return [...prev, cleanSegment];
        }
      });
    } else {
      onLyricClick(cleanSegment);
    }
  };
  
  const renderLyricLine = (line: string, index: number) => {
    const segments = segmentChineseText(line);
    
    return (
      <p 
        key={index} 
        className="lyric-line"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onLyricClick(line);
          }
        }}
      >
        {segments.map((segment, segIndex) => {
          const cleanSegmentText = cleanSegment(segment);
          
          if (isClickableSegment(segment)) {
            const isSelected = selectedWords.includes(cleanSegmentText);
            return (
              <span
                key={segIndex}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWordClick(segment, cleanSegmentText, line);
                }}
                style={{
                  padding: "2px 4px",
                  margin: "0 1px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  color: isSelected ? "#fff" : "#007bff",
                  backgroundColor: isSelected ? "#007bff" : "transparent",
                  textDecoration: "underline",
                  textDecorationColor: isSelected ? "transparent" : "#007bff",
                  display: "inline",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && e.currentTarget instanceof HTMLElement) {
                    e.currentTarget.style.backgroundColor = "#f0f8ff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected && e.currentTarget instanceof HTMLElement) {
                    e.currentTarget.style.backgroundColor = isSelected
                      ? "#007bff"
                      : "transparent";
                  }
                }}
              >
                {segment}
              </span>
            );
          } else {
            return <span key={segIndex}>{segment}</span>;
          }
        })}
      </p>
    );
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
        {lyrics.lines.map((line, index) => renderLyricLine(line, index))}
      </div>
    </div>
  );
};

export default LyricsDisplay;