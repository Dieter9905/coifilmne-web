// Subtitle Service - Tìm vietsub từ các nguồn khác nhau
export const getVietsub = async (movieTitle, year) => {
  try {
    // Try OpenSubtitles.com API
    const searchQuery = encodeURIComponent(`${movieTitle} ${year || ''}`);
    
    // Sử dụng OpenSubtitles API để tìm vietsub
    const response = await fetch(
      `https://api.opensubtitles.com/api/v1/subtitles?query=${searchQuery}&languages=vi`,
      {
        headers: {
          'Api-Key': 'UtPuWM4mHu46FhbHHBwMYLs1wPdg52sO', // Free tier key
          'User-Agent': 'CoiFilm v1.0'
        }
      }
    );

    if (!response.ok) {
      console.log('OpenSubtitles API not available');
      return null;
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      // Lấy subtitle file đầu tiên có rating cao nhất
      const subtitle = data.data
        .filter(s => s.attributes.language === 'vi')
        .sort((a, b) => (b.attributes.ratings || 0) - (a.attributes.ratings || 0))[0];
      
      if (subtitle) {
        return {
          url: subtitle.attributes.url,
          language: 'Vietnamese',
          source: 'OpenSubtitles'
        };
      }
    }

    return null;
  } catch (error) {
    console.log('Error fetching subtitle:', error);
    return null;
  }
};

// Download vietsub file
export const downloadSubtitle = async (url) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Nếu file bị gzip, decompress
    if (text.includes('H4sIAA')) {
      // Base64 decode và decompress
      return await decompressSubtitle(text);
    }
    
    return text;
  } catch (error) {
    console.log('Error downloading subtitle:', error);
    return null;
  }
};

// Decompress gzip subtitle
const decompressSubtitle = async (base64Text) => {
  try {
    const binaryString = atob(base64Text);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decompress using pako
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pako@2/dist/pako.min.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        const decompressed = window.pako.inflate(bytes, { to: 'string' });
        resolve(decompressed);
      };
    });
  } catch (error) {
    console.log('Error decompressing subtitle:', error);
    return null;
  }
};

// Tạo VTT subtitle từ SRT
export const convertSrtToVtt = (srtContent) => {
  let vttContent = 'WEBVTT\n\n';
  
  // SRT format: 1\n00:00:00,000 --> 00:00:05,000\nText\n
  // VTT format: 00:00:00.000 --> 00:00:05.000\nText\n
  
  const lines = srtContent.split('\n');
  for (let line of lines) {
    if (line.match(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/)) {
      // Chuyển dấu phẩy thành dấu chấm
      vttContent += line.replace(/,/g, '.') + '\n';
    } else if (line.trim() !== '' && !line.match(/^\d+$/)) {
      vttContent += line + '\n';
    } else if (line.trim() === '') {
      vttContent += '\n';
    }
  }
  
  return vttContent;
};

// Lấy blob URL từ subtitle content
export const getSubtitleBlobUrl = (content, type = 'text/vtt') => {
  const blob = new Blob([content], { type });
  return URL.createObjectURL(blob);
};
