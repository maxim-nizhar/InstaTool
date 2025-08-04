import React, { useState, useEffect } from "react";

const ImageTest = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/images/status");
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts");
    }
  };

  const testImageGeneration = async (postId) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/images/generate/${postId}`
      );
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Image generation failed");
      }
    } catch (error) {
      console.error("Error generating images:", error);
      setError("Failed to generate images");
    } finally {
      setLoading(false);
    }
  };

  const testImageUpload = async (postId) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/images/upload/${postId}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (data.success) {
        setResult(data);
        // Refresh posts to show updated status
        fetchPosts();
      } else {
        setError(data.error || "Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setError("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const testPreview = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const testContent =
      "<b>Test Preview</b><br/>This is a <i>test preview</i> with formatting.<br/><br/>🌟 Islamic Content Creator";

    try {
      const response = await fetch("http://localhost:3001/api/images/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: testContent,
          theme: "gold",
          font: "Arial",
        }),
      });
      const data = await response.json();

      if (data.success) {
        setResult({
          ...data,
          isPreview: true,
        });
      } else {
        setError(data.error || "Preview generation failed");
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      setError("Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎨 Image Generation Testing
          </h1>
          <p className="text-gray-600 mb-6">
            Test the Sharp-based image generation and Cloudinary upload services
            with your existing posts.
          </p>

          {/* Quick Preview Test */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Quick Preview Test
            </h3>
            <button
              onClick={testPreview}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Test Preview"}
            </button>
          </div>

          {/* Posts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPost?.id === post.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPost(post)}
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium bg-${
                      post.theme === "gold"
                        ? "yellow"
                        : post.theme === "blue"
                        ? "blue"
                        : post.theme === "geometric"
                        ? "purple"
                        : post.theme === "calligraphy"
                        ? "green"
                        : "gray"
                    }-100 text-${
                      post.theme === "gold"
                        ? "yellow"
                        : post.theme === "blue"
                        ? "blue"
                        : post.theme === "geometric"
                        ? "purple"
                        : post.theme === "calligraphy"
                        ? "green"
                        : "gray"
                    }-800`}
                  >
                    {post.theme}
                  </span>
                  <span className="text-sm text-gray-600">
                    {post.pages} pages
                  </span>
                </div>
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      post.status
                    )}`}
                  >
                    {getStatusBadgeText(post.status)}
                  </span>
                </div>
                {post.hasGeneratedImages && (
                  <div className="text-sm text-green-600 font-medium">
                    ✅ {post.generatedImageCount} images generated
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {selectedPost && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Selected: {selectedPost.title}
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => testImageGeneration(selectedPost.id)}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Images"}
                </button>
                <button
                  onClick={() => testImageUpload(selectedPost.id)}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Generate & Upload to Cloudinary"}
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
                <p className="text-yellow-800">
                  Processing... This may take a few seconds.
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <h4 className="text-red-800 font-semibold mb-2">Error</h4>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="text-green-800 font-semibold mb-3">
                {result.isPreview ? "Preview Generated!" : "Success!"}
              </h4>
              <p className="text-green-700 mb-4">{result.message}</p>

              {result.post && (
                <div className="bg-white p-3 rounded border mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Post Details:
                  </h5>
                  <p>
                    <strong>Title:</strong> {result.post.title}
                  </p>
                  <p>
                    <strong>Theme:</strong> {result.post.theme}
                  </p>
                  <p>
                    <strong>Pages:</strong> {result.post.pages}
                  </p>
                </div>
              )}

              {result.images && (
                <div className="bg-white p-3 rounded border mb-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Generated Images:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.images.map((img, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
                          <img
                            src={`http://localhost:3001${img.url}`}
                            alt={`Page ${img.page}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=";
                            }}
                          />
                        </div>
                        <div className="text-sm text-center">
                          <p className="font-medium text-gray-800">
                            Page {img.page}
                          </p>
                          <p className="text-gray-600">{img.sizeFormatted}</p>
                          <div className="flex gap-2 mt-2">
                            <a
                              href={`http://localhost:3001${img.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              View Full Size
                            </a>
                            <a
                              href={`http://localhost:3001/api/images/download/${img.filename}`}
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.imageUrls && (
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Cloudinary URLs:
                  </h5>
                  <div className="space-y-1">
                    {result.imageUrls.map((url, index) => (
                      <div key={index} className="text-sm">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all"
                        >
                          Page {index + 1}: {url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.image && (
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Preview Image:
                  </h5>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-48 h-48 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={`http://localhost:3001${result.image.url}`}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=";
                          }}
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={`http://localhost:3001${result.image.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Full Size
                        </a>
                        <a
                          href={`http://localhost:3001/api/images/download/${result.image.filename}`}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h6 className="font-medium text-gray-800 mb-2">
                        Details:
                      </h6>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Size:</strong> {result.image.sizeFormatted}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Theme:</strong> {result.image.theme}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Font:</strong> {result.image.font}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageTest;
