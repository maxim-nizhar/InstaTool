import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEditing } from "../App";
import ScheduleModal from "../components/ScheduleModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState({});
  const navigate = useNavigate();
  const { setIsEditingMode } = useEditing();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/posts/projects");
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects);
      } else {
        setError(data.error || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getThemeColor = (theme) => {
    const colors = {
      gold: "bg-yellow-100 text-yellow-800",
      blue: "bg-blue-100 text-blue-800",
      geometric: "bg-purple-100 text-purple-800",
      calligraphy: "bg-green-100 text-green-800",
      modern: "bg-gray-100 text-gray-800",
    };
    return colors[theme] || "bg-gray-100 text-gray-800";
  };

  const getThemeGradient = (theme) => {
    const gradients = {
      gold: "linear-gradient(135deg, #FFD700, #FFA500)",
      blue: "linear-gradient(135deg, #4A90E2, #7B68EE)",
      geometric: "linear-gradient(135deg, #667eea, #764ba2)",
      calligraphy: "linear-gradient(135deg, #2E7D32, #4CAF50)",
      modern: "linear-gradient(135deg, #263238, #37474F)",
    };
    return gradients[theme] || gradients.modern;
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "published":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadgeText = (status) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "scheduled":
        return "Scheduled";
      case "published":
        return "Published";
      case "failed":
        return "Failed";
      default:
        return "Draft";
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsEditingMode(true);
  };

  const handleCloseEditor = () => {
    setSelectedPost(null);
    setIsEditingMode(false);
  };

  const handleEditPost = (post) => {
    navigate(`/editor/${post._id}`);
  };

  const toggleShowAllPosts = (projectId) => {
    setShowAllPosts((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

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
    );
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
    );
  }

  return (
    <div
      className="flex"
      style={{
        height: selectedPost ? "calc(100vh - 3rem)" : "calc(100vh - 4rem)",
      }}
    >
      {" "}
      {/* Adaptive height */}
      {/* Left Panel - Projects List */}
      <div
        className={`transition-all duration-300 ${
          selectedPost ? "w-1/3" : "w-full"
        } overflow-y-auto border-r border-gray-200`}
      >
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">
              {projects.length} projects • Click any post to edit
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Projects Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload a CSV file to create your first project
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
            <div className="space-y-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Project Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          📁 {project.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {formatDate(project.created_at)}</span>
                          <span>📊 {project.total_posts} posts</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Posts Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {project.posts
                        .slice(
                          0,
                          showAllPosts[project._id] ? project.posts.length : 6
                        )
                        .map((post) => (
                          <div
                            key={post._id}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              selectedPost?._id === post._id
                                ? "border-blue-500 shadow-lg"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handlePostClick(post)}
                          >
                            {/* Mini Preview */}
                            <div
                              className="h-24 flex items-center justify-center text-center p-2 text-white text-xs"
                              style={{
                                background: getThemeGradient(post.theme),
                              }}
                            >
                              <div className="line-clamp-3">
                                {post.post_title}
                              </div>
                            </div>

                            {/* Post Info */}
                            <div className="p-2 bg-white">
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className={`px-1 py-0.5 text-xs rounded ${getThemeColor(
                                    post.theme
                                  )}`}
                                >
                                  {post.theme}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {post.pages.length}p
                                </span>
                              </div>
                              {/* Status Badge */}
                              <div className="flex items-center justify-between">
                                <span
                                  className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${getStatusBadgeColor(
                                    post.status
                                  )}`}
                                >
                                  {getStatusBadgeText(post.status)}
                                </span>
                              </div>
                            </div>

                            {/* Selected Indicator */}
                            {selectedPost?._id === post._id && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>

                    {project.posts.length > 6 && (
                      <button
                        className="w-full mt-3 text-sm text-blue-600 py-2 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        onClick={() => toggleShowAllPosts(project._id)}
                      >
                        {showAllPosts[project._id]
                          ? "Show less"
                          : `+ ${project.posts.length - 6} more posts`}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Right Panel - Post Editor */}
      {selectedPost && (
        <div className="w-2/3 flex flex-col">
          <InlinePostEditor post={selectedPost} onClose={handleCloseEditor} />
        </div>
      )}
    </div>
  );
};

// Sleek Direct Post Editor Component
const InlinePostEditor = ({ post, onClose }) => {
  const [editablePost, setEditablePost] = useState(post);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Canva Sans");
  const [textAlign, setTextAlign] = useState("center");
  const [history, setHistory] = useState([post]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  // Update editor when post prop changes (for post switching)
  useEffect(() => {
    setEditablePost(post);
    setCurrentPage(0); // Reset to first page
    setHistory([post]); // Reset history
    setHistoryIndex(0);
    setFontSize(16); // Reset font size
    setFontFamily("Canva Sans"); // Reset font
    setTextAlign("center"); // Reset alignment
  }, [post._id]); // Only trigger when the post ID changes

  // Auto-save functionality
  const autoSave = async (postData) => {
    setIsAutoSaving(true);
    try {
      await fetch(`/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const updatePost = (updates) => {
    const updatedPost = { ...editablePost, ...updates };
    setEditablePost(updatedPost);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedPost);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Auto-save
    setTimeout(() => autoSave(updatedPost), 1000);
  };

  const updatePageContent = (pageIndex, content) => {
    const updatedPages = [...editablePost.pages];
    updatedPages[pageIndex] = { ...updatedPages[pageIndex], content };
    updatePost({ pages: updatedPages });
  };

  const formatText = (format, savedSelection = null) => {
    const editableDiv = document.getElementById(
      `editable-content-${currentPage}`
    );
    if (!editableDiv) return;

    // Focus the element first
    editableDiv.focus();

    // If we have a saved selection, restore it
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }

    // Use browser's built-in execCommand for reliable formatting
    let command;
    switch (format) {
      case "bold":
        command = "bold";
        break;
      case "italic":
        command = "italic";
        break;
      case "underline":
        command = "underline";
        break;
      default:
        return;
    }

    // Execute the command
    const success = document.execCommand(command, false, null);
    console.log(`execCommand(${command}) result:`, success);

    // Update the content in state after a brief delay
    setTimeout(() => {
      if (editableDiv) {
        updatePageContent(currentPage, editableDiv.innerHTML);
      }
    }, 50);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEditablePost(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEditablePost(history[newIndex]);
    }
  };

  const handleDirectEdit = (e) => {
    const content = e.target.innerHTML;
    updatePageContent(currentPage, content);
  };

  const handlePublishNow = async () => {
    setIsScheduling(true);
    try {
      console.log(`🚀 Publishing post "${editablePost.post_title}" immediately`);
      
      // Call the new publish endpoint
      const response = await fetch(`/api/posts/${editablePost._id}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption: `${editablePost.post_title}\n\n${editablePost.pages[0]?.content || ''}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update the post status in local state
        updatePost({
          status: "published",
          published_at: new Date(),
          generatedImageUrls: result.imageUrls || editablePost.generatedImageUrls,
          instagramCarouselId: result.instagramPostId || "",
        });

        // Refresh projects to show updated status badges
        await fetchProjects();

        // Show success message
        if (result.instagramConfigured) {
          alert(`🎉 Post published to Instagram successfully!\n\nInstagram URL: ${result.instagramUrl || 'Check your Instagram account'}`);
        } else {
          alert(`✅ Post published successfully!\n\nNote: Instagram API is not configured, so the post was marked as published but not uploaded to Instagram.`);
        }
      } else {
        console.error("Publish failed:", result);
        alert(
          "❌ Failed to publish post: " +
            (result.error || result.details || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("❌ Failed to publish post: " + error.message);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sleek Top Toolbar */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[800px]">
          {/* Left: Font & Format Controls */}
          <div className="flex items-center space-x-2">
            <select
              className="px-2 py-1 border border-gray-300 rounded text-sm bg-white min-w-[100px]"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Canva Sans">Canva Sans</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>

            <div className="flex items-center border border-gray-300 rounded bg-white">
              <button
                onClick={() => setFontSize(Math.max(8, fontSize - 2))}
                className="px-2 py-1 hover:bg-gray-100 text-sm"
              >
                -
              </button>
              <span className="px-3 py-1 text-sm min-w-[40px] text-center">
                {fontSize}
              </span>
              <button
                onClick={() => setFontSize(Math.min(72, fontSize + 2))}
                className="px-2 py-1 hover:bg-gray-100 text-sm"
              >
                +
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button className="w-7 h-7 rounded bg-red-500 border border-gray-300"></button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent focus loss
                  // Save current selection at the moment of button press
                  const selection = window.getSelection();
                  const savedRange =
                    selection.rangeCount > 0
                      ? selection.getRangeAt(0).cloneRange()
                      : null;
                  // Apply formatting with the saved selection
                  setTimeout(() => formatText("bold", savedRange), 10);
                }}
                className="w-8 h-8 font-bold text-sm hover:bg-gray-200 rounded flex items-center justify-center"
                title="Bold"
              >
                B
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent focus loss
                  // Save current selection at the moment of button press
                  const selection = window.getSelection();
                  const savedRange =
                    selection.rangeCount > 0
                      ? selection.getRangeAt(0).cloneRange()
                      : null;
                  // Apply formatting with the saved selection
                  setTimeout(() => formatText("italic", savedRange), 10);
                }}
                className="w-8 h-8 italic text-sm hover:bg-gray-200 rounded flex items-center justify-center"
                title="Italic"
              >
                I
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center space-x-1 border-l border-gray-300 pl-2">
              <button
                onClick={() => setTextAlign("left")}
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  textAlign === "left" ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                title="Align Left"
              >
                ⫷
              </button>
              <button
                onClick={() => setTextAlign("center")}
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  textAlign === "center" ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                title="Align Center"
              >
                ⫸
              </button>
              <button
                onClick={() => setTextAlign("right")}
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  textAlign === "right" ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                title="Align Right"
              >
                ⫷
              </button>
            </div>

            {/* Theme Selector */}
            <select
              value={editablePost.theme}
              onChange={(e) => updatePost({ theme: e.target.value })}
              className="px-2 py-1 border border-gray-300 rounded text-sm bg-white min-w-[90px]"
            >
              <option value="gold">Gold</option>
              <option value="blue">Blue</option>
              <option value="geometric">Geometric</option>
              <option value="calligraphy">Calligraphy</option>
              <option value="modern">Modern</option>
            </select>
          </div>

          {/* Center: Page Navigation */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Page:</span>
            <div className="flex space-x-1">
              {editablePost.pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    index === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50 rounded hover:bg-gray-100"
              title="Undo"
            >
              ↶
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50 rounded hover:bg-gray-100"
              title="Redo"
            >
              ↷
            </button>

            {isAutoSaving && (
              <span className="text-xs text-gray-500">Saving...</span>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Direct Editable Instagram Preview */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-md">
          {/* Instagram Header */}
          <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-sm">islamic_quotes_daily</p>
              <p className="text-xs text-gray-500">Original Audio</p>
            </div>
          </div>

          {/* Editable Post Content */}
          <div className="relative">
            <div
              className="w-full h-96 flex items-center justify-center p-6 text-center relative cursor-text"
              style={{
                background: `linear-gradient(135deg, ${
                  editablePost.theme === "gold"
                    ? "#FFD700, #FFA500"
                    : editablePost.theme === "blue"
                    ? "#4A90E2, #7B68EE"
                    : editablePost.theme === "geometric"
                    ? "#667eea, #764ba2"
                    : editablePost.theme === "calligraphy"
                    ? "#2E7D32, #4CAF50"
                    : "#263238, #37474F"
                })`,
              }}
            >
              <div className="text-white max-w-full w-full">
                {/* Editable Title */}
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="text-lg font-bold mb-4 outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded px-2 py-1"
                  style={{
                    fontSize: `${Math.max(16, fontSize)}px`,
                    fontFamily:
                      fontFamily === "Canva Sans"
                        ? "system-ui, -apple-system, sans-serif"
                        : fontFamily,
                    textAlign,
                    minHeight: "1.5em",
                  }}
                  onBlur={(e) =>
                    updatePost({ post_title: e.target.textContent })
                  }
                  dangerouslySetInnerHTML={{ __html: editablePost.post_title }}
                />

                {/* Editable Content */}
                <div
                  id={`editable-content-${currentPage}`}
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="text-sm leading-relaxed outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded px-2 py-1"
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily:
                      fontFamily === "Canva Sans"
                        ? "system-ui, -apple-system, sans-serif"
                        : fontFamily,
                    textAlign,
                    minHeight: "4em",
                  }}
                  onInput={handleDirectEdit}
                  onBlur={handleDirectEdit}
                  dangerouslySetInnerHTML={{
                    __html:
                      editablePost.pages[currentPage]?.content ||
                      "Click to edit content...",
                  }}
                />
              </div>

              {/* Page indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {editablePost.pages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                      index === currentPage
                        ? "bg-white scale-150 shadow-lg"
                        : "bg-white bg-opacity-50 hover:bg-opacity-70"
                    }`}
                    onClick={() => setCurrentPage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            {editablePost.pages.length > 1 && (
              <>
                {currentPage > 0 && (
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 rounded-full text-white flex items-center justify-center hover:bg-opacity-70 transition-opacity"
                  >
                    ←
                  </button>
                )}
                {currentPage < editablePost.pages.length - 1 && (
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 rounded-full text-white flex items-center justify-center hover:bg-opacity-70 transition-opacity"
                  >
                    →
                  </button>
                )}
              </>
            )}
          </div>

          {/* Instagram Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex space-x-4">
                <span className="text-lg cursor-pointer hover:scale-110 transition-transform">
                  ♥️
                </span>
                <span className="text-lg cursor-pointer hover:scale-110 transition-transform">
                  💬
                </span>
                <span className="text-lg cursor-pointer hover:scale-110 transition-transform">
                  📤
                </span>
              </div>
              <span className="text-lg cursor-pointer hover:scale-110 transition-transform">
                🔖
              </span>
            </div>
            <div className="text-sm">
              <p className="font-semibold mb-1">1,234 likes</p>
              <p className="text-gray-600">
                <span className="font-semibold">islamic_quotes_daily</span>{" "}
                {editablePost.post_title}
              </p>
            </div>

            {/* Scheduling Controls - Moved to bottom */}
            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={handlePublishNow}
                disabled={isScheduling}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title="Publish Now"
              >
                {isScheduling ? "Publishing..." : "Publish Now"}
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                disabled={isScheduling}
                className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title="Schedule Post"
              >
                📅 Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isScheduling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Processing Post
                </h3>
                <p className="text-sm text-gray-600">
                  Generating images and preparing for publication...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          post={editablePost}
          onClose={() => setShowScheduleModal(false)}
          isScheduling={isScheduling}
          onSchedule={async (scheduledDateTime) => {
            setIsScheduling(true);
            try {
              // Save the scheduled post
              const response = await fetch(
                `/api/posts/${editablePost._id}/schedule`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    scheduled_for: scheduledDateTime,
                    status: "scheduled",
                  }),
                }
              );

              if (response.ok) {
                // Update the post status in local state
                updatePost({
                  scheduled_for: scheduledDateTime,
                  status: "scheduled",
                });

                // Refresh projects to show updated status badges
                await fetchProjects();

                alert("Post scheduled successfully!");
              } else {
                const errorData = await response.json();
                alert(
                  "Failed to schedule post: " +
                    (errorData.error || "Unknown error")
                );
              }
            } catch (error) {
              console.error("Scheduling error:", error);
              alert("Failed to schedule post: " + error.message);
            } finally {
              setIsScheduling(false);
              setShowScheduleModal(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default Projects;
