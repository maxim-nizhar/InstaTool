import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Editor from './pages/Editor'
import Projects from './pages/Projects'
import TailwindTest from './pages/TailwindTest'
import SimpleTest from './pages/SimpleTest'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/editor/:postId" element={<Editor />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/test" element={<TailwindTest />} />
            <Route path="/simple" element={<SimpleTest />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App