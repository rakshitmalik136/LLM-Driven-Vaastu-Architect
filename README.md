# Vastu Architect AI - LLM-Powered Design Studio

A React-based 3D architectural design application with built-in Vastu Shastra compliance checking and AI-powered design assistance.

## Application Overview

This is a full-stack application featuring:
- **Frontend**: React + Vite with Three.js for 3D visualization
- **Backend**: FastAPI for API services  
- **Database**: MongoDB for data persistence
- **Features**: 
  - 3D architectural visualization
  - Vastu Shastra compliance analysis
  - AI-powered design suggestions
  - Real-time design feedback

## Project Structure

```
/app/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context for state management
│   │   ├── services/      # API and external service integrations
│   │   └── engine/        # Vastu analysis engine
│   ├── package.json       # Frontend dependencies
│   └── index.html         # Main HTML template
├── backend/               # FastAPI backend
│   ├── server.py          # Main FastAPI application
│   └── requirements.txt   # Python dependencies
└── README.md             # This file
```

## Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- MongoDB (optional - localStorage fallback available)
- Yarn package manager

### 1. Frontend Setup

```bash
# Navigate to frontend directory
cd /app/frontend

# Install dependencies
yarn install

# Start development server
yarn start
# OR
yarn dev

# The app will be available at http://localhost:3000
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd /app/backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Backend will be available at http://localhost:8001
```

### 3. MongoDB Setup (Optional)

The application uses localStorage as a fallback, but for full functionality:

```bash
# Install MongoDB
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS:
brew install mongodb

# Start MongoDB service
sudo systemctl start mongodb  # Linux
brew services start mongodb   # macOS

# MongoDB runs on localhost:27017 by default
```

## Usage

1. **Access the Application**: Open http://localhost:3000 in your browser

2. **Design Creation**: 
   - Use the AI assistant panel at the bottom to describe your design
   - Example: "Create a 3-bedroom house with Vastu-compliant layout"

3. **3D Visualization**: 
   - Use mouse to orbit, zoom, and pan in the 3D view
   - Toggle between 2D and 3D views using the top-right controls

4. **Vastu Analysis**: 
   - Real-time Vastu compliance scoring
   - Detailed suggestions for improvements
   - Color-coded indicators for compliance levels

## Current Status

✅ **FIXED**: The white page issue has been resolved!  
✅ **WORKING**: Basic React application with Vastu Architect AI interface  
⚠️ **IN PROGRESS**: Full 3D features (Three.js integration)

### Application Versions

The application currently has two versions available:

1. **SimpleApp (Currently Active)** - Working React interface with:
   - Vastu Architect AI branding and UI
   - Feature overview panels
   - AI design assistant input interface
   - Vastu compliance scoring display
   - Responsive design with Tailwind CSS

2. **Full App (3D Version)** - Complete application with:
   - 3D visualization using Three.js and React Three Fiber
   - Interactive 3D canvas with camera controls
   - Sidebar with project management
   - Real-time Vastu analysis engine
   - Complex state management with React Context

### Switching Between Versions

To switch between versions, edit `/app/frontend/src/main.jsx`:

```javascript
// For working simple version (current):
import SimpleApp from './SimpleApp.jsx'

// For full 3D version (troubleshooting needed):
// import App from './App.jsx'
```

## Troubleshooting

### ✅ RESOLVED: White/Blank Page Issues

**Root Cause Found**: The supervisor configuration was pointing to wrong directory paths.

**Solutions Applied**:
1. Fixed directory mismatch in supervisor configuration
2. Moved React app files to expected `/app/frontend/` location  
3. Added missing `start` script to package.json
4. Fixed Node.js module imports for browser compatibility
5. Corrected React component prop requirements
6. Fixed state property access errors

### For Full 3D Version Issues

If enabling the full App.jsx version:

1. **Component Loading Issues**:
   - Check browser console for Three.js/React Three Fiber errors
   - Verify all @react-three/* dependencies are properly installed
   - Ensure WebGL is supported in the browser

2. **Context/State Issues**:
   - Verify DesignContext is properly initialized
   - Check for undefined properties in component props
   - Ensure all async operations are properly handled

3. **3D Rendering Issues**:
   - Ensure WebGL is enabled in your browser
   - Update graphics drivers if needed
   - Check for WebGL compatibility issues

### Common Issues

1. **Node.js Module Errors**: 
   - DatabaseService.js has been updated for browser compatibility
   - Electron-specific modules now have web fallbacks

2. **API Connection Issues**:
   - Verify backend is running on port 8001
   - Check CORS settings if accessing from different origin

3. **Memory Issues**:
   - The full 3D version may require more memory
   - Monitor resource usage during development

### Development Commands

```bash
# Frontend
yarn start          # Start development server
yarn build          # Build for production
yarn lint           # Run linting
yarn preview        # Preview production build

# Backend
uvicorn server:app --reload  # Development server
python -m pytest            # Run tests (if available)
```

## Features in Detail

### 1. AI Design Assistant
- Natural language input for design requests
- Vastu-aware suggestions
- Mock LLM responses (Ollama integration available)

### 2. 3D Visualization
- Three.js powered 3D rendering
- Real-time room and furniture placement
- Interactive camera controls

### 3. Vastu Compliance
- Automated compliance checking
- Direction-based room placement suggestions
- Scoring system with improvement recommendations

### 4. Project Management
- Save/load projects (localStorage/MongoDB)
- Project history and versioning
- Export capabilities

## API Endpoints

### Backend API (Port 8001)

- `GET /` - Health check
- `GET /api/health` - Service health status
- Additional endpoints for project management and Vastu analysis (to be implemented)

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

WebGL support required for 3D features.

## License

This project is part of the Emergent AI platform template system.

---

For issues or questions, check the console logs and ensure all services are running correctly.