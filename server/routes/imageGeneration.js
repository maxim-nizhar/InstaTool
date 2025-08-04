const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const {
  generateCarouselImages,
  generatePageImage,
} = require("../services/imageGenerationService");
const {
  uploadMultipleImageBuffers,
  uploadImageBuffer,
} = require("../services/cloudinaryService");
const Post = require("../models/Post");

// Ensure images directory exists
const imagesDir = path.join(__dirname, "../generated_images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

/**
 * Test endpoint: Generate images for a specific post
 * GET /api/images/generate/:postId
 */
router.get("/generate/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Fetch the post from database
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

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

    console.log(`Generating images for post: ${post.post_title}`);
    console.log(`Pages: ${postData.pages.length}, Theme: ${postData.theme}`);

    // Generate images
    const imageBuffers = await generateCarouselImages(postData);

    // Save images to disk for viewing
    const savedImages = [];
    for (let i = 0; i < imageBuffers.length; i++) {
      const filename = `${post._id}_page_${i + 1}_${Date.now()}.png`;
      const filepath = path.join(imagesDir, filename);
      fs.writeFileSync(filepath, imageBuffers[i]);
      savedImages.push({
        page: i + 1,
        filename,
        url: `/api/images/view/${filename}`,
        size: imageBuffers[i].length,
        sizeFormatted: `${(imageBuffers[i].length / 1024).toFixed(1)} KB`,
      });
    }

    res.json({
      success: true,
      message: `Generated ${imageBuffers.length} images successfully`,
      post: {
        id: post._id,
        title: post.post_title,
        theme: post.theme,
        pages: imageBuffers.length,
      },
      images: savedImages,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({
      error: "Failed to generate images",
      message: error.message,
    });
  }
});

/**
 * Test endpoint: Generate and upload images for a specific post
 * POST /api/images/upload/:postId
 */
router.post("/upload/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(400).json({
        error: "Cloudinary not configured",
        message:
          "Please add CLOUDINARY_URL or (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET) to your .env file",
      });
    }

    // Fetch the post from database
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

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

    console.log(`Generating and uploading images for: ${post.post_title}`);

    // Generate images
    const imageBuffers = await generateCarouselImages(postData);

    // Upload to Cloudinary
    const imageUrls = await uploadMultipleImageBuffers(imageBuffers, {
      folder: "insta-tool/posts",
      public_id: `${post._id}_${post.post_title.replace(/[^a-zA-Z0-9]/g, "_")}`,
    });

    // Update post with generated image URLs (optional)
    await Post.findByIdAndUpdate(postId, {
      generatedImageUrls: imageUrls,
    });

    res.json({
      success: true,
      message: `Generated and uploaded ${imageUrls.length} images successfully`,
      post: {
        id: post._id,
        title: post.post_title,
        theme: post.theme,
        pages: imageUrls.length,
      },
      imageUrls: imageUrls,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      error: "Failed to generate and upload images",
      message: error.message,
    });
  }
});

/**
 * Test endpoint: Generate a single page preview
 * POST /api/images/preview
 */
router.post("/preview", async (req, res) => {
  try {
    const { content, theme = "modern", font = "Arial" } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    console.log(`Generating preview image with theme: ${theme}`);

    // Generate single page image
    const imageBuffer = await generatePageImage({ content, theme, font });

    // Save preview image to disk
    const filename = `preview_${Date.now()}.png`;
    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, imageBuffer);

    res.json({
      success: true,
      message: "Preview image generated successfully",
      image: {
        filename,
        url: `/api/images/view/${filename}`,
        size: imageBuffer.length,
        sizeFormatted: `${(imageBuffer.length / 1024).toFixed(1)} KB`,
        theme,
        font,
      },
    });
  } catch (error) {
    console.error("Preview generation error:", error);
    res.status(500).json({
      error: "Failed to generate preview",
      message: error.message,
    });
  }
});

/**
 * Get all posts with their image generation status
 * GET /api/images/status
 */
router.get("/status", async (req, res) => {
  try {
    const posts = await Post.find()
      .select("_id post_title theme pages generatedImageUrls")
      .limit(20);

    const postsWithStatus = posts.map((post) => ({
      id: post._id,
      title: post.post_title,
      theme: post.theme,
      pages: post.pages.length,
      hasGeneratedImages:
        post.generatedImageUrls && post.generatedImageUrls.length > 0,
      generatedImageCount: post.generatedImageUrls
        ? post.generatedImageUrls.length
        : 0,
    }));

    res.json({
      success: true,
      totalPosts: posts.length,
      posts: postsWithStatus,
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      error: "Failed to get status",
      message: error.message,
    });
  }
});

/**
 * Serve generated images
 * GET /api/images/view/:filename
 */
router.get("/view/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(imagesDir, filename);

    // Security check - ensure file exists and is in the images directory
    if (!fs.existsSync(filepath) || !filepath.startsWith(imagesDir)) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

    // Send the image file
    res.sendFile(filepath);
  } catch (error) {
    console.error("Image serving error:", error);
    res.status(500).json({
      error: "Failed to serve image",
      message: error.message,
    });
  }
});

/**
 * Download generated image
 * GET /api/images/download/:filename
 */
router.get("/download/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(imagesDir, filename);

    if (!fs.existsSync(filepath) || !filepath.startsWith(imagesDir)) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Force download
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "image/png");

    res.sendFile(filepath);
  } catch (error) {
    console.error("Image download error:", error);
    res.status(500).json({
      error: "Failed to download image",
      message: error.message,
    });
  }
});

/**
 * Debug endpoint to check environment variables
 * GET /api/images/debug-env
 */
router.get("/debug-env", (req, res) => {
  res.json({
    hasCloudinaryUrl: !!process.env.CLOUDINARY_URL,
    hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    // Show first few characters of CLOUDINARY_URL for debugging (without revealing full credentials)
    cloudinaryUrlPrefix: process.env.CLOUDINARY_URL
      ? process.env.CLOUDINARY_URL.substring(0, 15) + "..."
      : null,
  });
});

module.exports = router;
