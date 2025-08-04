const cloudinary = require("cloudinary").v2;

// Configure Cloudinary - supports both CLOUDINARY_URL and separate credentials
if (process.env.CLOUDINARY_URL) {
  // Use CLOUDINARY_URL if available (format: cloudinary://api_key:api_secret@cloud_name)
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  // Use separate credentials
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads an image buffer to Cloudinary using the upload_stream method
 * @param {Buffer} imageBuffer - The image data as a buffer
 * @param {Object} options - Optional upload parameters
 * @param {string} options.folder - Cloudinary folder to upload to
 * @param {string} options.public_id - Custom public ID for the image
 * @param {string} options.resource_type - Resource type (image, video, etc.)
 * @returns {Promise<string>} - Returns the secure_url from the upload response
 */
const uploadImageBuffer = async (imageBuffer, options = {}) => {
  try {
    // Validate input
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error("Input must be a valid Buffer");
    }

    if (imageBuffer.length === 0) {
      throw new Error("Image buffer cannot be empty");
    }

    // Set default options
    const uploadOptions = {
      resource_type: "image",
      folder: "insta-tool", // Default folder for organized storage
      quality: "auto:good", // Optimize quality automatically
      format: "jpg", // Convert to JPG for better compression
      ...options, // Allow overriding defaults
    };

    // Create a promise that resolves with the upload result
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Write the buffer to the upload stream
      uploadStream.end(imageBuffer);
    });

    // Return the secure URL from the successful upload
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

/**
 * Uploads multiple image buffers to Cloudinary in parallel
 * @param {Array<Buffer>} imageBuffers - Array of image buffers
 * @param {Object} options - Upload options applied to all images
 * @returns {Promise<Array<string>>} - Array of secure URLs
 */
const uploadMultipleImageBuffers = async (imageBuffers, options = {}) => {
  try {
    if (!Array.isArray(imageBuffers) || imageBuffers.length === 0) {
      throw new Error("imageBuffers must be a non-empty array");
    }

    // Upload all images in parallel
    const uploadPromises = imageBuffers.map((buffer, index) => {
      const bufferOptions = {
        ...options,
        public_id: options.public_id
          ? `${options.public_id}_page_${index + 1}`
          : undefined,
      };
      return uploadImageBuffer(buffer, bufferOptions);
    });

    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw new Error(`Failed to upload multiple images: ${error.message}`);
  }
};

/**
 * Deletes an image from Cloudinary by public ID
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
  }
};

module.exports = {
  uploadImageBuffer,
  uploadMultipleImageBuffers,
  deleteImage,
  cloudinary, // Export the configured cloudinary instance
};
