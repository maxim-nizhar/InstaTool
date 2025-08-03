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
