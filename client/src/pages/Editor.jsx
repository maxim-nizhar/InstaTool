import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Editor = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // Load post data
  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
        setHistory([data.post])
        setHistoryIndex(0)
      } else {
        console.error('Failed to fetch post')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-save functionality
  const autoSave = useCallback(async (postData) => {
    setIsAutoSaving(true)
    try {
      await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }, [postId])

  // Add to history for undo/redo
  const addToHistory = (newPost) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newPost)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    
    // Auto-save after 1 second delay
    setTimeout(() => autoSave(newPost), 1000)
  }

  // Update post data
  const updatePost = (updates) => {
    const updatedPost = { ...post, ...updates }
    setPost(updatedPost)
    addToHistory(updatedPost)
  }

  // Update specific page content
  const updatePageContent = (pageIndex, content) => {
    const updatedPages = [...post.pages]
    updatedPages[pageIndex] = { ...updatedPages[pageIndex], content }
    updatePost({ pages: updatedPages })
  }

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setPost(history[newIndex])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setPost(history[newIndex])
    }
  }

  // Text formatting functions
  const formatText = (format) => {
    const textarea = document.getElementById(`page-content-${currentPage}`)
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    
    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `<u>${selectedText}</u>`
        break
      default:
        formattedText = selectedText
    }
    
    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end)
    
    updatePageContent(currentPage, newContent)
  }

  const getThemeStyles = (theme) => {
    const themes = {
      gold: { background: 'linear-gradient(135deg, #FFD700, #FFA500)', textColor: 'text-white' },
      blue: { background: 'linear-gradient(135deg, #4A90E2, #7B68EE)', textColor: 'text-white' },
      geometric: { background: 'linear-gradient(135deg, #667eea, #764ba2)', textColor: 'text-white' },
      calligraphy: { background: 'linear-gradient(135deg, #2E7D32, #4CAF50)', textColor: 'text-white' },
      modern: { background: 'linear-gradient(135deg, #263238, #37474F)', textColor: 'text-white' }
    }
    return themes[theme] || themes.modern
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">Post not found</p>
          <button 
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const themeStyles = getThemeStyles(post.theme)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Canva-like Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Navigation */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/projects')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold truncate max-w-64">{post.post_title}</h1>
            </div>

            {/* Center: Tools */}
            <div className="flex items-center space-x-2">
              {/* Undo/Redo */}
              <button 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                ↶
              </button>
              <button 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                ↷
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              {/* Text Formatting */}
              <button 
                onClick={() => formatText('bold')}
                className="p-2 text-gray-600 hover:text-gray-900 font-bold"
                title="Bold"
              >
                B
              </button>
              <button 
                onClick={() => formatText('italic')}
                className="p-2 text-gray-600 hover:text-gray-900 italic"
                title="Italic"
              >
                I
              </button>
              <button 
                onClick={() => formatText('underline')}
                className="p-2 text-gray-600 hover:text-gray-900 underline"
                title="Underline"
              >
                U
              </button>

              <div className="h-6 w-px bg-gray-300"></div>

              {/* Theme Selector */}
              <select 
                value={post.theme}
                onChange={(e) => updatePost({ theme: e.target.value })}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="gold">Gold</option>
                <option value="blue">Blue</option>
                <option value="geometric">Geometric</option>
                <option value="calligraphy">Calligraphy</option>
                <option value="modern">Modern</option>
              </select>
            </div>

            {/* Right: Status */}
            <div className="flex items-center space-x-4">
              {isAutoSaving && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}
              <span className="text-sm text-green-600">✓ Auto-saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={post.post_title}
                  onChange={(e) => updatePost({ post_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Page Navigation */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pages ({post.pages.length})
                  </label>
                  <div className="flex space-x-1">
                    {post.pages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                          index === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Page Content Editor */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page {currentPage + 1} Content
                </label>
                <textarea
                  id={`page-content-${currentPage}`}
                  value={post.pages[currentPage]?.content || ''}
                  onChange={(e) => updatePageContent(currentPage, e.target.value)}
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter your content here..."
                />
              </div>

              {/* Post Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Date
                  </label>
                  <input
                    type="datetime-local"
                    value={post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : ''}
                    onChange={(e) => updatePost({ scheduled_for: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font
                  </label>
                  <select 
                    value={post.font}
                    onChange={(e) => updatePost({ font: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Default</option>
                    <option value="arabic">Arabic</option>
                    <option value="modern">Modern</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Instagram Preview</h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Instagram Header */}
                <div className="flex items-center space-x-3 p-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-sm">islamic_quotes_daily</p>
                    <p className="text-xs text-gray-500">Original Audio</p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="relative">
                  <div 
                    className="w-full h-80 flex items-center justify-center p-6 text-center relative"
                    style={{ background: themeStyles.background }}
                  >
                    <div className={`${themeStyles.textColor} max-w-full`}>
                      <h3 className="text-lg font-bold mb-4">{post.post_title}</h3>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {post.pages[currentPage]?.content || 'No content'}
                      </div>
                    </div>
                    
                    {/* Page indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {post.pages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentPage ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Navigation arrows */}
                  {post.pages.length > 1 && (
                    <>
                      {currentPage > 0 && (
                        <button
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 rounded-full text-white flex items-center justify-center hover:bg-opacity-70"
                        >
                          ←
                        </button>
                      )}
                      {currentPage < post.pages.length - 1 && (
                        <button
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 rounded-full text-white flex items-center justify-center hover:bg-opacity-70"
                        >
                          →
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Instagram Actions */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-4">
                      <span className="text-lg">♥️</span>
                      <span className="text-lg">💬</span>
                      <span className="text-lg">📤</span>
                    </div>
                    <span className="text-lg">🔖</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold mb-1">1,234 likes</p>
                    <p className="text-gray-600">
                      <span className="font-semibold">islamic_quotes_daily</span> {post.post_title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor