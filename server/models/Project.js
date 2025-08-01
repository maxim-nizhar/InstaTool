const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  total_posts: {
    type: Number,
    default: 0
  },
  csv_filename: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updated_at field
ProjectSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Create index for efficient queries
ProjectSchema.index({ date: 1 });
ProjectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', ProjectSchema);