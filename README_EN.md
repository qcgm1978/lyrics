# Lyrics Appreciation

## Project Introduction

Lyrics Appreciation is a React-based cross-platform application that serves as a professional tool for lyrics analysis using LLM (Large Language Models). Users can search for songs, view lyrics, and perform in-depth analysis of lyrics meanings, emotional tones, rhetorical techniques, and more through advanced AI models. The application supports Chinese-English switching, background music playback, lyrics visualization, and other features.

Online experience: Users can directly use the lyrics analysis function on [this project webpage](https://qcgm1978.github.io/lyrics/). Supports multiple language models:
- DeepSeek: Requires API key configuration
- Gemini: Requires API key configuration
- iFlytek: Requires API key and API secret configuration
- YouChat: Directly available, no need to configure keys

Vercel deployment: Users can experience it online at [Vercel](http://lyrics-gray.vercel.app/).

[Android version download](https://qcgm1978.github.io/revelation/download.html)

## Core Features

- 🖥️ Capacitor-based cross-platform support (Android)
- 🎵 Song search and lyrics viewing functionality
- 🧠 LLM-driven intelligent lyrics analysis (sentiment analysis, theme extraction, rhetorical technique recognition, etc.)
- 🔍 Lyrics keyword search and filtering
- 🌐 Chinese-English language switching
- 🎶 Background music playback control (space bar to pause/play)
- 📱 Responsive design, adapting to mobile browsing
- 💾 Local data storage, no network connection required
- 📱 Native application gesture navigation support

## Development Environment Requirements

- Node.js 18+
- npm or yarn
- Capacitor 6+ (for mobile platform building)
- React 19+
- TypeScript 5+

## Install Dependencies

```bash
# Install dependencies using npm
npm install
```

## Development Mode

```bash
# Start the development server
npm run dev
```

## Build the Application

### Mobile Application (Using Capacitor)

```bash
# Add Capacitor platform
npx cap add android

# Build the Web application
npm run build

# Sync to mobile platform and build Android application (without opening Android Studio)
sudo npm run capacitor:build:android:noopen

# Open Android Studio
npx cap open android
```

## Publish to App Market

### Mobile App Market Publishing

#### Android (Google Play Store)

1. Build the Web application:
   ```bash
   npm run build
   ```

2. Sync to Android platform and set permissions:

```bash
sudo npm run capacitor:build:android:noopen
```

## Usage Instructions

1. After starting the application, you can search for songs through the search function
2. Click on a song to view detailed lyrics
3. Use AI analysis function to obtain in-depth lyrics interpretation
4. Press the space bar to control the playback and pause of background music
5. Click the language switch button to switch between Chinese and English
6. In mobile applications, support swiping from left to right to go back, and from right to left to go forward

## Contribution Guidelines

Contributions or suggestions are welcome! Please create an issue to describe the problem or feature request first, and then submit a pull request.

## License

This project is licensed under the MIT License.