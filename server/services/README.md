# InstaTool Services Documentation

This directory contains the core services for the InstaTool backend.

## Cloudinary Upload Service

### Purpose

Handles uploading image buffers to Cloudinary cloud storage using the `upload_stream` method.

### Setup

Add these environment variables to your `.env` file:

```env
# Cloudinary Configuration (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

To get these credentials:

1. Sign up at [https://cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy the Cloud Name, API Key, and API Secret

### Usage

```javascript
const {
  uploadImageBuffer,
  uploadMultipleImageBuffers,
} = require("./cloudinaryService");

// Upload single image buffer
const imageUrl = await uploadImageBuffer(buffer, {
  folder: "instagram-posts",
  public_id: "my-post-image",
});

// Upload multiple image buffers (for carousel posts)
const imageUrls = await uploadMultipleImageBuffers(buffers, {
  folder: "instagram-carousels",
});
```

### Features

- ✅ Async function that accepts image buffers
- ✅ Uses `cloudinary.uploader.upload_stream` method as required
- ✅ Returns `secure_url` from successful upload response
- ✅ Supports batch uploads for carousel posts
- ✅ Error handling and validation
- ✅ Automatic image optimization and format conversion

## Image Generation Service

### Purpose

Creates 1080x1080 pixel Instagram carousel images using the Sharp library.

### Features

- ✅ Accepts complete post data (theme, fonts, text content)
- ✅ Returns array of image buffers for each page
- ✅ Supports all 5 Islamic themes (gold, blue, geometric, calligraphy, modern)
- ✅ Handles HTML content with bold/italic formatting
- ✅ Generates gradient backgrounds matching the frontend themes
- ✅ Optimizes text layout and sizing automatically

### Usage

```javascript
const {
  generateCarouselImages,
  generatePageImage,
} = require("./imageGenerationService");

// Generate images for entire carousel post
const postData = {
  theme: "gold",
  font: "Arial",
  pages: [
    { content: "Page 1 content with <b>bold</b> text" },
    { content: "Page 2 content with <i>italic</i> text" },
    { content: "Page 3 content" },
  ],
};

const imageBuffers = await generateCarouselImages(postData);
// Returns array of Buffer objects, each representing a 1080x1080 image

// Generate single page image
const pageBuffer = await generatePageImage({
  content: "Your content here",
  theme: "blue",
  font: "Arial",
});
```

### Supported Themes

- **gold**: Linear gradient (#FFD700 → #FFA500) with dark text
- **blue**: Linear gradient (#4A90E2 → #7B68EE) with white text
- **geometric**: Linear gradient (#667eea → #764ba2) with white text
- **calligraphy**: Linear gradient (#2E7D32 → #4CAF50) with white text
- **modern**: Linear gradient (#263238 → #37474F) with white text

### Supported Fonts

- Canva Sans (fallback to Arial)
- Arial
- Times New Roman
- Default (Arial)

## Integration Example

Complete workflow for generating and uploading carousel images:

```javascript
const { generateCarouselImages } = require("./imageGenerationService");
const { uploadMultipleImageBuffers } = require("./cloudinaryService");

async function processPost(postData) {
  try {
    // 1. Generate images from post data
    const imageBuffers = await generateCarouselImages(postData);

    // 2. Upload images to Cloudinary
    const imageUrls = await uploadMultipleImageBuffers(imageBuffers, {
      folder: "instagram-posts",
      public_id: `post_${postData.post_title}`,
    });

    // 3. Update post with generated image URLs
    return imageUrls;
  } catch (error) {
    console.error("Post processing error:", error);
    throw error;
  }
}
```

## File Structure

```
services/
├── cloudinaryService.js     # Cloudinary upload functionality
├── imageGenerationService.js # Sharp-based image generation
├── instagramAPI.js          # Instagram API integration (future)
└── README.md               # This documentation
```

## Error Handling

Both services include comprehensive error handling:

- Input validation (buffer checks, content validation)
- Descriptive error messages
- Graceful failure handling
- Console logging for debugging

## Performance Considerations

- Image generation uses Promise.all for parallel processing
- Cloudinary uploads are optimized with automatic quality settings
- SVG-based text rendering for crisp, scalable typography
- Efficient memory management with buffer operations

## Dependencies

- **cloudinary**: Cloud storage and image optimization
- **sharp**: High-performance image processing
- **Node.js**: Built-in Buffer and Promise support
