import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
                  {project.posts.slice(0, 5).map((post) => (
                    <div key={post._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                    </div>
                  ))}
                  {project.posts.length > 5 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      + {project.posts.length - 5} more posts
                    </p>
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
    </div>
  )
}

export default Projects