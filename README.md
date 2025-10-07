# 歌词赏析 (Lyrics Appreciation)

- [English](README_EN.md)

## 项目简介

歌词赏析是一个基于React的跨平台应用，使用LLM（大语言模型）进行歌词分析的专业工具。用户可以搜索歌曲、查看歌词，并通过先进的AI模型深入分析歌词含义、情感色彩、修辞手法等。应用支持中英文切换、背景音乐播放、歌词可视化等功能。

在线体验：用户可以在[项目网页](https://qcgm1978.github.io/lyrics)直接使用歌词分析功能。支持多种语言模型：
- DeepSeek：需要配置API key
- Gemini：需要配置API key
- 讯飞：需要配置API key和API secret
- YouChat：直接可用，无需配置密钥

Vercel 部署：用户可以在[Vercel](http://lyrics-gray.vercel.app/)在线体验。

[安卓版下载](https://qcgm1978.github.io/lyrics/download.html)

## 核心功能

- 🖥️ 基于 Capacitor 的跨平台支持（Android）
- 🎵 歌曲搜索和歌词查看功能
- 🧠 LLM驱动的歌词智能分析（情感分析、主题提取、修辞手法识别等）
- 🔍 歌词关键词搜索和筛选
- 🌐 中英文语言切换
- 🎶 背景音乐播放控制（空格键暂停/播放）
- 📱 响应式设计，适配移动端浏览
- 💾 本地数据存储，无需网络连接
- 📱 原生应用手势导航支持

## 开发环境要求

- Node.js 18+
- npm 或 yarn
- Capacitor 6+ (用于移动平台构建)
- React 19+
- TypeScript 5+

## 安装依赖

```bash
# 使用npm安装依赖
npm install
```

## 开发模式

```bash
# 启动开发服务器
npm run dev
```

## 构建应用

### 移动应用 (使用 Capacitor)

```bash
# 添加 Capacitor 平台
npx cap add android

# 构建 Web 应用
npm run build

# 同步到移动平台并构建Android应用（不打开Android Studio）
sudo npm run capacitor:build:android:noopen

# 打开 Android Studio
npx cap open android
```

## 发布到应用市场

### 移动应用市场发布

#### Android (Google Play Store)

1. 构建 Web 应用：
   ```bash
   npm run build
   ```

2. 同步到 Android 平台并设置权限：

```bash
sudo npm run capacitor:build:android:noopen
```

## 使用说明

1. 启动应用后，可以通过搜索功能查找歌曲
2. 点击歌曲查看歌词详情
3. 使用AI分析功能获取歌词深度解析
4. 按空格键可以控制背景音乐的播放和暂停
5. 点击语言切换按钮可以在中英文之间切换
6. 在移动应用中，支持从左向右滑动后退，从右向左滑动前进

## 贡献指南

欢迎贡献代码或提出建议！请先创建 issue 描述问题或功能需求，然后提交 pull request。

## 许可证

本项目采用 MIT 许可证。
