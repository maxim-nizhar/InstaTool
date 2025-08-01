# System Patterns: InstaTool

## Architecture Overview

### Client-Server Pattern
```
Frontend (React + Tailwind) ↔ Backend (Node.js + Express) ↔ Database (MongoDB)
```

### Data Flow
1. **CSV Upload** → **Parser** → **Post Generator** → **Database Storage**
2. **Database** → **UI Components** → **Editing Interface** → **Updated Storage**
3. **Scheduler** → **Instagram API** → **Post Publishing**

## Core Components

### 1. CSV Processing Module
- **CSVParser**: Validates and parses uploaded CSV files
- **ContentValidator**: Ensures required fields present
- **PostFactory**: Creates post objects from CSV rows

### 2. Theme Engine
- **ThemeManager**: Manages 5 Islamic themes
- **ImageGenerator**: Creates 1080x1080 images with text overlays
- **FontManager**: Handles font selection and application

### 3. Scheduling System
- **PostScheduler**: Manages scheduled post queue
- **TimeManager**: Handles ISO 8601 date parsing
- **JobQueue**: Background job processing for timed posts

### 4. Data Management
- **PostRepository**: MongoDB operations for posts
- **ProjectRepository**: Day-based project organization
- **UserPreferences**: Theme and font preferences

### 5. Frontend Components
- **UploadInterface**: CSV file upload and validation
- **PostEditor**: Individual post editing playground
- **ProjectView**: Day-based post organization
- **PreviewSystem**: Instagram-like post preview

## Design Patterns

### Repository Pattern
```javascript
class PostRepository {
  async create(post) { }
  async findByDate(date) { }
  async update(id, changes) { }
  async delete(id) { }
}
```

### Factory Pattern
```javascript
class PostFactory {
  createFromCSVRow(row, theme) {
    return new CarouselPost(row, theme);
  }
}
```

### Observer Pattern
- **Scheduler Events**: Notify when posts are published
- **Upload Events**: Update UI during CSV processing
- **Edit Events**: Save changes automatically

### Command Pattern
- **Post Operations**: Create, Update, Delete, Schedule
- **Bulk Operations**: Process multiple posts
- **Undo/Redo**: Future edit history

## Data Models

### Post Schema
```javascript
{
  _id: ObjectId,
  title: String,
  theme: String,
  scheduledFor: Date,
  pages: [{ content: String, font: String }],
  projectDate: Date, // Day-based grouping
  status: String, // draft, scheduled, published
  createdAt: Date,
  updatedAt: Date
}
```

### Project Schema
```javascript
{
  _id: ObjectId,
  date: Date, // YYYY-MM-DD
  posts: [ObjectId], // References to posts
  totalPosts: Number,
  publishedCount: Number
}
```

## Error Handling

### Validation Layer
- **CSV Validation**: Required fields, data types, format
- **Content Validation**: Text length, character encoding
- **Schedule Validation**: Future dates, valid ISO format

### Error Recovery
- **Graceful Degradation**: Continue processing valid rows
- **User Feedback**: Clear error messages with suggestions
- **Data Integrity**: Rollback incomplete operations

## Performance Patterns

### Lazy Loading
- **Theme Assets**: Load theme images on demand
- **Font Files**: Cache frequently used fonts
- **Post History**: Paginated loading of historical posts

### Caching Strategy
- **Theme Cache**: In-memory theme asset storage
- **Generated Images**: Disk cache for created images
- **Database Queries**: Redis cache for frequent lookups

## Security Patterns

### Input Sanitization
- **CSV Content**: Sanitize all text inputs
- **File Validation**: Verify CSV file integrity
- **SQL Injection**: Use parameterized queries

### Environment Security
- **Credentials**: .env file isolation
- **API Keys**: Separate development/production keys
- **Database**: Connection string encryption