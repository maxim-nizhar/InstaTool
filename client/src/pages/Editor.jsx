import React from 'react'
import { useParams } from 'react-router-dom'

const Editor = () => {
  const { postId } = useParams()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Editor</h1>
        <p className="text-gray-600">
          Edit your Instagram carousel post with live preview
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Editor Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            The post editor with live preview will be implemented in the next phase
          </p>
          <div className="text-sm text-blue-600">
            Post ID: {postId}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor