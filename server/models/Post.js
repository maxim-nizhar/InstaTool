const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  post_title: {
    type: String,
    required: true,
    trim: true,
  },
  theme: {
    type: String,
    required: true,
    enum: ["gold", "blue", "geometric", "calligraphy", "modern"],
    default: "gold",
  },
  scheduled_for: {
    type: Date,
    required: true,
  },
  font: {
    type: String,
    default: "default",
  },
  pages: [
    {
      page_number: {
        type: Number,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  status: {
    type: String,
    enum: ["draft", "scheduled", "published", "failed"],
    default: "draft",
  },
  image_urls: [
    {
      page_number: Number,
      url: String,
    },
  ],
  generatedImageUrls: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update the updated_at field
PostSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Create index for efficient queries
PostSchema.index({ scheduled_for: 1 });
PostSchema.index({ project_id: 1 });
PostSchema.index({ status: 1 });
module.exports = mongoose.model("Post", PostSchema);
