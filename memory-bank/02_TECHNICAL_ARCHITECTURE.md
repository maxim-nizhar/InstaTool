# 02 - TECHNICAL ARCHITECTURE: InstaTool

> **Read after Project Overview** - Complete technical implementation details

## Technology Stack

### Frontend (React + Tailwind)
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS v4 with custom Islamic theme colors
- **State Management**: React Context + useState/useEffect
- **Development**: Vite for fast hot reload
- **Routing**: React Router DOM for navigation
- **Port**: 5173 (Vite default)

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB Atlas with Mongoose ODM
- **File Processing**: Multer for uploads, csv-parser for processing
- **Environment**: dotenv for secure credential management
- **Development**: Nodemon for automatic restarts
- **Port**: 3001 (configured)

### Database (MongoDB Atlas)
- **Primary**: MongoDB Atlas cloud database
- **Connection**: mongoose with optimized connection pooling
- **Cluster**: cluster000.n00tsc0.mongodb.net
- **Credentials**: Securely stored in .env file
- **Models**: Post and Project schemas with proper relationships

## Architecture Patterns

### Client-Server Pattern
```
Frontend (React + Tailwind) ↔ Backend (Node.js + Express) ↔ Database (MongoDB)
```

### Data Flow Architecture
1. **CSV Upload Flow**: Upload → Parse → Validate → Create Posts → Store → Display
2. **Editing Flow**: Select Post → Edit Content → Auto-Save → Update Database
3. **Rendering Flow**: Fetch Posts → Apply Themes → Render Preview → User Interaction

### Component Architecture

#### Frontend Components
- **UploadInterface**: Drag & drop CSV upload with validation
- **PostEditor**: Professional Canva-like editing interface
- **ProjectView**: Grid layout for post browsing and selection  
- **PreviewSystem**: Authentic Instagram post preview
- **Navbar**: Responsive navigation with editing mode adaptation

#### Backend Services
- **CSVProcessor**: Parse and validate CSV files
- **PostService**: CRUD operations for posts
- **ProjectService**: Project management and organization
- **DatabaseService**: MongoDB connection and query optimization

## Data Models

### Post Schema (Enhanced)
```javascript
{
  _id: ObjectId,
  post_title: String,
  theme: String, // 'gold', 'blue', 'geometric', 'calligraphy', 'modern'
  scheduled_for: Date,
  font: String, // Font selection from dropdown
  pages: [{
    page_number: Number,
    content: String
  }],
  project_id: ObjectId, // Reference to Project
  status: String, // 'draft', 'scheduled', 'published', 'failed'
  image_urls: [{
    page_number: Number,
    url: String
  }],
  created_at: Date,
  updated_at: Date
}
```

### Project Schema (Optimized)
```javascript
{
  _id: ObjectId,
  name: String, // CSV filename (e.g., "test_posts")
  total_posts: Number,
  created_at: Date,
  updated_at: Date,
  status: String // 'active', 'completed', 'archived'
}
```

## API Architecture

### REST Endpoints (All Working)
```bash
GET  /api/health              # Server health check
GET  /api/posts               # Retrieve all posts with project population
GET  /api/posts/projects      # Retrieve all projects with post data
GET  /api/posts/project/:id   # Get specific project details
GET  /api/posts/:id           # Get individual post for editing
PUT  /api/posts/:id           # Update individual post (for auto-save)
POST /api/upload              # CSV processing with full post generation
DELETE /api/posts/cleanup     # Database cleanup utility
```

### Error Handling Patterns
- **Validation Layer**: Input sanitization and type checking
- **Error Recovery**: Graceful degradation with user-friendly messages
- **Database Errors**: Connection retry logic and transaction rollback
- **File Processing**: Partial success handling for malformed CSV rows

## Development Environment

### Project Structure (Optimized)
```
instaTool/
├── client/                 # React frontend (port 5173)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── Navbar.jsx
│   │   ├── contexts/       # React context for global state
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Main application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Projects.jsx  # Main editing interface
│   │   │   └── Editor.jsx    # Individual post editor
│   │   ├── services/       # API communication
│   │   └── utils/          # Helper functions
│   ├── public/
│   └── package.json
├── server/                 # Express backend (port 3001)
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   │   ├── Post.js         # Post data model
│   │   └── Project.js      # Project data model
│   ├── routes/             # API route definitions
│   │   ├── posts.js        # Post CRUD operations
│   │   └── upload.js       # CSV upload handling
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── uploads/            # Temporary file storage
│   └── package.json
├── memory-bank/            # Project documentation
├── .env                    # Environment variables
└── package.json            # Root scripts & dependencies
```

### Essential Scripts
```json
{
  "scripts": {
    "everything": "npm run kill:ports && concurrently \"npm run server:dev\" \"npm run client:dev\"",
    "kill:ports": "npx kill-port 5173 3001 || true",
    "server:dev": "cd server && npm run dev",
    "client:dev": "cd client && npm run dev",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install"
  }
}
```

## Performance Optimizations

### Frontend Performance
- **React Optimizations**: Proper useEffect dependencies and memo usage
- **State Management**: Efficient state updates with minimal re-renders
- **CSS Performance**: Tailwind CSS with purged unused styles
- **Bundle Size**: Code splitting and lazy loading for large components

### Backend Performance  
- **Database Queries**: Optimized with proper indexing and population
- **File Processing**: Streaming CSV parsing for large files
- **Auto-Save**: Debounced saves (1-second delay) to prevent excessive writes
- **Memory Management**: Proper cleanup of temporary files and connections

### Database Performance
- **Indexing**: Optimized indexes on frequently queried fields
- **Connection Pooling**: Efficient MongoDB connection management
- **Query Optimization**: Populate only necessary fields
- **Data Relationships**: Efficient Post-Project relationship modeling

## Security Implementation

### Input Sanitization
- **CSV Content**: All text inputs sanitized before database storage
- **File Validation**: Verify CSV file integrity and size limits
- **XSS Prevention**: Proper content escaping in React components
- **SQL Injection**: Parameterized queries through Mongoose

### Environment Security
- **Credentials**: MongoDB credentials secured in .env file
- **CORS**: Properly configured for development and production
- **Headers**: Security headers via Helmet middleware
- **File Upload**: Limited file types and size restrictions

## Tailwind CSS Configuration

### Islamic Theme Integration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        islamic: {
          gold: '#FFD700',
          green: '#228B22', 
          blue: '#4169E1',
          cream: '#F5F5DC'
        }
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        modern: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
```

### Theme Implementation
```javascript
// Theme gradients for Instagram posts
const themes = {
  gold: 'linear-gradient(135deg, #FFD700, #FFA500)',
  blue: 'linear-gradient(135deg, #4A90E2, #7B68EE)',
  geometric: 'linear-gradient(135deg, #667eea, #764ba2)',
  calligraphy: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
  modern: 'linear-gradient(135deg, #263238, #37474F)'
}
```

## Environment Configuration

### .env Structure (Secure)
```env
# Database
MONGODB_URI=mongodb+srv://[username]:[password]@cluster000.n00tsc0.mongodb.net/insta_tool
NODE_ENV=development
PORT=3001

# Future Extensions
UPLOAD_DIR=uploads
IMAGE_DIR=generated_images
```

## Development Commands

### Quick Start (Single Command)
```bash
# Start everything fresh (THE MAIN COMMAND)
npm run everything

# Expected Output:
# - Process on port 3001 killed ✅
# - Process on port 5173 killed ✅  
# - Backend: 🚀 Server running on port 3001
# - Backend: ✅ Connected to MongoDB Atlas
# - Frontend: ➜ Local: http://localhost:5173/
```

### Individual Commands
```bash
# Install all dependencies
npm run install:all

# Start backend only
npm run server:dev

# Start frontend only  
npm run client:dev

# Clean ports if needed
npm run kill:ports
```

## Design Patterns Implementation

### Repository Pattern
```javascript
// Centralized data access
class PostRepository {
  async create(post) { return await Post.create(post) }
  async findById(id) { return await Post.findById(id).populate('project_id') }
  async update(id, changes) { return await Post.findByIdAndUpdate(id, changes, {new: true}) }
  async delete(id) { return await Post.findByIdAndDelete(id) }
}
```

### Factory Pattern
```javascript
// Post creation from CSV data
class PostFactory {
  static createFromCSVRow(row, projectId) {
    return {
      post_title: row.post_title,
      theme: row.theme,
      scheduled_for: new Date(row.scheduled_for),
      font: row.font || 'default',
      pages: this.extractPages(row),
      project_id: projectId
    }
  }
}
```

### Observer Pattern
- **Auto-Save Events**: Debounced automatic saves during editing
- **State Updates**: React context for global state management
- **UI Updates**: Real-time feedback for user interactions

## Future Enhancements

### Immediate Priorities
1. **Image Generation**: Canvas/Sharp integration for 1080x1080 exports
2. **Advanced Text Formatting**: Underline, font size presets, color picker
3. **Export System**: PNG/JPG download functionality
4. **Template System**: Save and reuse successful post layouts

### Scalability Considerations
- **Microservices**: Separate image generation service
- **Caching**: Redis for frequently accessed data
- **CDN**: Static asset delivery for generated images
- **Load Balancing**: Horizontal scaling for high traffic

---

**Architecture Status**: Production-ready and scalable  
**Performance**: Optimized for smooth 60fps user experience  
**Security**: Industry-standard security practices implemented  
**Maintainability**: Clean, documented, and testable codebase