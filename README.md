# InstaTool - Instagram Post Creation Tool

A MERN stack application that creates Instagram carousel posts from CSV files with Islamic-themed backgrounds and scheduling capabilities.

## Features

- **CSV-Driven Post Creation**: Upload CSV files to generate multiple Instagram carousel posts
- **Islamic Themes**: 5 beautiful Islamic themes with cultural appropriate designs
- **Post Scheduling**: Precise scheduling with ISO 8601 format
- **Post Editor**: Editable playground for post customization
- **Project Management**: Day-based organization of scheduled posts

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS with custom Islamic color palette

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (credentials provided)
- Git

### Installation

1. **Clone the repository** (after creating it on GitHub):
```bash
git clone https://github.com/maxim-nizhar/insta-tool.git
cd insta-tool
```

2. **Install all dependencies**:
```bash
npm run setup
# This runs: npm install && cd client && npm install && cd ../server && npm install
```

3. **Environment Setup**:
Create `.env` file in the root directory with:
```env
# Database
MONGODB_URI=mongodb+srv://strongbox5695:*@!**^9862%@247c%8S43@cluster000.n00tsc0.mongodb.net/
DB_NAME=insta_tool

# Server
PORT=3001
NODE_ENV=development

# File Storage
UPLOAD_DIR=uploads
IMAGE_DIR=generated_images
```

4. **Start Development Servers**:
```bash
npm run dev
# Starts both frontend (port 5173) and backend (port 3001)
```

### Alternative: Start Servers Individually

**Frontend only:**
```bash
npm run client:dev
```

**Backend only:**
```bash
npm run server:dev
```

## CSV Format

The application expects CSV files with the following structure:

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

## Project Structure

```
insta-tool/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── services/      # API communication
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── package.json
├── memory-bank/          # Project documentation
└── package.json          # Root package with scripts
```

## Available Scripts

### Root Level
- `npm run setup` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm start` - Start production server

### Frontend (client/)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (server/)
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server

## Current Status

### ✅ Completed
- [x] Project structure setup (MERN + Tailwind)
- [x] Tailwind CSS v4 configuration with Islamic themes
- [x] Basic React components and routing
- [x] Express server with MongoDB connection
- [x] Development environment setup

### 🔄 In Progress
- [ ] Testing application startup and connectivity

### 📋 Next Steps (MVP)
1. CSV file upload and parsing
2. Islamic theme image generation
3. Post scheduling system  
4. MongoDB data models
5. Post editing interface

### 🚀 Future Features
- Export posts as images
- Duplicate post prevention
- Draft mode
- Bulk operations
- Instagram API integration

## Contributing

This is a personal project for Islamic content creation. Please respect the cultural and religious context when contributing.

## License

MIT License - see LICENSE file for details.