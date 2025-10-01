# Copilot Instructions for Vastu Architect AI

## Big Picture Architecture
- **Frontend:** React 18 + Vite, using TailwindCSS for styling. Main entry: `src/App.jsx`.
- **3D/Design Logic:** Components in `src/components/` (e.g., `Canvas3D.jsx`, `FloorPlan.jsx`, `Room3D.jsx`) handle rendering and user interaction.
- **State Management:** Centralized via `src/context/DesignContext.jsx`.
- **Vastu Analysis:** Core logic in `src/engine/VastuEngine.js` (analyzes design state for Vastu compliance, returns violations/suggestions/score).
- **AI Integration:** `src/services/LLMService.js` (routes design requests to local LLM via `OllamaService.js` or generates mock responses if LLM is unavailable).
- **Desktop/Web Modes:** Electron integration in `electron/` (desktop) and browser mode (web). UI adapts based on `window.electronAPI?.isElectron`.

## Developer Workflows
- **Install dependencies:** `pnpm install` (use pnpm, not npm/yarn)
- **Start dev server:** `pnpm run dev` (web)
- **Lint:** `pnpm run lint`
- **Electron desktop:** Entry at `electron/main.js`, preload in `electron/preload.js`. Desktop mode uses SQLite and local LLM (Ollama).
- **3D Canvas:** Main logic in `Canvas3D.jsx`, interacts with Vastu engine and design context.

## Project-Specific Conventions
- **Room/Furniture Data:** All design state objects (rooms, furniture) use `{ x, z, direction }` for position, and `dimensions` for size. Vastu compliance is tracked per object.
- **Vastu Rules:** Defined in `src/data/VastuRules.js`, consumed by `VastuEngine.js`.
- **AI Requests:** Use `LLMService.processDesignRequest(userInput, currentState)` for design suggestions. Mock responses are Vastu-aware and pattern-matched.
- **Component Styling:** TailwindCSS utility classes only. No CSS modules or styled-components.
- **Do not modify:** `src/main.jsx`, `src/index.css` unless absolutely necessary.

## Integration Points & Patterns
- **LLM Integration:** Local Ollama server (default: `http://localhost:11434`). Fallback to mock if unavailable.
- **Database:** Desktop mode uses SQLite (see `DatabaseService.js`).
- **Electron/Web Detection:** Use `window.electronAPI?.isElectron` to branch logic/UI.
- **Connection Status:** Desktop overlays show LLM/DB status (`ConnectionStatus` in `App.jsx`).

## Examples
- To add a Vastu-compliant room: use `VastuEngine.getRecommendedPosition(roomType)` and pass to design state.
- To process a user design request: `LLMService.processDesignRequest('Add a kitchen', currentState)`.
- To analyze compliance: `VastuEngine.analyzeDesign(designState)` returns `{ score, violations, suggestions, compliance }`.

## Key Files & Directories
- `src/engine/VastuEngine.js` — Vastu logic
- `src/services/LLMService.js` — AI integration
- `src/components/` — UI/3D components
- `src/context/DesignContext.jsx` — state management
- `electron/` — desktop integration
- `src/data/VastuRules.js` — Vastu rules

---
_If any section is unclear or missing, please provide feedback for improvement._
