import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Editor from "./pages/Editor";
import Projects from "./pages/Projects";
import ScheduledPosts from "./pages/ScheduledPosts";
import TailwindTest from "./pages/TailwindTest";
import SimpleTest from "./pages/SimpleTest";

// Create editing context
const EditingContext = createContext();

export const useEditing = () => useContext(EditingContext);

function App() {
  const [isEditingMode, setIsEditingMode] = useState(false);

  return (
    <EditingContext.Provider value={{ isEditingMode, setIsEditingMode }}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar isEditingMode={isEditingMode} />
          <main
            className={`${isEditingMode ? "" : "container mx-auto px-4 py-8"}`}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/editor/:postId" element={<Editor />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/scheduled" element={<ScheduledPosts />} />
              <Route path="/test" element={<TailwindTest />} />
              <Route path="/simple" element={<SimpleTest />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EditingContext.Provider>
  );
}

export default App;
