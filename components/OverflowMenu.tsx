import React from "react";

// 首先在文件顶部添加Capacitor的导入
import { Capacitor } from '@capacitor/core';

interface HeaderProps {
  language: "zh" | "en";
  isOverflowMenuOpen: boolean;
  setIsOverflowMenuOpen: (open: boolean) => void;
  hasValidApiKey: boolean;
  setIsApiKeyManagerOpen: (open: boolean) => void;
  directoryData: any;
  isUsingUploadedData: boolean;
  currentBookId: string | null;
  uploadedBooksMetadata: Array<{ id: string; title: string }>;
  uploadErrorMessage: string | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (
    topic: string,
    page?: string[],
    category?: string,
    context?: string
  ) => void;
  switchToDefaultBook: () => void;
  switchToUploadedBook: (bookId: string) => void;
  showSongLyricsPage?: boolean;
  setShowSongLyricsPage?: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  language,
  isOverflowMenuOpen,
  setIsOverflowMenuOpen,
  hasValidApiKey,
  setIsApiKeyManagerOpen,
  directoryData,
  isUsingUploadedData,
  currentBookId,
  uploadedBooksMetadata,
  uploadErrorMessage,
  handleFileUpload,
  handleSearch,
  switchToDefaultBook,
  switchToUploadedBook,
  showSongLyricsPage = false,
  setShowSongLyricsPage = () => {},
}) => {
  return (
    <header>
      <div id="menu-wrapper">
        <button
          id="menu-button"
          onClick={() => setIsOverflowMenuOpen(!isOverflowMenuOpen)}
          title={language === "zh" ? "更多选项" : "More Options"}
        >
          ⋮
        </button>

        {isOverflowMenuOpen && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "transparent",
                zIndex: 999,
              }}
              onClick={() => setIsOverflowMenuOpen(false)}
            />
            <div
              id="setting"
              style={{
                position: "absolute",
                top: "3rem",
                right: "0.7rem",
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                padding: "0.5rem",
                width: "200px",
                zIndex: 1000,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 添加语言选择功能 */}
              <div style={{ marginBottom: "0.5rem", width: "100%" }}>
                <div
                  style={{
                    background: "#34495e",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                  }}
                >
                  {language === "zh" ? "语言选择" : "Language Selection"}
                </div>
                <div
                  style={{
                    display: "flex",
                    border: "2px solid #e1e8ed",
                    borderRadius: "8px",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={() => {
                      document.dispatchEvent(
                        new CustomEvent("languageChange", { detail: "zh" })
                      );
                      setIsOverflowMenuOpen(false);
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      border: "none",
                      background: language === "zh" ? "#3498db" : "#f8f9fa",
                      color: language === "zh" ? "white" : "#666",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                      width: "50%",
                    }}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => {
                      document.dispatchEvent(
                        new CustomEvent("languageChange", { detail: "en" })
                      );
                      setIsOverflowMenuOpen(false);
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      border: "none",
                      background: language === "en" ? "#3498db" : "#f8f9fa",
                      color: language === "en" ? "white" : "#666",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                      width: "50%",
                    }}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* 歌曲搜索按钮 */}
              <button
                onClick={() => {
                  setShowSongLyricsPage(!showSongLyricsPage);
                  setIsOverflowMenuOpen(false);
                }}
                style={{
                  background: showSongLyricsPage ? "#e74c3c" : "#9b59b6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                title={language === "zh" ? "歌曲搜索和歌词查看" : "Song Search & Lyrics"}
              >
                🎵 {showSongLyricsPage ? (language === "zh" ? "退出歌曲模式" : "Exit Song Mode") : (language === "zh" ? "歌曲搜索" : "Song Search")}
              </button>

              <button
                onClick={() => {
                  setIsApiKeyManagerOpen(true);
                  setIsOverflowMenuOpen(false);
                }}
                style={{
                  background: hasValidApiKey ? "#27ae60" : "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                title={
                  hasValidApiKey
                    ? language === "zh"
                      ? "API 密钥已配置" : "API Key Configured"
                    : language === "zh"
                    ? "配置 API 密钥" : "Configure API Key"
                }
              >
                {hasValidApiKey ? "🔑" : "⚙️"}
                {language === "zh" ? "语言模型" : "Language Model"}
              </button>

              {/* 返回目录按钮 */}
              <button
                onClick={() => {
                  const directoryTopic =
                    language === "zh" ? "目录" : "Directory";
                  handleSearch(directoryTopic);
                  setIsOverflowMenuOpen(false);
                }}
                style={{
                  background: "#1abc9c",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                title={language === "zh" ? "返回目录页面" : "Back to Directory"}
              >
                📑 {language === "zh" ? "返回目录" : "Back to Directory"}
              </button>

              {/* 书籍上传按钮 */}
              <input
                type="file"
                id="book-upload"
                accept=".json,.txt"
                onChange={(e) => {
                  handleFileUpload(e);
                  setTimeout(() => {
                    const directoryTopic =
                      language === "zh" ? "目录" : "Directory";
                    handleSearch(directoryTopic);
                  }, 500);
                  setIsOverflowMenuOpen(false);
                }}
                style={{ display: "none" }}
              />

              {/* 如果没有下拉菜单但正在使用上传的书籍，显示返回默认书籍按钮 */}
              {uploadedBooksMetadata.length === 0 && isUsingUploadedData && (
                <button
                  onClick={() => {
                    switchToDefaultBook();
                    setIsOverflowMenuOpen(false);
                  }}
                  style={{
                    background: "#e67e22",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    width: "100%",
                  }}
                  title={
                    language === "zh" ? "返回默认书籍" : "Back to Default Book"
                  }
                >
                  🔙 {language === "zh" ? "返回默认书籍" : "Back to Default"}
                </button>
              )}

              {/* Android版下载按钮 */}
              <a
                href={
                  // 使用Capacitor API检测是否为原生Android应用
                  (Capacitor.isNativePlatform() && navigator.userAgent.includes('Android'))
                    ? "https://qcgm1978.github.io/revelation"
                    : "https://qcgm1978.github.io/revelation/download.html"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                {(Capacitor.isNativePlatform() && navigator.userAgent.includes('Android'))
                  ? "🌐 " +
                    (language === "zh" ? "打开网页版" : "Open Web Version")
                  : "📱 " +
                    (language === "zh"
                      ? "下载Android版"
                      : "Download Android App")}
              </a>
              <a
                className="external-link"
                href="https://qcgm1978.github.io/revelation/contact.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                👨‍💻 {language === "zh" ? "联系作者" : "Contact Author"}
              </a>
            </div>
          </>
        )}
      </div>

      {/* 上传错误消息 */}
      {uploadErrorMessage && (
        <div
          style={{
            color: "#e74c3c",
            marginTop: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {uploadErrorMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
