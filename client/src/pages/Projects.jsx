import React from 'react'

const Projects = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">
          Browse posts organized by scheduled dates
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📅</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-4">
            Upload a CSV file to create your first project with scheduled posts
          </p>
        </div>
      </div>
    </div>
  )
}

export default Projects