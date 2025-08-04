const axios = require('axios');

class InstagramAPIService {
  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    this.businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    this.facebookPageId = process.env.FACEBOOK_PAGE_ID;
    this.baseURL = 'https://graph.facebook.com/v23.0';
    
    if (!this.accessToken || !this.businessAccountId) {
      console.warn('Instagram API credentials not configured. Check your .env file.');
    }
  }

  /**
   * Test Instagram API connection
   */
  async testConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/${this.businessAccountId}`, {
        params: {
          fields: 'username,name,biography,followers_count,media_count',
          access_token: this.accessToken
        }
      });
      
      console.log('✅ Instagram API Connection Test Successful');
      console.log('Account Info:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Instagram API Connection Test Failed:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Create a media container (single image)
   */
  async createMediaContainer(imageUrl, caption = '') {
    try {
      const response = await axios.post(`${this.baseURL}/${this.businessAccountId}/media`, {
        image_url: imageUrl,
        caption: caption,
        access_token: this.accessToken
      });

      console.log('✅ Media container created:', response.data.id);
      return { success: true, containerId: response.data.id };
    } catch (error) {
      console.error('❌ Failed to create media container:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Create a carousel media container (multiple images)
   */
  async createCarouselContainer(imageUrls, caption = '') {
    try {
      console.log(`📸 Creating carousel with ${imageUrls.length} images...`);
      
      // Step 1: Create individual media containers for each image
      const containerPromises = imageUrls.map(async (imageUrl, index) => {
        console.log(`📷 Creating container ${index + 1}/${imageUrls.length}: ${imageUrl}`);
        
        const response = await axios.post(`${this.baseURL}/${this.businessAccountId}/media`, {
          image_url: imageUrl,
          is_carousel_item: true,
          access_token: this.accessToken
        });
        
        console.log(`✅ Container ${index + 1} created: ${response.data.id}`);
        return response.data.id;
      });

      const containerIds = await Promise.all(containerPromises);
      console.log('🎯 All containers created:', containerIds);

      // Step 2: Create the carousel container
      const carouselResponse = await axios.post(`${this.baseURL}/${this.businessAccountId}/media`, {
        media_type: 'CAROUSEL',
        children: containerIds.join(','),
        caption: caption,
        access_token: this.accessToken
      });

      console.log('🎠 Carousel container created:', carouselResponse.data.id);
      
      return {
        success: true,
        carouselContainerId: carouselResponse.data.id,
        individualContainerIds: containerIds
      };
    } catch (error) {
      console.error('❌ Failed to create carousel container:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Check media container status
   */
  async checkContainerStatus(containerId) {
    try {
      const response = await axios.get(`${this.baseURL}/${containerId}`, {
        params: {
          fields: 'status_code,status',
          access_token: this.accessToken
        }
      });

      return {
        success: true,
        status: response.data.status_code,
        statusText: response.data.status
      };
    } catch (error) {
      console.error('❌ Failed to check container status:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Publish media container to Instagram
   */
  async publishMedia(containerId) {
    try {
      // Check if container is ready first
      const statusCheck = await this.checkContainerStatus(containerId);
      if (!statusCheck.success) {
        return statusCheck;
      }

      // Wait for container to be ready if needed
      if (statusCheck.status !== 'FINISHED') {
        console.log('⏳ Waiting for media container to be processed...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        // Check again
        const secondCheck = await this.checkContainerStatus(containerId);
        if (!secondCheck.success || secondCheck.status !== 'FINISHED') {
          return { 
            success: false, 
            error: `Media container not ready. Status: ${secondCheck.status || 'unknown'}` 
          };
        }
      }

      // Publish the media
      const response = await axios.post(`${this.baseURL}/${this.businessAccountId}/media_publish`, {
        creation_id: containerId,
        access_token: this.accessToken
      });

      console.log('🚀 Media published successfully! Post ID:', response.data.id);
      
      return {
        success: true,
        postId: response.data.id,
        message: 'Media published successfully to Instagram'
      };
    } catch (error) {
      console.error('❌ Failed to publish media:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Complete workflow: Post single image to Instagram
   */
  async postSingleImage(imageUrl, caption = '') {
    try {
      console.log('🔄 Starting single image post workflow...');
      
      // Step 1: Create container
      const containerResult = await this.createMediaContainer(imageUrl, caption);
      if (!containerResult.success) {
        return containerResult;
      }

      // Step 2: Publish
      const publishResult = await this.publishMedia(containerResult.containerId);
      
      return {
        success: publishResult.success,
        postId: publishResult.postId,
        containerId: containerResult.containerId,
        error: publishResult.error
      };
    } catch (error) {
      console.error('❌ Single image post workflow failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Complete workflow: Post carousel to Instagram
   */
  async postCarousel(imageUrls, caption = '') {
    try {
      console.log('🔄 Starting carousel post workflow...');
      
      // Validate input
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        return { success: false, error: 'Invalid image URLs array' };
      }

      if (imageUrls.length > 10) {
        return { success: false, error: 'Instagram carousel supports maximum 10 images' };
      }

      // Step 1: Create carousel container
      const containerResult = await this.createCarouselContainer(imageUrls, caption);
      if (!containerResult.success) {
        return containerResult;
      }

      // Step 2: Publish carousel
      const publishResult = await this.publishMedia(containerResult.carouselContainerId);
      
      return {
        success: publishResult.success,
        postId: publishResult.postId,
        carouselContainerId: containerResult.carouselContainerId,
        individualContainerIds: containerResult.individualContainerIds,
        error: publishResult.error
      };
    } catch (error) {
      console.error('❌ Carousel post workflow failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get Instagram account info
   */
  async getAccountInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/${this.businessAccountId}`, {
        params: {
          fields: 'username,name,biography,profile_picture_url,followers_count,media_count,website',
          access_token: this.accessToken
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to get account info:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Get recent Instagram posts
   */
  async getRecentPosts(limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.businessAccountId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp',
          limit: limit,
          access_token: this.accessToken
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to get recent posts:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }
}

module.exports = InstagramAPIService;