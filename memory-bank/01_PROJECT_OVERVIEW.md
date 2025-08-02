# 01 - PROJECT OVERVIEW: InstaTool

> **Read this FIRST** - Complete project understanding

## Overview
InstaTool is a MERN stack application that automates Instagram carousel post creation from CSV files with Islamic-themed backgrounds and scheduling capabilities.

## Core Requirements

### 1. CSV-Driven Post Creation
- **Input**: CSV files with structure: `post_title, theme, scheduled_for, page_1_content, page_2_content, etc.`
- **Output**: Multi-page carousel posts for Instagram
- **Content**: Text overlays on themed backgrounds (1080x1080px)
- **Font Support**: CSV field specifies font slug/name or "default"

### 2. Islamic Themes System
- **5 Islamic Themes**: Gold, blue, geometric, calligraphy, modern
- **Visual Elements**: Colors, patterns, Arabic font support, traditional/modern/minimalist styles
- **Static Backgrounds**: Fixed themed backgrounds (no AI generation in MVP)
- **Theme Implementation**:
  - Gold: Linear gradient (#FFD700 → #FFA500)
  - Blue: Linear gradient (#4A90E2 → #7B68EE)
  - Geometric: Linear gradient (#667eea → #764ba2)
  - Calligraphy: Linear gradient (#2E7D32 → #4CAF50)
  - Modern: Linear gradient (#263238 → #37474F)

### 3. Scheduling System
- **Format**: Standard ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
- **Precision**: Year, month, day, hour, minute, second
- **Timezone**: Single timezone (no multi-timezone support)
- **Instagram Integration**: Business/Creator account ready (integration later)

### 4. Database & Storage
- **MongoDB**: Atlas cluster connection provided
- **Project Structure**: One project per CSV file (not per day as originally planned)
- **Credentials**: Store in .env files
- **Models**: Post and Project schemas with proper relationships

### 5. User Interface
- **Canva-Like Editor**: Professional direct editing interface
- **Post Switching**: Seamless switching between posts in editing mode
- **Font Controls**: Dropdown selection with real-time preview
- **Text Formatting**: Bold/italic buttons with proper selection handling
- **Auto-Save**: 1-second debounced automatic saving
- **Responsive Design**: Mobile and desktop optimized

## Technical Stack
- **Frontend**: React + Tailwind CSS v4
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Environment**: dotenv for credentials
- **Development**: Vite (frontend) + Nodemon (backend)

## MVP Features ✅ COMPLETED
1. ✅ CSV file upload and parsing
2. ✅ Carousel post generation with Islamic themes
3. ✅ Post scheduling and storage
4. ✅ Professional editing interface with real-time formatting
5. ✅ MongoDB storage with project-based organization
6. ✅ Font selection and text formatting
7. ✅ Auto-save functionality
8. ✅ Post switching in edit mode

## Current Status: MVP EXCEEDED 🌟

### Working Features
- **CSV Upload**: Drag & drop with real-time validation
- **Post Generation**: 15 posts from test CSV with authentic Islamic themes
- **Professional Editor**: Canva-like interface with direct content editing
- **Text Formatting**: Bold/italic buttons that preserve text selection
- **Font Selection**: Working dropdown with real-time font changes
- **Auto-Save**: Debounced saves to database with visual confirmation
- **Post Switching**: Seamless navigation between posts in edit mode
- **Theme Management**: 5 beautiful Islamic themes with instant switching

## Future Features (Post-MVP)

### High Priority
1. **Image Generation**: Canvas/Sharp integration for 1080x1080 exports
2. **Advanced Formatting**: More text styling options (underline, size presets)
3. **Color Palette**: Full color picker for text and backgrounds
4. **Template System**: Save and reuse post layouts
5. **Export Functionality**: Download posts as PNG/JPG images

### Quality of Life Features
- Bulk operations (delete/reschedule multiple posts)
- Preview mode (Instagram-like preview)
- Analytics (track theme performance)
- Content validation (text length, image requirements)
- Collaboration features (comments/notes)

## User Journey

### Content Creator Workflow
1. **Prepare Content**: Create CSV with Islamic quotes, themes, schedule
2. **Upload**: Drag & drop CSV file to InstaTool
3. **Review**: Browse generated posts in projects grid
4. **Edit**: Click any post to enter professional editing mode
5. **Format**: Use toolbar to apply bold/italic, change fonts, adjust themes
6. **Auto-Save**: Changes save automatically to database
7. **Export**: (Future) Download as images for Instagram posting

### Technical Workflow
1. **CSV Processing**: Parse file → Create posts and project
2. **Database Storage**: Store in MongoDB with proper relationships
3. **Real-Time Editing**: Professional interface with live formatting
4. **Persistent Storage**: Auto-save ensures no data loss

## Constraints
- Single user (no authentication in MVP)
- Text-only content (no images/videos in posts)
- Instagram Business account integration (later phase)
- Standard 1080x1080px images
- Variable carousel length per post (up to 5 pages)

## Success Metrics
- ✅ **User Experience**: Professional editing interface comparable to Canva
- ✅ **Performance**: Real-time editing with 60fps animations
- ✅ **Reliability**: Auto-save prevents data loss
- ✅ **Functionality**: All text formatting works without selection loss
- ✅ **Cultural Sensitivity**: Authentic Islamic themes that respect the content

---

**Status**: MVP completed and exceeded user expectations  
**Quality**: Professional-grade editing experience  
**Architecture**: Scalable, maintainable, and well-documented