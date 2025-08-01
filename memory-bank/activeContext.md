# Active Context: InstaTool

## Current Focus
Setting up MERN stack project structure with Tailwind CSS for Instagram carousel post creation tool.

## Recent Discoveries
- User has MongoDB Atlas credentials ready
- CSV structure defined: `post_title, theme, scheduled_for, page_1_content, page_2_content, etc.`
- 5 Islamic themes required with visual variety
- Text-only content with themed backgrounds
- Single user MVP, authentication later
- GitHub repo needs to be created manually: `insta-tool` under `maxim-nizhar`

## Next Immediate Steps
1. **Create project structure** - MERN setup with proper folder organization
2. **Install dependencies** - React, Express, MongoDB, Tailwind
3. **Configure Tailwind** - Ensure proper setup with Islamic color scheme
4. **Set up environment** - .env files with MongoDB credentials
5. **Create basic components** - File upload, post editor, project view

## Key Decisions Made
- **CSV Format**: `post_title, theme, scheduled_for, page_1_content, page_2_content` etc.
- **Image Size**: 1080x1080px Instagram standard
- **Scheduling**: ISO 8601 format, single timezone
- **Database Structure**: Day-based projects containing posts
- **Theme System**: 5 fixed Islamic themes with static backgrounds

## Critical Implementation Notes
- **Tailwind Setup**: User specifically mentioned I "always fail" at Tailwind setup - need to be extra careful
- **MongoDB Credentials**: Store in .env, connection string provided
- **Font Support**: CSV field for font selection (slug/name or "default")
- **No Authentication**: Single user MVP, add later

## Project Priorities

### MVP Features (Current Sprint)
1. CSV upload and parsing
2. Post generation with Islamic themes  
3. Basic scheduling system
4. Post editing interface
5. Day-based project organization

### High Priority Post-MVP
1. Backup/Export posts as images
2. Duplicate protection
3. Draft mode

### Future Quality of Life Features
- Bulk operations (delete/reschedule multiple)
- Preview mode (Instagram-like)
- Template library
- Analytics tracking
- Content validation
- Collaboration features

## Technical Constraints
- MERN stack + Tailwind required
- MongoDB Atlas connection provided
- dotenv for credentials
- Package.json with multiple scripts
- Instagram Business API integration (future)

## User Preferences
- Prefers text overlays on themed backgrounds
- Islamic aesthetic with cultural appropriateness
- Batch workflow for efficiency
- Clear UI for post management
- Precise scheduling capabilities

## Questions Resolved
- CSV structure ✓
- Content type (text only) ✓  
- Theme requirements (5 Islamic themes) ✓
- Image specifications (1080x1080) ✓
- Authentication (none for MVP) ✓
- Scheduling format (ISO 8601) ✓
- Database credentials ✓

## Environment Setup Status
- [x] Memory Bank documentation complete
- [x] Project structure initialized (MERN + folders)
- [x] Dependencies installed (React, Express, MongoDB, Tailwind)
- [x] Tailwind CSS v4 configured with Islamic themes
- [x] Basic React components created (Navbar, Dashboard, Upload, Editor, Projects)
- [x] Express server setup with MongoDB connection string
- [x] README.md with setup instructions created
- [ ] GitHub repo created (manual user task)
- [ ] Development servers tested and running
- [ ] MongoDB connection verified