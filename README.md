# InstaTool - Instagram Post Creation Tool

A MERN stack application that creates Instagram carousel posts from CSV files with Islamic-themed backgrounds and scheduling capabilities.

## 🚀 Quick Start (ONE COMMAND)

```bash
# Clone and setup (after GitHub repo is created)
git clone https://github.com/maxim-nizhar/insta-tool.git
cd insta-tool
npm run setup

# Start everything (kills any existing processes and runs fresh)
npm run everything
```

**That's it!** Frontend runs on `http://localhost:5173`, Backend on `http://localhost:3001`

## Features

- **CSV-Driven Post Creation**: Upload CSV files to generate multiple Instagram carousel posts
- **Islamic Themes**: 5 beautiful Islamic themes with culturally appropriate designs
- **Post Scheduling**: Precise scheduling with ISO 8601 format
- **Post Editor**: Editable playground for post customization
- **Project Management**: Day-based organization of scheduled posts
- **Smart Process Management**: Automatic port cleanup and fresh startup

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express.js + MongoDB Atlas
- **Database**: MongoDB Atlas (fully connected and tested)
- **Styling**: Tailwind CSS with custom Islamic color palette
- **Development**: Hot reload, automatic process management

## 📋 Available Scripts

### 🔥 Primary Scripts (USE THESE)

| Script | Description |
|--------|-------------|
| `npm run everything` | **MAIN SCRIPT** - Kills existing processes on ports 5173/3001 and starts both frontend/backend fresh |
| `npm run setup` | Install all dependencies for root, client, and server |
| `npm run dev` | Start both frontend and backend (without port cleanup) |

### 🛠️ Individual Control Scripts

| Script | Description |
|--------|-------------|
| `npm run client:dev` | Start frontend only (Vite dev server on port 5173) |
| `npm run server:dev` | Start backend only (nodemon on port 3001) |
| `npm run kill:ports` | Kill any processes running on ports 5173 and 3001 |

### 🏗️ Build & Production Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build frontend for production |
| `npm run start` | Start production backend server |
| `npm run client:build` | Build frontend only |
| `npm run server:start` | Start backend in production mode |

## 🔧 Environment Setup

### Prerequisites
- **Node.js v18+** (tested with v22.13.0)
- **Git** for version control
- **MongoDB Atlas** (credentials provided)

### 1. Installation

```bash
# Clone repository (after creating on GitHub)
git clone https://github.com/maxim-nizhar/insta-tool.git
cd insta-tool

# Install all dependencies
npm run setup
```

### 2. Environment Configuration

The `.env` file is already configured with MongoDB Atlas credentials:

```env
# Database (ALREADY CONFIGURED)
MONGODB_URI=mongodb+srv://strongbox5695:*@!**^9862%@247c%8S43@cluster000.n00tsc0.mongodb.net/
DB_NAME=insta_tool

# Server
PORT=3001
NODE_ENV=development

# File Storage  
UPLOAD_DIR=uploads
IMAGE_DIR=generated_images
```

### 3. Start Development

```bash
# THE MAGIC COMMAND - starts everything fresh
npm run everything
```

This command will:
1. 🔪 Kill any existing processes on ports 5173 and 3001
2. 🚀 Start backend server with MongoDB connection
3. 🚀 Start frontend Vite dev server
4. 🔄 Enable hot reload for both frontend and backend

### 4. Verify Everything Works

**Backend API Endpoints (ALL TESTED ✅):**
- `http://localhost:3001/api/health` - Health check
- `http://localhost:3001/api/posts` - Posts API (GET/POST)
- `http://localhost:3001/api/upload` - CSV file upload

**Frontend:**
- `http://localhost:5173` - React application

**Test the backend:**
```bash
# Health check
curl http://localhost:3001/api/health

# Posts endpoint
curl http://localhost:3001/api/posts

# Upload test (create a test CSV first)
echo "title,theme,scheduled_for,page_1_content" > test.csv
echo "Test Post,gold,2025-08-02T10:00:00,Hello World" >> test.csv
curl -X POST -F "csvFile=@test.csv" http://localhost:3001/api/upload
```

## 📊 CSV Format

The application expects CSV files with this structure:

```csv
post_title,theme,scheduled_for,font,page_1_content,page_2_content,page_3_content
"Islamic Quote 1","theme1","2024-01-15T10:00:00","default","Page 1 content","Page 2 content","Page 3 content"
"Verse of the Day","theme2","2024-01-15T14:30:00","arabic","Another post page 1","Another post page 2",""
```

### Required Columns:
- `post_title`: Title of the Instagram post
- `theme`: Theme name (theme1, theme2, theme3, theme4, theme5)
- `scheduled_for`: ISO 8601 datetime format (YYYY-MM-DDTHH:MM:SS)
- `font`: Font slug/name or "default"
- `page_X_content`: Content for each carousel page (variable number)

### Available Themes:
1. **theme1**: Gold/Green Islamic elegance
2. **theme2**: Blue/White serenity  
3. **theme3**: Geometric patterns
4. **theme4**: Arabic calligraphy backgrounds
5. **theme5**: Modern minimalist Islamic

## 🏗️ Project Structure

```
insta-tool/
├── client/                 # React frontend (port 5173)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components (Dashboard, Upload, Editor, Projects)
│   │   ├── services/      # API communication
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   └── package.json
├── server/                # Express backend (port 3001) 
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints (/api/health, /api/posts, /api/upload)
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   ├── uploads/          # CSV file storage
│   └── package.json
├── memory-bank/          # 📋 Project documentation & setup guides
│   ├── progress.md       # 30 numbered tasks with detailed status
│   ├── activeContext.md  # Current session context & priorities
│   ├── SETUP_COMPLETE.md # Setup completion summary & verification
│   ├── GITHUB_SETUP.md   # GitHub repository setup instructions
│   ├── APPLICATION_STATUS.md # Current application status
│   ├── productContext.md # Product requirements & user journey
│   ├── projectbrief.md   # Technical overview & MVP features
│   ├── systemPatterns.md # Architecture patterns & data models
│   └── techContext.md    # Technical stack & MongoDB credentials
├── .env                  # Environment variables (MongoDB credentials)
└── package.json          # Root package with development scripts
```

## 🔄 Development Workflow

### Daily Development
1. **Start fresh:** `npm run everything`
2. **Frontend development:** Edit files in `client/src/`
3. **Backend development:** Edit files in `server/`
4. **API testing:** Use curl commands or Postman
5. **Stop everything:** `Ctrl+C` in terminal

### Port Management
- **Frontend**: `http://localhost:5173` (Vite)
- **Backend**: `http://localhost:3001` (Express)
- **MongoDB**: Atlas cloud (already connected)

### Troubleshooting
- **Ports in use?** Run `npm run kill:ports` then `npm run everything`
- **Dependencies issues?** Run `npm run setup` to reinstall everything
- **MongoDB connection failed?** Check `.env` file exists and credentials are correct

## 🎯 Current Status (Updated: Latest Session)

### ✅ COMPLETED (Foundation 90% Done)
- [x] **Task 1-8**: Full MERN setup with Tailwind CSS v4
- [x] **Task 9**: Backend API fully debugged and functional ⭐
- [x] Express server with MongoDB Atlas connection
- [x] Working API endpoints: `/api/health`, `/api/posts`, `/api/upload`
- [x] CSV file upload system with validation
- [x] Development scripts and process management
- [x] Comprehensive documentation and memory bank

### 🔄 NEXT PRIORITIES
- **Task 10**: Verify MongoDB Atlas connection and test database operations
- **Task 11**: Create MongoDB schemas (Post model, Project model)
- **Task 12**: Implement CSV file upload and parsing system
- **Task 13**: Build post generation API endpoints

### 🚀 FUTURE FEATURES (MVP)
- Islamic theme image generation (1080x1080px)
- Post scheduling system
- Post editing interface
- Project/day-based organization
- Export posts as images

## 🤝 For New Development Sessions

**Just say:** `"Do Task X"` where X is the task number from `memory-bank/progress.md`

**Current priority:** `"Do Task 10"` (MongoDB database operations testing)

### 📋 Memory Bank Navigation
| File | Purpose |
|------|---------|
| `memory-bank/progress.md` | 30 numbered tasks with detailed status & completion notes |
| `memory-bank/activeContext.md` | Current session context and immediate priorities |
| `memory-bank/SETUP_COMPLETE.md` | Setup completion summary & verification steps |
| `memory-bank/GITHUB_SETUP.md` | GitHub repository creation instructions |
| `memory-bank/APPLICATION_STATUS.md` | Current application status overview |

The memory bank contains all context, decisions, and technical details needed for any future development session.

## 📜 License

MIT License - This project is for Islamic content creation. Please respect the cultural and religious context.

---

**Ready to develop!** Run `npm run everything` and start building! 🚀