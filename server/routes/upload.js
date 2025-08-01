const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const Project = require('../models/Project');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Helper function to parse CSV data
const parseCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Helper function to process posts from CSV data
const processPostsFromCSV = async (csvData, projectId, csvFilename) => {
  const createdPosts = [];
  
  for (const row of csvData) {
    try {
      // Extract pages from CSV row
      const pages = [];
      let pageNumber = 1;
      
      // Look for page_1_content, page_2_content, etc.
      while (row[`page_${pageNumber}_content`]) {
        pages.push({
          page_number: pageNumber,
          content: row[`page_${pageNumber}_content`].trim()
        });
        pageNumber++;
      }
      
      // If no numbered pages found, check for just 'content'
      if (pages.length === 0 && row.content) {
        pages.push({
          page_number: 1,
          content: row.content.trim()
        });
      }
      
      // Validate required fields
      if (!row.post_title || !row.scheduled_for || pages.length === 0) {
        console.warn('Skipping invalid row:', row);
        continue;
      }
      
      // Parse scheduled date
      const scheduledDate = new Date(row.scheduled_for);
      if (isNaN(scheduledDate.getTime())) {
        console.warn('Invalid date format in row:', row);
        continue;
      }
      
      // Create post
      const post = new Post({
        post_title: row.post_title.trim(),
        theme: row.theme || 'gold',
        scheduled_for: scheduledDate,
        font: row.font || 'default',
        pages: pages,
        project_id: projectId,
        status: 'scheduled'
      });
      
      const savedPost = await post.save();
      createdPosts.push(savedPost);
      
      console.log(`✅ Created post: ${post.post_title}`);
      
    } catch (error) {
      console.error('Error processing post:', error);
      continue;
    }
  }
  
  return createdPosts;
};

// Helper function to create one project per CSV file
const createProjectFromPosts = async (posts, csvFilename) => {
  // Create a single project for all posts from this CSV
  const projectName = csvFilename.replace(/\.csv$/i, ''); // Remove .csv extension
  const earliestDate = new Date(Math.min(...posts.map(p => p.scheduled_for)));
  
  const project = new Project({
    name: projectName,
    date: earliestDate, // Use earliest scheduled date as project date
    description: `Generated from ${csvFilename} - Contains ${posts.length} posts`,
    posts: posts.map(p => p._id),
    total_posts: posts.length,
    csv_filename: csvFilename,
    status: 'active'
  });
  
  const savedProject = await project.save();
  
  // Update all posts with this project_id
  await Post.updateMany(
    { _id: { $in: posts.map(p => p._id) } },
    { project_id: savedProject._id }
  );
  
  console.log(`✅ Created project: ${projectName} with ${posts.length} posts`);
  
  return savedProject;
};

// POST /api/upload - Upload and process CSV file
router.post('/', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }
    
    console.log(`📁 Processing CSV file: ${req.file.originalname}`);
    
    // Parse CSV file
    const csvData = await parseCSVFile(req.file.path);
    
    if (csvData.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty or invalid' });
    }
    
    console.log(`📊 Found ${csvData.length} rows in CSV`);
    
    // Process posts from CSV data (without project_id initially)
    const posts = await processPostsFromCSV(csvData, null, req.file.originalname);
    
    if (posts.length === 0) {
      return res.status(400).json({ error: 'No valid posts found in CSV file' });
    }
    
    // Create single project for all posts
    const project = await createProjectFromPosts(posts, req.file.originalname);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({ 
      message: 'CSV processed successfully!',
      summary: {
        total_rows: csvData.length,
        posts_created: posts.length,
        projects_created: 1,
        filename: req.file.originalname
      },
      posts: posts.map(p => ({
        id: p._id,
        title: p.post_title,
        theme: p.theme,
        scheduled_for: p.scheduled_for,
        pages: p.pages.length
      })),
      project: {
        id: project._id,
        name: project.name,
        date: project.date,
        posts_count: project.total_posts
      }
    });
    
  } catch (error) {
    console.error('CSV processing error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process CSV file',
      details: error.message 
    });
  }
});

module.exports = router;