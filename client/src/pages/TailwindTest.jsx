import React from 'react'

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          🧪 Tailwind CSS Test Page
        </h1>
        
        {/* Basic Colors Test */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-500 text-white p-4 rounded-lg text-center">Red</div>
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center">Blue</div>
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">Green</div>
          <div className="bg-yellow-500 text-black p-4 rounded-lg text-center">Yellow</div>
        </div>

        {/* Islamic Theme Colors Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Islamic Theme Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-islamic-gold text-white p-4 rounded-lg text-center">
              Islamic Gold
            </div>
            <div className="bg-islamic-green text-white p-4 rounded-lg text-center">
              Islamic Green
            </div>
            <div className="bg-islamic-blue text-white p-4 rounded-lg text-center">
              Islamic Blue
            </div>
            <div className="bg-islamic-cream text-gray-800 p-4 rounded-lg text-center border">
              Islamic Cream
            </div>
          </div>
        </div>

        {/* Responsive Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Responsive Grid Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-purple-100 p-4 rounded">Column 1</div>
            <div className="bg-purple-200 p-4 rounded">Column 2</div>
            <div className="bg-purple-300 p-4 rounded">Column 3</div>
          </div>
        </div>

        {/* Interactive Elements Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Interactive Elements</h2>
          <div className="space-y-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Hover Button
            </button>
            <div className="flex space-x-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            ✅ Tailwind CSS is working correctly!
          </div>
        </div>
      </div>
    </div>
  )
}

export default TailwindTest