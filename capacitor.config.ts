import type { CapacitorConfig } from '@capacitor/cli';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// 读取 package.json 文件
const packageJsonPath = resolve(__dirname, 'package.json');
const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
const packageJson = JSON.parse(packageJsonContent);
const displayName = packageJson.displayName;

const config: CapacitorConfig = {
  appId: 'com.revelation.app',
  appName: displayName,
  webDir: 'dist',
  android: {
    webView: {
      allowFileAccess: true,
      javaScriptEnabled: true,
      domStorageEnabled: true,
      webContentsDebuggingEnabled: true,
      hardwareAcceleration: true,
      useHybridComposition: true,
      setOnTouchListener: true,
      // 添加Web Speech API支持相关配置
      defaultWebSettings: {
        mediaPlaybackRequiresUserGesture: false
      }
    },
    backButtonBehavior: 'back',
    iconPath: {
      ldpi: 'assets/android/icon_36x36.png',
      mdpi: 'assets/android/icon_48x48.png',
      hdpi: 'assets/android/icon_72x72.png',
      xhdpi: 'assets/android/icon_96x96.png',
      xxhdpi: 'assets/android/icon_144x144.png',
      xxxhdpi: 'assets/android/icon_192x192.png'
    },
    roundIconPath: {
      ldpi: 'assets/android/icon_36x36.png',
      mdpi: 'assets/android/icon_48x48.png',
      hdpi: 'assets/android/icon_72x72.png',
      xhdpi: 'assets/android/icon_96x96.png',
      xxhdpi: 'assets/android/icon_144x144.png',
      xxxhdpi: 'assets/android/icon_192x192.png'
    }
  }
};


export default config;
