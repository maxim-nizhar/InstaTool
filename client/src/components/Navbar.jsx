import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Upload CSV', href: '/upload', icon: '📤' },
    { name: 'Projects', href: '/projects', icon: '📁' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-islamic-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IT</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">InstaTool</h1>
          </Link>

          {/* Navigation */}
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Islamic Post Creator
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar