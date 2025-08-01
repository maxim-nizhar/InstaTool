# Active Context: InstaTool

## Current Focus
MERN stack foundation 90% complete. **Task 9 COMPLETED** - Backend API fully functional. Ready for database operations and CSV processing.

## Recent Discoveries & Achievements
- ✅ **Task 9 COMPLETED**: Backend API responses fully debugged and working
- ✅ MongoDB Atlas connection successful (password encoding issue resolved)
- ✅ All API endpoints operational: /api/health, /api/posts, /api/upload
- ✅ CSV upload system configured and tested
- ✅ "npm run everything" script created for easy development startup
- CSV structure confirmed: `post_title, theme, scheduled_for, page_1_content, page_2_content, etc.`
- 5 Islamic themes required with visual variety
- Text-only content with themed backgrounds
- Single user MVP, authentication later
- GitHub repo needs to be created manually: `insta-tool` under `maxim-nizhar`

## Next Immediate Steps (For Next Session)
1. **Task 10: Verify MongoDB Atlas** - Test database operations and CRUD functionality
2. **Task 11: Create Schemas** - Build Post and Project MongoDB models  
3. **Task 12: CSV Processing** - Implement CSV parsing and post generation
4. **Create GitHub Repository** - Follow memory-bank/GITHUB_SETUP.md instructions (user manual task)
5. **Test Full Flow** - Verify "npm run everything" works perfectly

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
- [x] Memory Bank documentation complete and updated with Task 9 details
- [x] Project structure initialized (MERN + folders)  
- [x] Dependencies installed (React, Express, MongoDB, Tailwind, kill-port)
- [x] Tailwind CSS v4 configured with Islamic themes
- [x] Basic React components created (Navbar, Dashboard, Upload, Editor, Projects)
- [x] Express server setup with MongoDB connection string
- [x] README.md completely updated with detailed instructions
- [x] Git repository initialized with initial commit
- [x] .env file created with MongoDB Atlas credentials
- [x] Port conflicts resolved (backend moved to 3001, frontend on 5173)
- [x] APPLICATION_STATUS.md and GITHUB_SETUP.md created (organized in memory-bank/)
- [x] Progress.md updated with Task 9 completion details
- [x] **"npm run everything" script created** - kills ports and starts both servers
- [x] **Backend API fully debugged and functional** (Task 9 COMPLETE)
- [x] **MongoDB Atlas connection tested and working**
- [x] **API endpoints verified**: /api/health, /api/posts, /api/upload
- [x] **CSV upload system configured and tested**
- [ ] GitHub repo created (manual user task - instructions provided)
- [ ] MongoDB database operations tested (Task 10)
- [ ] Tailwind CSS visual rendering verified (Task 14)

## For Next Session
**Simply say "Do Task 10" to test database operations or "Do Task 11" to create MongoDB schemas**

## 🚀 Quick Start Command
**From project root:** `npm run everything` - This will kill any processes on ports 5173/3001 and start both frontend and backend fresh!