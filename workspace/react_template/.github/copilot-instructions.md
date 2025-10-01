# Copilot Instructions for AI Coding Agents

## Project Overview
This is a modern React + Vite desktop/web app for Vaastu architectural design, featuring 3D visualization, rule-based analysis, and LLM-driven services. The architecture combines React components, context/state management, and service modules for extensibility.

## Key Architecture & Data Flow
- **src/components/**: UI components for 3D canvas, floor plans, input panels, sidebar, and Vaastu indicators. Example: `Canvas3D.jsx` renders 3D scenes, `FloorPlan.jsx` manages layout logic.
- **src/context/DesignContext.jsx**: Centralized React context for design state, used by most components for state sharing.
- **src/engine/VastuEngine.js**: Core logic for Vaastu rule evaluation. Consumes design data and outputs rule compliance.
- **src/services/**: Integrations for database, LLM, and external APIs. Example: `LLMService.js` interfaces with language models, `DatabaseService.js` handles persistence.
- **public/data/**: Example JSON data for testing and prototyping.
- **electron/**: Entry points for Electron desktop integration (`main.js`, `preload.js`).

## Developer Workflows
- **Install dependencies**: `pnpm install`
- **Start dev server**: `pnpm run dev` (web) or run Electron for desktop
- **Lint code**: `pnpm run lint`
- **Build**: `pnpm run build` (Vite)
- **Debug Electron**: Edit `electron/main.js` and use Electron CLI

## Project-Specific Patterns
- **State Management**: Use `DesignContext` for cross-component state. Avoid prop drilling.
- **Vaastu Rules**: Extend or modify rules in `src/data/VastuRules.js` and logic in `src/engine/VastuEngine.js`.
- **3D Rendering**: All 3D logic is in `Canvas3D.jsx` and `Room3D.jsx`. Use Three.js patterns.
- **Service Integration**: Add new services in `src/services/`, following the existing class/module structure.
- **Styling**: Use TailwindCSS utility classes. Avoid custom CSS unless necessary.
- **Electron Integration**: Communicate between Electron and React via preload scripts and IPC.

## External Dependencies
- React 18, Vite, TailwindCSS, ESLint, Material UI
- Electron (for desktop)
- Three.js (for 3D rendering)

## Examples
- To add a new Vaastu rule: Update `src/data/VastuRules.js` and extend logic in `src/engine/VastuEngine.js`.
- To persist design data: Use `DatabaseService.js` methods.
- To add LLM features: Extend `LLMService.js` and connect to UI via context/actions.

## Conventions
- Do not modify `src/main.jsx` or `src/index.css` unless refactoring entry points.
- Place new UI components in `src/components/`.
- Place new services in `src/services/`.
- Use TailwindCSS for all styling.
- Keep business logic out of UI components—use engine/services.

---
For questions or missing patterns, ask for clarification or request examples from maintainers.
