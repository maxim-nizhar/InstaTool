# Project Brief: InstaTool

## Overview
InstaTool is a MERN stack application that automates Instagram carousel post creation from CSV files with Islamic-themed backgrounds and scheduling capabilities.

## Core Requirements

### 1. CSV-Driven Post Creation
- **Input**: CSV files with structure: `post_title, theme, scheduled_for, page_1_content, page_2_content, etc.`
- **Output**: Multi-page carousel posts for Instagram
- **Content**: Text overlays on themed backgrounds (1080x1080px)
- **Font Support**: CSV field specifies font slug/name or "default"

### 2. Islamic Themes System
- **5 Islamic Themes**: Gold/green, blue/white, geometric patterns, calligraphy backgrounds
- **Visual Elements**: Colors, patterns, Arabic font support, traditional/modern/minimalist styles
- **Static Backgrounds**: Fixed themed backgrounds (no AI generation in MVP)

### 3. Scheduling System
- **Format**: Standard ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
- **Precision**: Year, month, day, hour, minute, second
- **Timezone**: Single timezone (no multi-timezone support)
- **Instagram Integration**: Business/Creator account ready (integration later)

### 4. Database & Storage
- **MongoDB**: Cluster connection provided
- **Project Structure**: Each day = project, contains all posts scheduled for that day
- **Credentials**: Store in .env files

### 5. User Interface
- **Editable Playground**: Post-CSV upload editing interface
- **Post Switching**: Clear UI to switch between generated posts
- **Day Selection**: View all posts scheduled for specific day

## Technical Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Environment**: dotenv for credentials

## MVP Features
1. CSV file upload and parsing
2. Carousel post generation with Islamic themes
3. Post scheduling
4. Basic editing interface
5. MongoDB storage with day-based projects

## Future Features (Post-MVP)
### High Priority
1. **Backup/Export**: Export posts as images
2. **Duplicate Protection**: Prevent accidental duplicate posts  
3. **Draft Mode**: Save work-in-progress posts

### Other Quality of Life Features
- Bulk operations (delete/reschedule multiple posts)
- Preview mode (Instagram-like preview)
- Template library (save successful designs)
- Analytics (track theme performance)
- Content validation (text length, image requirements)
- Collaboration features (comments/notes)

## Constraints
- Single user (no authentication in MVP)
- Text-only content (no images/videos)
- Instagram Business account integration (later phase)
- Standard 1080x1080px images
- Variable carousel length per post (up to 10 pages)