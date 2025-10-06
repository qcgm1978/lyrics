import { streamDefinition } from 'llm-service-provider';
import { hasApiKey } from 'llm-service-provider';
import { loadData } from './dataService';

// 搜索歌曲的接口定义
export interface Song {
  id: string;
  name: string;
  artist: string;
  album?: string;
  preview_url?: string;
}

// 歌词的接口定义
export interface Lyrics {
  song: Song;
  content: string;
  lines: string[];
}

// 搜索歌曲的函数
export const searchSongs = async (query: string): Promise<Song[]> => {
  try {
    // 先从本地数据搜索
    // const data = await loadData();
    const data = {};
    let songs: Song[] = [];
    
    if (data.tracks && Array.isArray(data.tracks)) {
      songs = data.tracks
        .filter((track: any) => 
          track.name.toLowerCase().includes(query.toLowerCase()) ||
          (track.artists && track.artists.some((artist: any) => 
            artist.name.toLowerCase().includes(query.toLowerCase())
          ))
        )
        .map((track: any) => ({
          id: track.id,
          name: track.name,
          artist: track.artists ? track.artists.map((a: any) => a.name).join(', ') : '未知艺术家',
          album: track.album?.name,
          preview_url: track.preview_url
        }));
    } else if (data.track) {
      const track = data.track;
      if (track.name.toLowerCase().includes(query.toLowerCase()) ||
          (track.artists && track.artists.some((artist: any) => 
            artist.name.toLowerCase().includes(query.toLowerCase())
          ))
      ) {
        songs.push({
          id: track.id,
          name: track.name,
          artist: track.artists ? track.artists.map((a: any) => a.name).join(', ') : '未知艺术家',
          album: track.album?.name,
          preview_url: track.preview_url
        });
      }
    }
    
    // 如果本地没有找到结果且有API密钥，通过API搜索
    if (songs.length === 0 && hasApiKey()) {
      try {
        let accumulatedResult = '';
        const apiQuery = `请提供歌名为"${query}"的歌曲信息，返回格式为JSON数组，包含id、name、artist、album字段。如果找不到，请返回空数组。请直接返回JSON内容，不要包含任何格式说明（如\`\`\`json等标记）`;
        
        for await (const chunk of streamDefinition(
          apiQuery,
          'zh',
          'music_search',
          ''
        )) {
          if (chunk.startsWith('Error:')) {
            throw new Error(chunk);
          }
          accumulatedResult += chunk;
        }
        
        // 解析API返回的JSON结果
        try {
          const apiSongs = JSON.parse(accumulatedResult);
          if (Array.isArray(apiSongs)) {
            songs = apiSongs.map((song: any) => ({
              id: song.id || `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: song.name || '未知歌曲',
              artist: song.artist || '未知艺术家',
              album: song.album,
              preview_url: song.preview_url
            }));
          }
        } catch (parseError) {
          console.error('解析API返回的歌曲数据失败:', parseError);
        }
      } catch (apiError) {
        console.error('通过API搜索歌曲失败:', apiError);
      }
    }
    
    return songs;
  } catch (error) {
    console.error('搜索歌曲失败:', error);
    return [];
  }
};

// 获取歌词的函数
export const getLyrics = async (songId: string, songName: string, song?: Song): Promise<Lyrics | null> => {
  try {
    // 优先使用传入的song参数
    let targetSong: Song | null = song || null;
    let artistName = '未知艺术家';
    
    if (!targetSong) {
      // 不再从本地数据查找，直接创建默认歌曲对象
      targetSong = {
        id: songId,
        name: songName,
        artist: '未知艺术家'
      };
      artistName = '未知艺术家';
    } else {
      artistName = targetSong.artist || '未知艺术家';
    }
    
    // 使用streamDefinition获取歌词数据
    let lyricsContent = `[${songName}] 的歌词暂未找到`;
    
    if (hasApiKey()) {
      try {
        let accumulatedLyrics = '';
        const query = `请提供歌曲《${songName}》由${artistName}演唱的完整歌词。请直接返回歌词内容，不要包含任何说明。如果找不到，请返回"未找到歌词"。`;
        
        for await (const chunk of streamDefinition(
          query,
          'zh',
          'lyrics',
          ''
        )) {
          if (chunk.startsWith('Error:')) {
            throw new Error(chunk);
          }
          accumulatedLyrics += chunk;
        }
        
        lyricsContent = accumulatedLyrics || `[${songName}] 的歌词暂未找到`;
      } catch (apiError) {
        console.error('通过API获取歌词失败:', apiError);
      }
    }
    
    // 分割歌词行
    const lines = lyricsContent.split('\n').filter(line => line.trim() !== '');
    
    return {
      song: targetSong,
      content: lyricsContent,
      lines
    };
  } catch (error) {
    console.error('获取歌词失败:', error);
    return null;
  }
};

// 导出歌词服务
export const lyricsService = {
  searchSongs,
  getLyrics
};

// 导出默认服务
export default lyricsService;