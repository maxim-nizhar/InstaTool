const sharp = require("sharp");
const path = require("path");

// Font configurations for different Islamic themes
const THEME_CONFIGS = {
  gold: {
    background: "linear-gradient(135deg, #FFD700, #FFA500)",
    textColor: "#000000",
    fontWeight: 600,
  },
  blue: {
    background: "linear-gradient(135deg, #4A90E2, #7B68EE)",
    textColor: "#FFFFFF",
    fontWeight: 600,
  },
  geometric: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    textColor: "#FFFFFF",
    fontWeight: 700,
  },
  calligraphy: {
    background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
    textColor: "#FFFFFF",
    fontWeight: 600,
  },
  modern: {
    background: "linear-gradient(135deg, #263238, #37474F)",
    textColor: "#FFFFFF",
    fontWeight: 500,
  },
};

// Font family mappings
const FONT_FAMILIES = {
  "Canva Sans": "Arial", // Fallback to Arial for server-side rendering
  Arial: "Arial",
  "Times New Roman": "Times",
  default: "Arial",
};

/**
 * Creates a gradient background using Sharp
 * @param {string} theme - The theme name
 * @returns {Buffer} - SVG buffer for the gradient background
 */
const createGradientBackground = (theme) => {
  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.modern;

  // Extract gradient colors from the CSS gradient string
  const gradientMatch = config.background.match(
    /linear-gradient\(135deg,\s*(#[A-Fa-f0-9]{6}),\s*(#[A-Fa-f0-9]{6})\)/
  );
  const startColor = gradientMatch ? gradientMatch[1] : "#263238";
  const endColor = gradientMatch ? gradientMatch[2] : "#37474F";

  // Create SVG gradient
  const svgGradient = `
    <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${endColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1080" fill="url(#grad)"/>
    </svg>
  `;

  return Buffer.from(svgGradient);
};

/**
 * Creates an SVG text element with proper formatting
 * @param {string} content - The text content (HTML string)
 * @param {string} theme - The theme name
 * @param {string} font - The font family
 * @returns {string} - SVG text markup
 */
const createTextSVG = (content, theme, font = "Arial") => {
  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.modern;
  const fontFamily = FONT_FAMILIES[font] || FONT_FAMILIES.default;

  // Strip HTML tags and convert basic formatting
  let textContent = content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<[^>]*>/g, "") // Remove any remaining HTML tags
    .trim();

  // Handle bold and italic formatting
  const isBold =
    content.includes("<b>") ||
    content.includes("<strong>") ||
    content.includes("font-weight: bold");
  const isItalic =
    content.includes("<i>") ||
    content.includes("<em>") ||
    content.includes("font-style: italic");

  // Calculate font size based on content length for optimal fit
  const baseSize = 48;
  const maxLength = 200;
  const fontSize = Math.max(
    28,
    Math.min(baseSize, baseSize - (textContent.length / maxLength) * 20)
  );

  // Split text into lines for better positioning
  const lines = textContent.split("\n").filter((line) => line.trim());
  const lineHeight = fontSize * 1.4;
  const totalHeight = lines.length * lineHeight;
  const startY = (1080 - totalHeight) / 2 + fontSize;

  // Create SVG text elements for each line
  const textElements = lines
    .map((line, index) => {
      const y = startY + index * lineHeight;
      const weight = isBold ? config.fontWeight + 100 : config.fontWeight;
      const style = isItalic ? "italic" : "normal";

      return `
      <text 
        x="540" 
        y="${y}" 
        text-anchor="middle" 
        font-family="${fontFamily}" 
        font-size="${fontSize}" 
        font-weight="${weight}"
        font-style="${style}"
        fill="${config.textColor}"
        dominant-baseline="middle"
      >${line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</text>
    `;
    })
    .join("");

  return textElements;
};

/**
 * Generates a single 1080x1080 Instagram post image from page data
 * @param {Object} pageData - Page data containing content, theme, and font
 * @param {string} pageData.content - HTML content for the page
 * @param {string} pageData.theme - Theme name
 * @param {string} pageData.font - Font family
 * @returns {Promise<Buffer>} - Image buffer for the rendered page
 */
const generatePageImage = async (pageData) => {
  try {
    const { content, theme = "modern", font = "Arial" } = pageData;

    if (!content || content.trim() === "") {
      throw new Error("Page content cannot be empty");
    }

    // Create gradient background
    const backgroundSvg = createGradientBackground(theme);

    // Create text overlay
    const textSvg = createTextSVG(content, theme, font);

    // Combine background and text into complete SVG
    const completeSvg = `
      <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${
              THEME_CONFIGS[theme]?.background.match(/#[A-Fa-f0-9]{6}/g)?.[0] ||
              "#263238"
            };stop-opacity:1" />
            <stop offset="100%" style="stop-color:${
              THEME_CONFIGS[theme]?.background.match(/#[A-Fa-f0-9]{6}/g)?.[1] ||
              "#37474F"
            };stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1080" height="1080" fill="url(#grad)"/>
        <g transform="translate(40, 0)">
          ${textSvg}
        </g>
      </svg>
    `;

    // Convert SVG to image buffer using Sharp
    const imageBuffer = await sharp(Buffer.from(completeSvg))
      .png()
      .resize(1080, 1080, {
        fit: "cover",
        position: "center",
      })
      .toBuffer();

    return imageBuffer;
  } catch (error) {
    console.error("Page image generation error:", error);
    throw new Error(`Failed to generate page image: ${error.message}`);
  }
};

/**
 * Generates an array of image buffers for all pages of a carousel post
 * @param {Object} postData - Complete post data with theme, fonts, and content
 * @param {string} postData.theme - Theme for the entire post
 * @param {string} postData.font - Font family for the entire post
 * @param {Array} postData.pages - Array of page objects with content
 * @returns {Promise<Array<Buffer>>} - Array of image buffers, one for each page
 */
const generateCarouselImages = async (postData) => {
  try {
    const { theme = "modern", font = "Arial", pages = [] } = postData;

    if (!pages || pages.length === 0) {
      throw new Error("Post data must contain at least one page");
    }

    // Validate pages data
    const validPages = pages.filter(
      (page) =>
        page &&
        typeof page === "object" &&
        page.content &&
        page.content.trim() !== ""
    );

    if (validPages.length === 0) {
      throw new Error("No valid pages found with content");
    }

    // Generate images for all pages in parallel
    const imagePromises = validPages.map((page) => {
      const pageWithDefaults = {
        content: page.content,
        theme: page.theme || theme, // Allow per-page theme override
        font: page.font || font, // Allow per-page font override
      };
      return generatePageImage(pageWithDefaults);
    });

    const imageBuffers = await Promise.all(imagePromises);

    console.log(
      `Successfully generated ${imageBuffers.length} carousel images`
    );
    return imageBuffers;
  } catch (error) {
    console.error("Carousel image generation error:", error);
    throw new Error(`Failed to generate carousel images: ${error.message}`);
  }
};

/**
 * Utility function to get image dimensions
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<Object>} - Width and height
 */
const getImageDimensions = async (imageBuffer) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    throw new Error(`Failed to get image dimensions: ${error.message}`);
  }
};

/**
 * Optimizes image buffer for Instagram (JPEG with quality optimization)
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {number} quality - JPEG quality (1-100)
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
const optimizeForInstagram = async (imageBuffer, quality = 85) => {
  try {
    return await sharp(imageBuffer)
      .jpeg({ quality, progressive: true })
      .resize(1080, 1080, {
        fit: "cover",
        position: "center",
      })
      .toBuffer();
  } catch (error) {
    throw new Error(`Failed to optimize image: ${error.message}`);
  }
};

module.exports = {
  generatePageImage,
  generateCarouselImages,
  getImageDimensions,
  optimizeForInstagram,
  THEME_CONFIGS,
  FONT_FAMILIES,
};
