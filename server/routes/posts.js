const express = require("express");
const Post = require("../models/Post");
const Project = require("../models/Project");
const router = express.Router();

// GET /api/posts - Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("project_id")
      .sort({ scheduled_for: 1 });
    res.json({
      message: "Posts retrieved successfully",
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/posts/projects - Get all projects with posts
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("posts")
      .sort({ created_at: -1 }); // Most recent first

    res.json({
      message: "Projects retrieved successfully",
      projects: projects,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/posts/project/:id - Get specific project with posts
router.get("/project/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("posts");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({
      message: "Project retrieved successfully",
      project: project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// SCHEDULING API ENDPOINTS (Must come before /:id routes to avoid conflicts)
// =============================================================================

// GET /api/posts/scheduled - Get all scheduled posts
router.get("/scheduled", async (req, res) => {
  try {
    const { status = "scheduled", limit, offset = 0 } = req.query;

    // Build query filter
    const filter = { status };

    // Build query with optional limit and offset
    let query = Post.find(filter)
      .populate("project_id")
      .sort({ scheduled_for: 1 }); // Earliest first

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (offset) {
      query = query.skip(parseInt(offset));
    }

    const scheduledPosts = await query;

    // Get total count for pagination
    const totalCount = await Post.countDocuments(filter);

    res.json({
      message: "Scheduled posts retrieved successfully",
      posts: scheduledPosts,
      pagination: {
        total: totalCount,
        offset: parseInt(offset),
        limit: limit ? parseInt(limit) : totalCount,
        hasMore: limit
          ? parseInt(offset) + parseInt(limit) < totalCount
          : false,
      },
    });
  } catch (error) {
    console.error("Get scheduled posts error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/posts/scheduled/:id - Update schedule
router.put("/scheduled/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { scheduled_for, status } = req.body;

    // Validation
    if (!scheduled_for) {
      return res.status(400).json({
        error: "scheduled_for is required",
      });
    }

    // Validate that scheduled_for is a future date
    const scheduledDate = new Date(scheduled_for);
    const now = new Date();

    if (scheduledDate <= now) {
      return res.status(400).json({
        error: "Scheduled date must be in the future",
      });
    }

    // Check if the post exists and is scheduled
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.status !== "scheduled") {
      return res.status(400).json({
        error: "Only scheduled posts can be rescheduled",
      });
    }

    // Update the post
    const updateData = {
      scheduled_for: scheduledDate,
      updated_at: new Date(),
    };

    if (status) {
      updateData.status = status;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    }).populate("project_id");

    res.json({
      message: "Schedule updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update schedule error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/posts/scheduled/:id - Delete scheduled post
router.delete("/scheduled/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if the post exists and is scheduled
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.status !== "scheduled") {
      return res.status(400).json({
        error: "Only scheduled posts can be cancelled",
      });
    }

    // Option 1: Actually delete the post (if user wants permanent deletion)
    // await Post.findByIdAndDelete(postId);

    // Option 2: Change status to 'draft' (recommended - preserves data)
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        status: "draft",
        updated_at: new Date(),
      },
      { new: true, runValidators: true }
    ).populate("project_id");

    res.json({
      message: "Scheduled post cancelled successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Delete scheduled post error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/posts/:id/schedule - Schedule a post
router.post("/:id/schedule", async (req, res) => {
  try {
    const postId = req.params.id;
    const { scheduled_for, status = "scheduled" } = req.body;

    // Validation
    if (!scheduled_for) {
      return res.status(400).json({
        error: "scheduled_for is required",
      });
    }

    // Validate that scheduled_for is a future date
    const scheduledDate = new Date(scheduled_for);
    const now = new Date();

    if (scheduledDate <= now) {
      return res.status(400).json({
        error: "Scheduled date must be in the future",
      });
    }

    // Find and update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        scheduled_for: scheduledDate,
        status: status,
        updated_at: new Date(),
      },
      { new: true, runValidators: true }
    ).populate("project_id");

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      message: "Post scheduled successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Scheduling error:", error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// GENERAL POST ENDPOINTS
// =============================================================================

// GET /api/posts/:id - Get individual post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("project_id");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      message: "Post retrieved successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/posts/:id - Update individual post
router.put("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const updates = req.body;

    // Remove any fields that shouldn't be updated
    delete updates._id;
    delete updates.__v;

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, {
      new: true,
      runValidators: true,
    }).populate("project_id");

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/posts/cleanup - Clean up duplicate projects (dev only)
router.delete("/cleanup", async (req, res) => {
  try {
    // Delete all projects and posts to start fresh
    const deletedPosts = await Post.deleteMany({});
    const deletedProjects = await Project.deleteMany({});

    res.json({
      message: "Database cleaned up successfully",
      deleted: {
        posts: deletedPosts.deletedCount,
        projects: deletedProjects.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/posts - Create new post
router.post("/", async (req, res) => {
  try {
    res.json({
      message: "Post creation endpoint working",
      post: req.body,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
