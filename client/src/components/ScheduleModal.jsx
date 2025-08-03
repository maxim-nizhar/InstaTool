import React, { useState } from "react";

const ScheduleModal = ({ post, onClose, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState({
    hours: "12",
    minutes: "00",
    seconds: "00",
  });

  // Get current date for minimum date validation
  const today = new Date().toISOString().split("T")[0];

  const handleTimeChange = (field, value) => {
    setSelectedTime((prev) => ({
      ...prev,
      [field]: value.padStart(2, "0"),
    }));
  };

  const handleSchedule = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    // Create full datetime string
    const scheduledDateTime = `${selectedDate}T${selectedTime.hours}:${selectedTime.minutes}:${selectedTime.seconds}`;
    const scheduledDate = new Date(scheduledDateTime);

    // Validate future date
    if (scheduledDate <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    onSchedule(scheduledDateTime);
  };

  // Generate options for time dropdowns
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
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Post Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Post Preview:</h3>
            <div className="text-sm text-gray-700">
              <div className="font-medium">{post.post_title}</div>
              <div className="text-xs text-gray-500 mt-1">
                Theme: {post.theme} • {post.pages.length} pages
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
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

          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time (H:M:S)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Hours */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Hours
                </label>
                <select
                  value={selectedTime.hours}
                  onChange={(e) => handleTimeChange("hours", e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {hourOptions.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minutes */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Minutes
                </label>
                <select
                  value={selectedTime.minutes}
                  onChange={(e) => handleTimeChange("minutes", e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {minuteOptions.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seconds */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Seconds
                </label>
                <select
                  value={selectedTime.seconds}
                  onChange={(e) => handleTimeChange("seconds", e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {secondOptions.map((second) => (
                    <option key={second} value={second}>
                      {second}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Selected DateTime Display */}
          {selectedDate && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Scheduled for:</strong>
                <br />
                {new Date(
                  `${selectedDate}T${selectedTime.hours}:${selectedTime.minutes}:${selectedTime.seconds}`
                ).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
