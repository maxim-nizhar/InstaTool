const express = require('express');
const router = express.Router();
const InstagramAPIService = require('../services/instagramAPI');
const Post = require('../models/Post');

const instagramService = new InstagramAPIService();

/**
 * Test Instagram API connection
 * GET /api/instagram/test
 */
router.get('/test', async (req, res) => {
  try {
    const result = await instagramService.testConnection();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Instagram API connection successful',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Instagram API connection failed',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Instagram test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Instagram API test',
      error: error.message
    });
  }
});

/**
 * Get Instagram account information
 * GET /api/instagram/account
 */
router.get('/account', async (req, res) => {
  try {
    const result = await instagramService.getAccountInfo();
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Instagram account endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Post single image to Instagram
 * POST /api/instagram/post-single
 * Body: { imageUrl, caption }
 */
router.post('/post-single', async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }

    console.log('🔄 Posting single image to Instagram:', imageUrl);
    
    const result = await instagramService.postSingleImage(imageUrl, caption);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Image posted to Instagram successfully',
        postId: result.postId,
        containerId: result.containerId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Instagram single post endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Post carousel to Instagram
 * POST /api/instagram/post-carousel
 * Body: { imageUrls, caption }
 */
router.post('/post-carousel', async (req, res) => {
  try {
    const { imageUrls, caption } = req.body;
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Image URLs array is required'
      });
    }

    console.log(`🔄 Posting carousel to Instagram with ${imageUrls.length} images`);
    
    const result = await instagramService.postCarousel(imageUrls, caption);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Carousel posted to Instagram successfully',
        postId: result.postId,
        carouselContainerId: result.carouselContainerId,
        individualContainerIds: result.individualContainerIds
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Instagram carousel post endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Publish InstaTool post to Instagram (integrates with existing post system)
 * POST /api/instagram/publish/:postId
 */
router.post('/publish/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption } = req.body;
    
    // Get the post from database
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if post has generated images
    if (!post.generatedImageUrls || post.generatedImageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Post does not have generated images. Please generate images first.'
      });
    }

    console.log(`🔄 Publishing InstaTool post "${post.post_title}" to Instagram`);
    console.log(`📸 Using ${post.generatedImageUrls.length} generated images`);

    // Create caption from post content if not provided
    const postCaption = caption || `${post.post_title}\n\n${post.pages[0]?.content || ''}`;

    let result;
    
    // Use single image or carousel based on number of images
    if (post.generatedImageUrls.length === 1) {
      result = await instagramService.postSingleImage(post.generatedImageUrls[0], postCaption);
    } else {
      result = await instagramService.postCarousel(post.generatedImageUrls, postCaption);
    }

    if (result.success) {
      // Update post in database with Instagram information
      const updateData = {
        status: 'published',
        instagramCarouselId: result.postId,
        published_at: new Date()
      };

      // Add individual container IDs if it's a carousel
      if (result.individualContainerIds) {
        updateData.instagramContainerIds = result.individualContainerIds;
      } else if (result.containerId) {
        updateData.instagramContainerIds = [result.containerId];
      }

      await Post.findByIdAndUpdate(postId, updateData);

      console.log('✅ Post published and database updated');

      res.json({
        success: true,
        message: `Post "${post.post_title}" published to Instagram successfully`,
        instagramPostId: result.postId,
        instagramUrl: `https://www.instagram.com/p/${result.postId}`,
        postData: {
          title: post.post_title,
          theme: post.theme,
          imageCount: post.generatedImageUrls.length
        }
      });
    } else {
      // Update post status to failed
      await Post.findByIdAndUpdate(postId, { 
        status: 'failed',
        error_message: result.error 
      });

      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Instagram publish endpoint error:', error);
    
    // Update post status to failed
    try {
      await Post.findByIdAndUpdate(req.params.postId, { 
        status: 'failed',
        error_message: error.message 
      });
    } catch (dbError) {
      console.error('Failed to update post status:', dbError);
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get recent Instagram posts
 * GET /api/instagram/recent
 */
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await instagramService.getRecentPosts(limit);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Instagram recent posts endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;