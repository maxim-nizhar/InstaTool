import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to InstaTool
        </h1>
        <p className="text-gray-600">
          Create beautiful Islamic-themed Instagram carousel posts from CSV files
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/upload"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <span className="text-2xl">📤</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV</h3>
          <p className="text-gray-600 text-sm">
            Upload a CSV file to generate multiple Instagram carousel posts with Islamic themes
          </p>
        </Link>

        <Link
          to="/projects"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Projects</h3>
          <p className="text-gray-600 text-sm">
            Browse posts organized by scheduled dates and manage your content
          </p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 opacity-75">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Islamic Themes</h3>
          <p className="text-gray-600 text-sm">
            5 beautiful themes: Gold/Green, Blue/White, Geometric, Calligraphy, Modern
          </p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">
              Upload your first CSV file to start creating Instagram posts
            </p>
            <Link
              to="/upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard