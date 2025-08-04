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

// Font family mappings - match frontend exactly
const FONT_FAMILIES = {
  "Canva Sans": "system-ui, -apple-system, BlinkMacSystemFont, sans-serif", // Match frontend
  Arial: "Arial, sans-serif",
  "Times New Roman": "Times, serif",
  default: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
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
 * Estimates text width for SVG text element
 * @param {string} text - The text content
 * @param {number} fontSize - Font size in pixels
 * @param {string} fontFamily - Font family
 * @param {number} fontWeight - Font weight
 * @returns {number} Estimated width in pixels
 */
const estimateTextWidth = (
  text,
  fontSize,
  fontFamily = "Arial",
  fontWeight = 400
) => {
  // Character width multipliers (approximate)
  const charWidths = {
    Arial: 0.52,
    Times: 0.48,
    Helvetica: 0.52,
    "system-ui": 0.52,
  };

  const baseWidth = charWidths[fontFamily] || 0.52;
  const weightMultiplier = fontWeight >= 600 ? 1.1 : 1.0;

  return text.length * fontSize * baseWidth * weightMultiplier;
};

/**
 * Wraps text to fit within specified width
 * @param {string} text - Text to wrap
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} fontSize - Font size
 * @param {string} fontFamily - Font family
 * @param {number} fontWeight - Font weight
 * @returns {string[]} Array of wrapped lines
 */
const wrapText = (
  text,
  maxWidth,
  fontSize,
  fontFamily = "Arial",
  fontWeight = 400
) => {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const lineWidth = estimateTextWidth(
      testLine,
      fontSize,
      fontFamily,
      fontWeight
    );

    if (lineWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Single word is too long, force it onto a line
        lines.push(word);
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.filter((line) => line.trim());
};

/**
 * Parses HTML content and extracts formatted text segments
 * @param {string} content - HTML content
 * @returns {Array} Array of text segments with formatting info
 */
const parseFormattedContent = (content) => {
  // Handle common HTML elements while preserving formatting
  let processedContent = content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n")
    .replace(/<div[^>]*>/gi, "");

  const segments = [];
  let currentPos = 0;

  // Regex to match bold, italic, and other formatting tags
  const formatRegex = /<(b|strong|i|em|u)[^>]*>(.*?)<\/\1>/gi;
  let match;

  while ((match = formatRegex.exec(processedContent)) !== null) {
    // Add text before the formatted segment
    if (match.index > currentPos) {
      const beforeText = processedContent.slice(currentPos, match.index);
      if (beforeText.trim()) {
        segments.push({
          text: beforeText.trim(),
          bold: false,
          italic: false,
          underline: false,
        });
      }
    }

    // Add the formatted segment
    const tag = match[1].toLowerCase();
    segments.push({
      text: match[2],
      bold: tag === "b" || tag === "strong",
      italic: tag === "i" || tag === "em",
      underline: tag === "u",
    });

    currentPos = match.index + match[0].length;
  }

  // Add remaining text
  if (currentPos < processedContent.length) {
    const remainingText = processedContent.slice(currentPos);
    if (remainingText.trim()) {
      segments.push({
        text: remainingText.trim(),
        bold: false,
        italic: false,
        underline: false,
      });
    }
  }

  // If no formatting found, return the whole content as plain text
  if (segments.length === 0) {
    const plainText = processedContent.replace(/<[^>]*>/g, "").trim();
    if (plainText) {
      segments.push({
        text: plainText,
        bold: false,
        italic: false,
        underline: false,
      });
    }
  }

  return segments;
};

/**
 * Creates an SVG text element with proper formatting and text wrapping
 * @param {string} content - The text content (HTML string)
 * @param {string} theme - The theme name
 * @param {string} font - The font family
 * @returns {string} - SVG text markup
 */
const createTextSVG = (content, theme, font = "Arial") => {
  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.modern;
  const fontFamily = FONT_FAMILIES[font] || FONT_FAMILIES.default;

  // Image dimensions and padding
  const imageWidth = 1080;
  const imageHeight = 1080;
  const padding = 60; // Increased padding for better readability
  const maxTextWidth = imageWidth - padding * 2;

  // Parse formatted content
  const segments = parseFormattedContent(content);
  if (segments.length === 0) return "";

  // Calculate total text length for font sizing
  const totalTextLength = segments.reduce(
    (sum, segment) => sum + segment.text.length,
    0
  );

  // Dynamic font sizing based on content length and image size
  let baseFontSize = 48;
  if (totalTextLength > 300) baseFontSize = 32;
  else if (totalTextLength > 200) baseFontSize = 36;
  else if (totalTextLength > 100) baseFontSize = 42;

  const fontSize = Math.max(24, Math.min(baseFontSize, 54));
  const lineHeight = fontSize * 1.4;

  // Process each segment and wrap text
  const allLines = [];

  segments.forEach((segment) => {
    const weight = segment.bold ? config.fontWeight + 100 : config.fontWeight;
    const wrappedLines = wrapText(
      segment.text,
      maxTextWidth,
      fontSize,
      fontFamily,
      weight
    );

    wrappedLines.forEach((line) => {
      allLines.push({
        text: line,
        bold: segment.bold,
        italic: segment.italic,
        underline: segment.underline,
      });
    });
  });

  // Calculate vertical positioning
  const totalHeight = allLines.length * lineHeight;
  const startY = (imageHeight - totalHeight) / 2 + fontSize * 0.75;

  // Create SVG text elements
  const textElements = allLines
    .map((line, index) => {
      const y = startY + index * lineHeight;
      const x = imageWidth / 2; // Always center horizontally
      const weight = line.bold ? config.fontWeight + 100 : config.fontWeight;
      const style = line.italic ? "italic" : "normal";

      // Handle underline with additional styling
      const underlineElement = line.underline
        ? `<line x1="${
            x - estimateTextWidth(line.text, fontSize, fontFamily, weight) / 2
          }" 
             y1="${y + fontSize * 0.1}" 
             x2="${
               x +
               estimateTextWidth(line.text, fontSize, fontFamily, weight) / 2
             }" 
             y2="${y + fontSize * 0.1}" 
             stroke="${config.textColor}" 
             stroke-width="2"/>`
        : "";

      return `
      ${underlineElement}
      <text 
        x="${x}" 
        y="${y}" 
        text-anchor="middle" 
        font-family="${fontFamily}" 
        font-size="${fontSize}" 
        font-weight="${weight}"
        font-style="${style}"
        fill="${config.textColor}"
        dominant-baseline="middle"
      >${line.text
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
        ${textSvg}
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
