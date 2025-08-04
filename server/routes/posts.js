const express = require("express");
const Post = require("../models/Post");
const Project = require("../models/Project");
const { generateCarouselImages } = require("../services/imageGenerationService");
const { uploadMultipleImageBuffers } = require("../services/cloudinaryService");
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

// POST /api/posts/:id/publish - Publish post immediately with image generation
router.post("/:id/publish", async (req, res) => {
  try {
    const postId = req.params.id;
    const { caption } = req.body;

    console.log(`🚀 Starting direct publish workflow for post ${postId}`);

    // Get the post from database
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Step 1: Generate images if not already generated
    let imageUrls = post.generatedImageUrls || [];
    
    if (imageUrls.length === 0) {
      console.log(`📸 Generating images for post "${post.post_title}"`);
      
      try {
        // Prepare data for image generation
        const postData = {
          theme: post.theme || "modern",
          font: post.font || "Arial",
          pages: post.pages.map((page) => ({
            content: page.content,
            theme: post.theme,
            font: post.font,
          })),
        };

        // Generate images
        const imageBuffers = await generateCarouselImages(postData);
        console.log(`✅ Generated ${imageBuffers.length} image buffers`);

        // Upload to Cloudinary
        const uploadOptions = {
          folder: "insta-tool/posts",
          public_id: `${postId}_${post.post_title.replace(/[^a-zA-Z0-9]/g, "_")}`,
        };

        imageUrls = await uploadMultipleImageBuffers(imageBuffers, uploadOptions);
        console.log(`✅ Uploaded ${imageUrls.length} images to Cloudinary`);

        // Update post with generated image URLs
        await Post.findByIdAndUpdate(postId, {
          generatedImageUrls: imageUrls,
        });

      } catch (imageError) {
        console.error(`❌ Image generation failed for post ${postId}:`, imageError);
        // Update post status to failed
        await Post.findByIdAndUpdate(postId, { 
          status: 'failed',
          error_message: `Image generation failed: ${imageError.message}` 
        });
        
        return res.status(500).json({
          error: "Failed to generate images for publishing",
          details: imageError.message,
        });
      }
    } else {
      console.log(`✅ Using existing ${imageUrls.length} generated images`);
    }

    // Step 2: Publish to Instagram (if configured)
    const InstagramAPIService = require('../services/instagramAPI');
    const instagramService = new InstagramAPIService();
    
    // Check if Instagram is configured
    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID) {
      console.log('⚠️ Instagram API not configured, marking as published without Instagram upload');
      
      // Update post status to published (without Instagram)
      const updatedPost = await Post.findByIdAndUpdate(postId, {
        status: 'published',
        published_at: new Date(),
        updated_at: new Date(),
      }, { new: true }).populate("project_id");

      return res.json({
        success: true,
        message: `Post "${post.post_title}" published successfully (Instagram API not configured)`,
        post: updatedPost,
        imageUrls: imageUrls,
        instagramConfigured: false,
      });
    }

    try {
      console.log(`📱 Publishing to Instagram with ${imageUrls.length} images`);
      
      // Create caption from post content if not provided
      const postCaption = caption || `${post.post_title}\n\n${post.pages[0]?.content || ''}`;

      let instagramResult;
      
      // Use single image or carousel based on number of images
      if (imageUrls.length === 1) {
        instagramResult = await instagramService.postSingleImage(imageUrls[0], postCaption);
      } else {
        instagramResult = await instagramService.postCarousel(imageUrls, postCaption);
      }

      if (instagramResult.success) {
        // Update post in database with Instagram information
        const updateData = {
          status: 'published',
          instagramCarouselId: instagramResult.postId,
          published_at: new Date(),
          updated_at: new Date(),
          generatedImageUrls: imageUrls, // Ensure URLs are saved
        };

        // Add individual container IDs if it's a carousel
        if (instagramResult.individualContainerIds) {
          updateData.instagramContainerIds = instagramResult.individualContainerIds;
        } else if (instagramResult.containerId) {
          updateData.instagramContainerIds = [instagramResult.containerId];
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true }).populate("project_id");

        console.log('✅ Post published to Instagram and database updated');

        res.json({
          success: true,
          message: `Post "${post.post_title}" published to Instagram successfully`,
          post: updatedPost,
          instagramPostId: instagramResult.postId,
          instagramUrl: `https://www.instagram.com/p/${instagramResult.postId}`,
          imageUrls: imageUrls,
          instagramConfigured: true,
        });
      } else {
        // Instagram publish failed
        console.error(`❌ Instagram publish failed: ${instagramResult.error}`);
        
        // Update post status to failed
        await Post.findByIdAndUpdate(postId, { 
          status: 'failed',
          error_message: `Instagram publish failed: ${instagramResult.error}`,
          generatedImageUrls: imageUrls, // Keep the generated images
        });

        return res.status(400).json({
          error: "Failed to publish to Instagram",
          details: instagramResult.error,
          imageUrls: imageUrls, // Still return the generated images
        });
      }
    } catch (instagramError) {
      console.error(`❌ Instagram publish error for post ${postId}:`, instagramError);
      
      // Update post status to failed
      await Post.findByIdAndUpdate(postId, { 
        status: 'failed',
        error_message: `Instagram publish error: ${instagramError.message}`,
        generatedImageUrls: imageUrls, // Keep the generated images
      });

      return res.status(500).json({
        error: "Instagram publish failed with server error",
        details: instagramError.message,
        imageUrls: imageUrls, // Still return the generated images
      });
    }

  } catch (error) {
    console.error("Direct publish error:", error);
    
    // Update post status to failed
    try {
      await Post.findByIdAndUpdate(postId, { 
        status: 'failed',
        error_message: `Publish workflow failed: ${error.message}` 
      });
    } catch (dbError) {
      console.error('Failed to update post status:', dbError);
    }

    res.status(500).json({
      error: "Direct publish workflow failed",
      details: error.message,
    });
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

    // Check if this is a scheduling request
    if (updates.scheduled_for) {
      const scheduledDate = new Date(updates.scheduled_for);
      const now = new Date();

      // Validate that scheduled_for is a future date
      if (scheduledDate <= now) {
        return res.status(400).json({
          error: "Scheduled date must be in the future",
        });
      }

      // Get the current post to access its pages
      const currentPost = await Post.findById(postId);
      if (!currentPost) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Orchestrate image generation and upload process
      try {
        console.log(`Starting image generation for post ${postId}...`);
        
        // Step 1: Generate Image Buffers in correct sequential order
        const postData = {
          theme: currentPost.theme,
          font: currentPost.font,
          pages: currentPost.pages.sort((a, b) => a.page_number - b.page_number), // Ensure correct order
        };

        const imageBuffers = await generateCarouselImages(postData);
        console.log(`Generated ${imageBuffers.length} image buffers for post ${postId}`);

        // Step 2: Upload to Cloudinary and collect URLs in order
        const uploadOptions = {
          folder: `insta-tool/posts/${postId}`,
          public_id: `post_${postId}`,
        };

        const cloudinaryUrls = await uploadMultipleImageBuffers(imageBuffers, uploadOptions);
        console.log(`Uploaded ${cloudinaryUrls.length} images to Cloudinary for post ${postId}`);

        // Step 3: Update database with scheduled status and ordered URLs
        updates.status = 'scheduled';
        updates.generatedImageUrls = cloudinaryUrls; // URLs in correct page order
        updates.scheduled_for = scheduledDate;
        
        // Keep new Instagram fields empty for now
        updates.instagramContainerIds = [];
        updates.instagramCarouselId = "";

      } catch (imageError) {
        console.error(`Image generation/upload error for post ${postId}:`, imageError);
        return res.status(500).json({
          error: "Failed to generate and upload images for scheduled post",
          details: imageError.message,
        });
      }
    }

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
    console.error("Post update error:", error);
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
