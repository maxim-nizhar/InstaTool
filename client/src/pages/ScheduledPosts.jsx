import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ScheduledPosts = () => {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      // Fetch real scheduled posts from backend API
      const response = await fetch("/api/posts/scheduled");
      if (!response.ok) {
        throw new Error("Failed to fetch scheduled posts");
      }

      const data = await response.json();
      setScheduledPosts(data.posts || []);
    } catch (err) {
      setError("Failed to fetch scheduled posts: " + err.message);
      console.error("Fetch scheduled posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleEditSchedule = (post) => {
    setEditingPost(post);
  };

  const handleDeleteSchedule = async (postId) => {
    if (!confirm("Are you sure you want to delete this scheduled post?")) {
      return;
    }

    try {
      // Call real backend API to delete scheduled post
      const response = await fetch(`/api/posts/scheduled/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete scheduled post");
      }

      // Remove from local state after successful API call
      setScheduledPosts((posts) => posts.filter((post) => post._id !== postId));
      alert("Scheduled post cancelled successfully!");
    } catch (err) {
      alert("Failed to delete scheduled post: " + err.message);
      console.error("Delete scheduled post error:", err);
    }
  };

  const handleUpdateSchedule = async (postId, newDateTime) => {
    try {
      // Call real backend API to update schedule
      const response = await fetch(`/api/posts/scheduled/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduled_for: newDateTime }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update schedule");
      }

      // Update local state after successful API call
      setScheduledPosts((posts) =>
        posts.map((post) =>
          post._id === postId ? { ...post, scheduled_for: newDateTime } : post
        )
      );
      setEditingPost(null);
      alert("Schedule updated successfully!");
    } catch (err) {
      alert("Failed to update schedule: " + err.message);
      console.error("Update schedule error:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scheduled posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={fetchScheduledPosts}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Scheduled Posts
        </h1>
        <p className="text-gray-600">
          Manage your scheduled Instagram posts • {scheduledPosts.length} posts
          scheduled
        </p>
      </div>

      {scheduledPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Scheduled Posts
            </h3>
            <p className="text-gray-600 mb-4">
              Create and schedule posts from your projects to see them here
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Projects
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {scheduledPosts.map((post) => (
            <ScheduledPostCard
              key={post._id}
              post={post}
              onEdit={handleEditSchedule}
              onDelete={handleDeleteSchedule}
              getStatusColor={getStatusColor}
              getThemeGradient={getThemeGradient}
              formatDateTime={formatDateTime}
            />
          ))}
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editingPost && (
        <EditScheduleModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={handleUpdateSchedule}
        />
      )}
    </div>
  );
};

// ScheduledPostCard Component
const ScheduledPostCard = ({
  post,
  onEdit,
  onDelete,
  getStatusColor,
  getThemeGradient,
  formatDateTime,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex">
        {/* Post Thumbnail */}
        <div className="w-32 h-32 flex-shrink-0">
          <div
            className="w-full h-full flex items-center justify-center text-center p-3 text-white text-xs"
            style={{
              background: getThemeGradient(post.theme),
            }}
          >
            <div className="line-clamp-4">{post.post_title}</div>
          </div>
        </div>

        {/* Post Details */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {post.post_title}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Scheduled for:</span>
                  <br />
                  <span className="text-blue-600 font-medium">
                    {formatDateTime(post.scheduled_for)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Theme:</span> {post.theme}
                  <br />
                  <span className="font-medium">Pages:</span>{" "}
                  {post.pages.length}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    post.status
                  )}`}
                >
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>

                {post.status === "scheduled" && (
                  <span className="text-xs text-gray-500">
                    Created {new Date(post.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2 ml-4">
              {post.status === "scheduled" && (
                <>
                  <button
                    onClick={() => onEdit(post)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit Schedule
                  </button>
                  <button
                    onClick={() => onDelete(post._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}

              {post.status === "failed" && (
                <button
                  onClick={() => onEdit(post)}
                  className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                >
                  Reschedule
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// EditScheduleModal Component
const EditScheduleModal = ({ post, onClose, onUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(
    post.scheduled_for.split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState(() => {
    const time = post.scheduled_for.split("T")[1];
    const [hours, minutes, seconds] = time.split(":");
    return { hours, minutes, seconds: seconds || "00" };
  });

  const today = new Date().toISOString().split("T")[0];

  const handleTimeChange = (field, value) => {
    setSelectedTime((prev) => ({
      ...prev,
      [field]: value.padStart(2, "0"),
    }));
  };

  const handleUpdate = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    const newDateTime = `${selectedDate}T${selectedTime.hours}:${selectedTime.minutes}:${selectedTime.seconds}`;
    const newDate = new Date(newDateTime);

    if (newDate <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    onUpdate(post._id, newDateTime);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const secondOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{post.post_title}</div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time (H:M:S)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={selectedTime.hours}
                onChange={(e) => handleTimeChange("hours", e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <select
                value={selectedTime.minutes}
                onChange={(e) => handleTimeChange("minutes", e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <select
                value={selectedTime.seconds}
                onChange={(e) => handleTimeChange("seconds", e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {secondOptions.map((second) => (
                  <option key={second} value={second}>
                    {second}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedDate && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>New schedule:</strong>
                <br />
                {new Date(
                  `${selectedDate}T${selectedTime.hours}:${selectedTime.minutes}:${selectedTime.seconds}`
                ).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduledPosts;
