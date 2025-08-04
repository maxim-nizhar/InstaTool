import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isEditingMode = false }) => {
  const location = useLocation();
  const isEditor = location.pathname.includes("/editor/") || isEditingMode;

  const navigation = [
    { name: "Home", href: "/", icon: "🏠", description: "Dashboard overview" },
    {
      name: "Upload",
      href: "/upload",
      icon: "⬆️",
      description: "Upload CSV files",
    },
    {
      name: "Projects",
      href: "/projects",
      icon: "📁",
      description: "Manage projects",
    },
    {
      name: "Scheduled",
      href: "/scheduled",
      icon: "📅",
      description: "Scheduled posts",
    },
    {
      name: "Image Test",
      href: "/image-test",
      icon: "🎨",
      description: "Test image generation",
    },
  ];

  const designTools = [
    {
      name: "Templates",
      icon: "🎨",
      action: () => {},
      description: "Browse templates",
    },
    {
      name: "Themes",
      icon: "🌈",
      action: () => {},
      description: "Islamic themes",
    },
    { name: "Fonts", icon: "📝", action: () => {}, description: "Typography" },
    {
      name: "Export",
      icon: "💾",
      action: () => {},
      description: "Export posts",
    },
  ];

  return (
    <nav
      className={`bg-white shadow-lg border-b border-gray-200 relative z-50 transition-all duration-300 ${
        isEditor ? "h-12" : "h-16"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`flex justify-between items-center ${
            isEditor ? "h-12" : "h-16"
          }`}
        >
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className={`${
                isEditor ? "w-8 h-8" : "w-10 h-10"
              } bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}
            >
              <span
                className={`text-white font-bold ${
                  isEditor ? "text-sm" : "text-lg"
                }`}
              >
                IT
              </span>
            </div>
            {!isEditor && (
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  InstaTool
                </h1>
                <p className="text-xs text-gray-500">Islamic Post Creator</p>
              </div>
            )}
            {isEditor && (
              <span className="text-sm font-medium text-gray-900">
                Post Editor
              </span>
            )}
          </Link>

          {/* Main Navigation */}
          {!isEditor && (
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    title={item.description}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="hidden md:block">{item.name}</span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Editor Navigation (minimal) */}
          {isEditor && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Currently editing</span>
            </div>
          )}

          {/* Design Tools (Canva-like) */}
          <div className="flex items-center space-x-1">
            {!isEditor && (
              <div className="hidden lg:flex items-center space-x-1 mr-4">
                {designTools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={tool.action}
                    className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                    title={tool.description}
                  >
                    <span>{tool.icon}</span>
                    <span className="hidden xl:block">{tool.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {!isEditor && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Creator Mode
                  </p>
                  <p className="text-xs text-gray-500">Ready to design</p>
                </div>
              )}

              <div
                className={`${
                  isEditor ? "w-8 h-8" : "w-10 h-10"
                } bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer`}
              >
                <span className={isEditor ? "text-xs" : "text-sm"}>U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar (for editor/upload) */}
      {(location.pathname === "/upload" || isEditor) && (
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: isEditor ? "75%" : "50%" }}
          ></div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
