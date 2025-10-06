// @ts-ignore
import React, { useEffect } from 'react'
import ContentGenerator from './ContentGenerator'
import Directory from './Directory'
import { chapterPage } from 'gem-timeline-data'

interface DocumentRendererProps {
  currentTopic: string
  currentTopicWithPage: string
  language: string
  hasValidApiKey: boolean
  history: string[]
  contentCache: Record<string, any>
  onCacheClear: () => void
  isUsingUploadedData: boolean
  uploadedBookName: string | null
  onTopicChange: (topic: string, page?: Array<string>, context?: string) => void
  onRequestApiKey: () => void
  directoryData?: Record<string, any>
  getCurrentDirectoryData?: () => Record<string, any> | undefined
  onWordClick: (word: string, page?: string) => void
  currentBookTitle: string | null
  onLanguageChange: (language: 'zh' | 'en') => void
}

interface ChapterPageData {
  prologue?: {
    title: string
    content?: string
    page: number
    id: string
  }
  [key: string]:
    | {
        title?: string
        englishTitle?: string
        chapters?: Array<{
          title: string
          page: number
          id: string
        }>
      }
    | undefined
}

const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  currentTopic,
  currentTopicWithPage,
  language,
  hasValidApiKey,
  contentCache,
  onCacheClear,
  onTopicChange,
  onRequestApiKey,
  directoryData,
  getCurrentDirectoryData,
  onWordClick,
  currentBookTitle,
  onLanguageChange
}) => {
  const extractPageNumber = (
    topic: string
  ): { num: number | null; type: string | null } => {
    const match = topic.match(/(\d+)(页|章)|序/)
    const is_prologue = topic.match(/序/)
    return {
      num: is_prologue ? 0 : match ? parseInt(match[1], 10) : null,
      type: is_prologue ? '序' : match ? match[2] : null
    }
  }

  const findChapterByIdByPageNumber = (num_unit: {
    num: number | null
    type: string | null
  }): string | null => {
    const chapterData = chapterPage as ChapterPageData
    let foundChapter: { id: string } | null = null
    if (num_unit.type === '章') {
      const numberToChinese = (num: number | null): string | null => {
        if (num === null) return null
        const chineseNumber = [
          '零',
          '一',
          '二',
          '三',
          '四',
          '五',
          '六',
          '七',
          '八',
          '九'
        ]
        const unit = ['', '十', '百', '千', '万']
        let result = ''
        const numStr = num.toString()
        for (let i = 0; i < numStr.length; i++) {
          const digit = parseInt(numStr[i], 10)
          const index = numStr.length - i - 1
          if (digit !== 0) {
            result += chineseNumber[digit] + unit[index % 4]
            if (index >= 4 && index % 4 === 0) {
              result += unit[4]
            }
          } else {
            if (result.slice(-1) !== '零') {
              result += '零'
            }
          }
        }

        result = result.replace(/零+$/, '')

        result = result.replace(/零+/g, '零')

        result = result.replace(/^一十/, '十')
        return result
      }
      const chapter = numberToChinese(num_unit.num)
      if (chapter) {
        const chapters = Object.keys(chapterData)
          .map(d => chapterData[d].chapters)
          .flat()
          .filter(d => d)
          .reduce((d, t) => ({ ...d, [t.title.split(' ')[0]]: t.id }), {})
        return chapters[`第${chapter}章`]
      }
    }

    if (chapterData.prologue) {
      const prologuePage = 0
      let nextChapterPage = Infinity

      for (const bookKey in chapterData) {
        const book = chapterData[bookKey]
        if (book?.chapters && book.chapters.length > 0) {
          nextChapterPage = book.chapters[0].page
          break
        }
      }

      if (num_unit.num >= prologuePage && num_unit.num < nextChapterPage) {
        foundChapter = { id: chapterData.prologue.id }
      }
    }

    if (!foundChapter) {
      let allChapters: Array<{ page: number; id: string; nextPage?: number }> =
        []

      for (const bookKey in chapterData) {
        const book = chapterData[bookKey]
        if (book?.chapters) {
          allChapters = allChapters.concat(book.chapters)
        }
      }

      allChapters.sort((a, b) => a.page - b.page)

      for (let i = 0; i < allChapters.length; i++) {
        const current = allChapters[i]
        const next = allChapters[i + 1]

        if (
          num_unit.num >= current.page &&
          (!next || num_unit.num < next.page)
        ) {
          foundChapter = current
          break
        }
      }
    }

    return foundChapter?.id || null
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    const num_unit = extractPageNumber(currentTopicWithPage)
    const pageNumber = num_unit.num
    if (!isNaN(pageNumber)) {
      const chapterId = findChapterByIdByPageNumber(num_unit)
      if (chapterId) {
        window.open(`https://fanqienovel.com/reader/${chapterId}`, '_blank')
      }
    }
  }

  const hasPageNumber = (topic: string): boolean => {
    return topic && extractPageNumber(topic).num !== null
  }
  const handleClearCacheAndRefresh = () => {
    onCacheClear()
    onTopicChange(currentTopic)
  }

  ;<ContentGenerator
    currentTopic={currentTopic}
    language={language as 'zh' | 'en'}
    hasValidApiKey={hasValidApiKey}
    onWordClick={onWordClick}
    directoryData={
      getCurrentDirectoryData ? getCurrentDirectoryData() : directoryData
    }
  />

  const handleDirectoryItemClick = (
    topic: string,
    page?: Array<string>,
    category?: string
  ) => {
    onTopicChange(topic, page instanceof Array ? page : [page], category)
    if (!hasValidApiKey && currentTopic === '目录') {
      onRequestApiKey()
    } else {
      if (category) {
        sessionStorage.setItem(`category_for_${topic}`, category)
      }
    }
  }

  useEffect(() => {
    const handleRestoreState = (event: Event) => {
      if (event.type === 'restoreDirectoryState') {
        const { detail } = event as CustomEvent<{
          categoryMode: 'subject' | 'page'
          pageFilter: string
          selectedSubject: string
        }>

        document.dispatchEvent(
          new CustomEvent('directoryStateUpdated', {
            detail
          })
        )
      }
    }

    document.addEventListener('restoreDirectoryState', handleRestoreState)
    return () => {
      document.removeEventListener('restoreDirectoryState', handleRestoreState)
    }
  }, [])

  return (
    <div className='app-container'>
      <div className='main-content'>
        <div className='current-topic-container'>
          {currentTopic !== '目录' && currentTopic !== 'Directory' && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}
              />
              {hasPageNumber(currentTopicWithPage) ? (
                <h2
                  onClick={handleTitleClick}
                  style={{
                    cursor: 'pointer',
                    color: '#1a0dab',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '90%'
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      currentTopicWithPage +
                      ' <a style="text-decoration:none;">🔗</a>'
                  }}
                />
              ) : (
                <h2
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '90%'
                  }}
                  dangerouslySetInnerHTML={{ __html: currentTopicWithPage }}
                />
              )}
            </>
          )}
          <div className='topic-actions'>
            {currentTopicWithPage && contentCache[currentTopicWithPage] && (
              <button
                onClick={handleClearCacheAndRefresh}
                className='clear-cache-button'
              >
                🗑️ 清除缓存并刷新
              </button>
            )}
          </div>
        </div>

        {(currentTopic === '目录' || currentTopic === 'Directory') && (
          <Directory
            directoryData={
              getCurrentDirectoryData
                ? getCurrentDirectoryData()
                : directoryData || {}
            }
            language={language as 'zh' | 'en'}
            currentTopic={currentTopic}
            onItemClick={handleDirectoryItemClick}
            currentBookTitle={currentBookTitle}
          />
        )}

        <div className='content-area'>
          <ContentGenerator
            currentTopic={currentTopic}
            language={language as 'zh' | 'en'}
            hasValidApiKey={hasValidApiKey}
            onWordClick={onWordClick}
            directoryData={
              getCurrentDirectoryData
                ? getCurrentDirectoryData()
                : directoryData || {}
            }
            onSearch={onTopicChange}
            onRandom={onRequestApiKey}
          />
        </div>
      </div>
    </div>
  )
}

export default DocumentRenderer
