# LLM-Powered Vastu-Aware Architect Desktop Application - MVP

## Core Features to Implement

### 1. Main Application Structure
- **App.jsx** - Main application layout with sidebar, 3D canvas, and input panel
- **components/Sidebar.jsx** - Navigation and project management
- **components/InputPanel.jsx** - Natural language input interface
- **components/Canvas3D.jsx** - Three.js 3D visualization canvas

### 2. Natural Language Processing
- **services/LLMService.js** - Ollama integration for local LLM processing
- **services/DesignParser.js** - Parse LLM responses into design commands
- **utils/PromptTemplates.js** - Vastu-aware prompts for design generation

### 3. Vastu Compliance Engine
- **engine/VastuEngine.js** - Core Vastu rules and validation
- **data/VastuRules.js** - Comprehensive Vastu Shastra rules database
- **utils/VastuValidator.js** - Real-time Vastu compliance checking

### 4. 3D Design System
- **engine/DesignEngine.js** - Convert text commands to 3D objects
- **components/FloorPlan.js** - 2D floor plan generation
- **components/Room3D.js** - 3D room visualization
- **components/Furniture.js** - Furniture placement system

### 5. Data Management
- **services/DatabaseService.js** - SQLite local database operations
- **models/Project.js** - Project data structure
- **models/Design.js** - Design elements data structure

### 6. Material & Asset Libraries
- **data/Materials.js** - Material library (colors, textures, finishes)
- **data/Furniture.js** - Furniture catalog with Vastu properties
- **assets/** - 3D models, textures, and images

### 7. Export & Save Features
- **services/ExportService.js** - Export to images, PDF, basic CAD formats
- **utils/ProjectManager.js** - Save/load projects locally

### 8. UI Components
- **components/MaterialPalette.jsx** - Material selection interface
- **components/VastuIndicator.jsx** - Real-time Vastu compliance display
- **components/ProjectBrowser.jsx** - Local project management

## Implementation Priority
1. Basic app structure with Three.js canvas (P0)
2. Natural language input with mock LLM responses (P0)
3. Simple room generation and Vastu validation (P0)
4. Basic material library and furniture placement (P1)
5. Local storage and project management (P1)
6. Advanced Vastu rules and exterior design (P2)
7. Export functionality and collaboration features (P2)

## Technology Stack
- Frontend: React + Vite
- 3D Graphics: Three.js + React Three Fiber
- Styling: Tailwind CSS
- Local Storage: Browser localStorage (SQLite simulation)
- LLM: Mock service (Ollama integration ready)
- Desktop: Web-based (Electron wrapper ready)

## File Structure
```
src/
├── App.jsx (main app)
├── components/ (UI components)
├── services/ (LLM, database, export)
├── engine/ (Vastu, design generation)
├── data/ (rules, materials, furniture)
├── utils/ (helpers, validators)
└── assets/ (3D models, textures)
```