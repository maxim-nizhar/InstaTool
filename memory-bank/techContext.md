# Technical Context: InstaTool

## Technology Stack

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **File Upload**: react-dropzone
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Environment**: dotenv
- **File Processing**: csv-parser
- **Image Generation**: Canvas API / sharp
- **Scheduling**: node-cron

### Database
- **Primary**: MongoDB Atlas
- **Connection**: mongoose
- **Cluster**: cluster000.n00tsc0.mongodb.net
- **Username**: strongbox5695
- **Password**: *@!**^9862%@247c%8S43

## Development Environment

### Project Structure
```
insta-tool/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── package.json
├── shared/                 # Shared utilities
├── .env
└── package.json           # Root package with scripts
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server:dev\" \"npm run client:dev\"",
    "server:dev": "cd server && npm run dev",
    "client:dev": "cd client && npm start",
    "server:start": "cd server && npm start",
    "client:build": "cd client && npm run build",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install",
    "build": "npm run client:build",
    "start": "npm run server:start"
  }
}
```

## Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.3.0",
  "axios": "^1.6.0",
  "react-dropzone": "^14.2.3",
  "date-fns": "^2.30.0",
  "react-router-dom": "^6.8.0"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "dotenv": "^16.3.1",
  "csv-parser": "^3.0.0",
  "multer": "^1.4.5",
  "node-cron": "^3.0.3",
  "canvas": "^2.11.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0"
}
```

## Environment Configuration

### .env Structure
```env
# Database
MONGODB_URI=mongodb+srv://strongbox5695:*@!**^9862%@247c%8S43@cluster000.n00tsc0.mongodb.net/
DB_NAME=insta_tool

# Server
PORT=5000
NODE_ENV=development

# Instagram API (Future)
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
INSTAGRAM_ACCESS_TOKEN=

# File Storage
UPLOAD_DIR=uploads
IMAGE_DIR=generated_images
```

## Build Configuration

### Tailwind CSS Setup
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
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

### Vite Configuration (Alternative to CRA)
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

## Development Tools

### Code Quality
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit linting

### Testing (Future)
- **Frontend**: React Testing Library
- **Backend**: Jest + Supertest
- **E2E**: Cypress

### Monitoring (Future)
- **Logging**: Winston
- **Error Tracking**: Sentry
- **Performance**: New Relic

## Deployment Considerations

### Development
- **Frontend**: npm start (React dev server)
- **Backend**: nodemon for auto-restart
- **Database**: MongoDB Atlas connection

### Production (Future)
- **Frontend**: Static build deployment (Vercel/Netlify)
- **Backend**: Node.js hosting (Railway/Render)
- **Database**: MongoDB Atlas (same cluster)
- **Environment**: Separate production .env

## Critical Setup Notes

### Tailwind CSS Installation
1. Install Tailwind via npm
2. Configure tailwind.config.js with content paths
3. Add Tailwind directives to CSS
4. Verify build process includes Tailwind compilation
5. Test with Islamic color scheme classes

### MongoDB Connection
- Use provided connection string exactly
- Ensure network access from development IP
- Test connection before building features
- Handle connection errors gracefully