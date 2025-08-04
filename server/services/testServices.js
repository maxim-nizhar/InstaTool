/**
 * Test file to demonstrate the usage of both services
 * Run with: node services/testServices.js
 */

const {
  generateCarouselImages,
  generatePageImage,
} = require("./imageGenerationService");
const {
  uploadImageBuffer,
  uploadMultipleImageBuffers,
} = require("./cloudinaryService");

// Sample post data similar to what would come from the database
const samplePostData = {
  post_title: "Islamic Wisdom Quotes",
  theme: "gold",
  font: "Arial",
  pages: [
    {
      page_number: 1,
      content: `<div><b>In the name of Allah,</b><br>the Most Gracious,<br>the Most Merciful</div>`,
    },
    {
      page_number: 2,
      content: `<div>And whoever relies upon Allah -<br><i>then He is sufficient for him.</i><br><b>Indeed, Allah will accomplish His purpose.</b></div>`,
    },
    {
      page_number: 3,
      content: `<div>Verily, with hardship<br>comes ease.<br><br><i>Quran 94:6</i></div>`,
    },
  ],
};

/**
 * Test the image generation service
 */
async function testImageGeneration() {
  console.log("🎨 Testing Image Generation Service...\n");

  try {
    // Test single page generation
    console.log("📄 Generating single page image...");
    const singlePageBuffer = await generatePageImage({
      content:
        "<b>Test Content</b><br>This is a test page with <i>formatting</i>",
      theme: "blue",
      font: "Arial",
    });
    console.log(`✅ Single page generated: ${singlePageBuffer.length} bytes\n`);

    // Test carousel generation
    console.log("📚 Generating carousel images...");
    const carouselBuffers = await generateCarouselImages(samplePostData);
    console.log(`✅ Carousel generated: ${carouselBuffers.length} pages`);
    carouselBuffers.forEach((buffer, index) => {
      console.log(`   Page ${index + 1}: ${buffer.length} bytes`);
    });

    return { singlePageBuffer, carouselBuffers };
  } catch (error) {
    console.error("❌ Image generation failed:", error.message);
    throw error;
  }
}

/**
 * Test the Cloudinary upload service
 */
async function testCloudinaryUpload(imageBuffers) {
  console.log("\n☁️  Testing Cloudinary Upload Service...\n");

  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.log(
        "⚠️  Cloudinary not configured. Add these to your .env file:"
      );
      console.log("   CLOUDINARY_CLOUD_NAME=your_cloud_name");
      console.log("   CLOUDINARY_API_KEY=your_api_key");
      console.log("   CLOUDINARY_API_SECRET=your_api_secret");
      console.log("\n   Skipping upload test...");
      return null;
    }

    const { singlePageBuffer, carouselBuffers } = imageBuffers;

    // Test single upload
    console.log("📤 Uploading single image...");
    const singleUrl = await uploadImageBuffer(singlePageBuffer, {
      folder: "insta-tool-test",
      public_id: "test_single_page",
    });
    console.log(`✅ Single upload successful: ${singleUrl}\n`);

    // Test multiple uploads
    console.log("📤 Uploading carousel images...");
    const carouselUrls = await uploadMultipleImageBuffers(carouselBuffers, {
      folder: "insta-tool-test",
      public_id: "test_carousel",
    });
    console.log(`✅ Carousel upload successful: ${carouselUrls.length} images`);
    carouselUrls.forEach((url, index) => {
      console.log(`   Page ${index + 1}: ${url}`);
    });

    return { singleUrl, carouselUrls };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);
    throw error;
  }
}

/**
 * Complete integration test
 */
async function runCompleteTest() {
  console.log("🚀 InstaTool Services Integration Test\n");
  console.log("=".repeat(50));

  try {
    // Test image generation
    const imageBuffers = await testImageGeneration();

    // Test Cloudinary upload (if configured)
    const uploadResults = await testCloudinaryUpload(imageBuffers);

    console.log("\n" + "=".repeat(50));
    console.log("🎉 All tests completed successfully!\n");

    if (uploadResults) {
      console.log("📋 Summary:");
      console.log(
        `   Images generated: ${imageBuffers.carouselBuffers.length + 1}`
      );
      console.log(
        `   Images uploaded: ${uploadResults.carouselUrls.length + 1}`
      );
      console.log("   Ready for production use! ✅");
    } else {
      console.log("📋 Summary:");
      console.log(
        `   Images generated: ${imageBuffers.carouselBuffers.length + 1}`
      );
      console.log("   Upload test skipped (configure Cloudinary)");
      console.log("   Image generation ready! ✅");
    }
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  // Load environment variables
  require("dotenv").config();

  runCompleteTest().catch((error) => {
    console.error("Test execution failed:", error);
    process.exit(1);
  });
}

module.exports = {
  testImageGeneration,
  testCloudinaryUpload,
  runCompleteTest,
  samplePostData,
};
