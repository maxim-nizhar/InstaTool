import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showAllPosts, setShowAllPosts] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/posts/projects')
      const data = await response.json()
      
      if (response.ok) {
        setProjects(data.projects)
      } else {
        setError(data.error || 'Failed to fetch projects')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getThemeColor = (theme) => {
    const colors = {
      gold: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      geometric: 'bg-purple-100 text-purple-800',
      calligraphy: 'bg-green-100 text-green-800',
      modern: 'bg-gray-100 text-gray-800'
    }
    return colors[theme] || 'bg-gray-100 text-gray-800'
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
  }

  const handleEditPost = (post) => {
    navigate(`/editor/${post._id}`)
  }

  const toggleShowAllPosts = (projectId) => {
    setShowAllPosts(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Browse your CSV projects and posts</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Browse your CSV projects and posts</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchProjects}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">
          Browse your CSV projects and posts ({projects.length} projects)
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-600 mb-4">
              Upload a CSV file to create your first project with scheduled posts
            </p>
            <Link 
              to="/upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload CSV File
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Project Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      📁 {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {project.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 Created: {formatDate(project.created_at)}</span>
                      <span>📊 {project.total_posts} posts</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Posts Preview */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Posts:</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {project.posts.slice(0, showAllPosts[project._id] ? project.posts.length : 5).map((post) => (
                    <div 
                      key={post._id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.post_title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded ${getThemeColor(post.theme)}`}>
                            {post.theme}
                          </span>
                          <span className="text-xs text-gray-500">
                            📅 {formatDate(post.scheduled_for)}
                          </span>
                          <span className="text-xs text-gray-500">
                            📄 {post.pages.length} pages
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditPost(post)
                          }}
                        >
                          Edit
                        </button>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  ))}
                  {project.posts.length > 5 && !showAllPosts[project._id] && (
                    <button 
                      className="w-full text-sm text-blue-600 text-center py-2 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      onClick={() => toggleShowAllPosts(project._id)}
                    >
                      + {project.posts.length - 5} more posts
                    </button>
                  )}
                  {showAllPosts[project._id] && project.posts.length > 5 && (
                    <button 
                      className="w-full text-sm text-gray-500 text-center py-2 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                      onClick={() => toggleShowAllPosts(project._id)}
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>

              {/* Project Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    CSV: {project.csv_filename}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View All Posts
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instagram Post Preview Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            <PostPreview post={selectedPost} onClose={() => setSelectedPost(null)} />
          </div>
        </div>
      )}
    </div>
  )
}

// Instagram Post Preview Component
const PostPreview = ({ post, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0)

  const getThemeStyles = (theme) => {
    const themes = {
      gold: {
        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
        textColor: 'text-white',
        accentColor: '#8B4513'
      },
      blue: {
        background: 'linear-gradient(135deg, #4A90E2, #7B68EE)',
        textColor: 'text-white',
        accentColor: '#2E5266'
      },
      geometric: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        textColor: 'text-white',
        accentColor: '#4A148C'
      },
      calligraphy: {
        background: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
        textColor: 'text-white',
        accentColor: '#1B5E20'
      },
      modern: {
        background: 'linear-gradient(135deg, #263238, #37474F)',
        textColor: 'text-white',
        accentColor: '#455A64'
      }
    }
    return themes[theme] || themes.modern
  }

  const themeStyles = getThemeStyles(post.theme)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          <div>
            <p className="font-semibold text-sm">islamic_quotes_daily</p>
            <p className="text-xs text-gray-500">Original Audio</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Post Content */}
      <div className="flex-1 relative">
        <div 
          className="w-full h-96 flex items-center justify-center p-6 text-center relative"
          style={{ background: themeStyles.background }}
        >
          <div className={`${themeStyles.textColor} max-w-full`}>
            <h3 className="text-lg font-bold mb-4">{post.post_title}</h3>
            <div className="text-sm leading-relaxed">
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

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-4">
            <span className="text-xl">♥️</span>
            <span className="text-xl">💬</span>
            <span className="text-xl">📤</span>
          </div>
          <span className="text-xl">🔖</span>
        </div>
        <div className="text-sm">
          <p className="font-semibold mb-1">1,234 likes</p>
          <p className="text-gray-600">
            <span className="font-semibold">islamic_quotes_daily</span> {post.post_title}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Scheduled for {new Date(post.scheduled_for).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={() => {
              onClose()
              // Navigate to editor
              window.location.href = `/editor/${post._id}`
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Edit Post
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default Projects