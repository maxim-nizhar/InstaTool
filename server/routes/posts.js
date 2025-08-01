const express = require('express');
const router = express.Router();

// GET /api/posts - Get all posts
router.get('/', async (req, res) => {
  try {
    res.json({ 
      message: 'Posts endpoint working',
      posts: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/posts - Create new post
router.post('/', async (req, res) => {
  try {
    res.json({ 
      message: 'Post creation endpoint working',
      post: req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;