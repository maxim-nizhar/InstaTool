# Active Context: InstaTool

## Current Focus
🎉 **MVP CORE FUNCTIONALITY COMPLETE!** CSV processing system fully implemented and working end-to-end. **Tasks 9, 10, 11, 12 COMPLETED**

## Recent Major Achievements
- ✅ **Task 12 COMPLETED**: Full CSV processing system implemented
- ✅ **Task 11 COMPLETED**: MongoDB models (Post, Project) created and working
- ✅ **Task 10 COMPLETED**: Database operations tested and functional
- ✅ **Projects Page**: Fully functional with real data display
- ✅ **Project Logic Fixed**: One project per CSV file (not multiple by date)
- ✅ **Frontend-Backend Integration**: Complete API integration working
- ✅ **Database Cleanup**: Duplicate data removed, clean slate
- ✅ **End-to-End Flow**: CSV upload → Processing → Database → Display working perfectly

## Current System Status
- **Upload**: ✅ CSV files upload and parse correctly
- **Processing**: ✅ 15 Islamic posts created from test CSV
- **Database**: ✅ Posts and Projects stored in MongoDB Atlas
- **Display**: ✅ Projects page shows real data with beautiful UI
- **Navigation**: ✅ Full app navigation working
- **API**: ✅ All endpoints functional (/api/health, /api/posts, /api/upload, /api/posts/projects)

## Next Phase Priorities
1. **Islamic Theme Implementation** - Design and implement 5 visual themes
2. **Image Generation** - Canvas/Sharp integration for 1080x1080 post images
3. **Scheduling System** - Background jobs for automatic posting
4. **GitHub Repository** - Follow memory-bank/GITHUB_SETUP.md instructions (user manual task)
5. **Post Editor** - Individual post editing interface

## Key Decisions Made
- **CSV Format**: ✅ `post_title, theme, scheduled_for, font, page_1_content, page_2_content` etc.
- **Image Size**: 1080x1080px Instagram standard
- **Scheduling**: ISO 8601 format, single timezone
- **Database Structure**: ✅ **UPDATED** - One project per CSV file, posts grouped by project
- **Theme System**: 5 Islamic themes (gold, blue, geometric, calligraphy, modern)
- **Project Naming**: ✅ Projects named after CSV filename (e.g., `test_posts.csv` → `test_posts` project)

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

## MVP Implementation Status
- [x] **Foundation Setup** - Complete MERN stack with Tailwind
- [x] **Backend API System** - All endpoints functional and tested
- [x] **MongoDB Integration** - Models, connection, CRUD operations working
- [x] **CSV Processing Engine** - Full upload, parse, and post generation
- [x] **Frontend Components** - Upload, Projects, Dashboard, Navigation
- [x] **Data Models** - Post and Project schemas implemented
- [x] **Project Management** - One project per CSV with proper organization
- [x] **API Integration** - Frontend-backend communication complete
- [x] **Database Operations** - Create, Read operations tested and working
- [x] **Error Handling** - Proper validation and user feedback
- [x] **Real-time Updates** - Projects page displays live data
- [x] **Memory Bank Documentation** - Comprehensive system documentation

## Outstanding Tasks
- [ ] **GitHub Repository** - Manual user task (instructions in GITHUB_SETUP.md)
- [ ] **Islamic Theme Design** - 5 visual theme implementations
- [ ] **Image Generation** - Canvas/Sharp integration for post images
- [ ] **Scheduling System** - Background job queue for automatic posting
- [ ] **Post Editor Interface** - Individual post editing functionality

## For Next Session
🎯 **MVP CORE IS COMPLETE!** Next priorities:
1. **Say "Implement Islamic themes"** - Design visual themes for post generation
2. **Say "Create image generation"** - Build Canvas/Sharp system for 1080x1080 images
3. **Say "Add scheduling system"** - Implement background job queue for posting
4. **Say "Build post editor"** - Individual post editing interface

## 🚀 Current System Commands
**Start Application:** `npm run everything` (kills ports and starts both servers)
**Test CSV Upload:** Use the provided `test_posts.csv` file
**View Projects:** Navigate to http://localhost:5173/projects
**Clean Database:** `curl -X DELETE http://localhost:3001/api/posts/cleanup`

## 🎉 Working Features
- ✅ CSV upload with drag & drop
- ✅ Real-time post creation (15 posts from test CSV)
- ✅ Project management (one project per CSV file)
- ✅ Beautiful Projects page with post previews
- ✅ Theme categorization (gold, blue, geometric, calligraphy, modern)
- ✅ Multi-page carousel support (up to 5 pages per post)
- ✅ MongoDB data persistence
- ✅ Complete MERN stack integration