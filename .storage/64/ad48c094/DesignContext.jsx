import React, { createContext, useContext, useReducer, useEffect } from 'react';
import VastuEngine from '../engine/VastuEngine.js';
import DatabaseService from '../services/DatabaseService.js';
import LLMService from '../services/LLMService.js';

const DesignContext = createContext();

const initialState = {
  currentProject: {
    id: null,
    name: 'Untitled Project',
    description: '',
    type: 'residential'
  },
  mode: 'interior', // interior, exterior, landscape
  rooms: [],
  furniture: [],
  exteriorElements: [],
  landscapeElements: [],
  vastuAnalysis: {
    score: 100,
    violations: [],
    suggestions: [],
    compliance: 'excellent'
  },
  isAnalyzing: false,
  isGenerating: false,
  history: [],
  settings: {
    showVastuGrid: true,
    showCompass: true,
    autoAnalyze: true,
    llmModel: 'llama2'
  },
  // Desktop-specific state
  isElectron: false,
  projectsList: [],
  unsavedChanges: false
};

function designReducer(state, action) {
  switch (action.type) {
    case 'SET_ELECTRON_MODE':
      return { ...state, isElectron: action.payload };

    case 'SET_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
        unsavedChanges: false
      };

    case 'UPDATE_PROJECT_INFO':
      return {
        ...state,
        currentProject: { ...state.currentProject, ...action.payload },
        unsavedChanges: true
      };

    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'ADD_ROOM':
      const newRoom = { ...action.payload, id: action.payload.id || `room_${Date.now()}` };
      return {
        ...state,
        rooms: [...state.rooms, newRoom],
        unsavedChanges: true
      };

    case 'MULTIPLE_ROOMS':
      const newRooms = action.payload.map(roomAction => ({
        ...roomAction.data,
        id: roomAction.data.id || `room_${Date.now()}_${Math.random()}`
      }));
      return {
        ...state,
        rooms: [...state.rooms, ...newRooms],
        unsavedChanges: true
      };

    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.id ? { ...room, ...action.payload } : room
        ),
        unsavedChanges: true
      };

    case 'DELETE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
        furniture: state.furniture.filter(f => f.roomId !== action.payload),
        unsavedChanges: true
      };

    case 'ADD_FURNITURE':
      const newFurniture = { ...action.payload, id: action.payload.id || `furniture_${Date.now()}` };
      return {
        ...state,
        furniture: [...state.furniture, newFurniture],
        unsavedChanges: true
      };

    case 'UPDATE_FURNITURE':
      return {
        ...state,
        furniture: state.furniture.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
        unsavedChanges: true
      };

    case 'DELETE_FURNITURE':
      return {
        ...state,
        furniture: state.furniture.filter(item => item.id !== action.payload),
        unsavedChanges: true
      };

    case 'ADD_EXTERIOR_ELEMENT':
      return {
        ...state,
        exteriorElements: [...state.exteriorElements, action.payload],
        unsavedChanges: true
      };

    case 'ADD_LANDSCAPE_ELEMENT':
      return {
        ...state,
        landscapeElements: [...state.landscapeElements, action.payload],
        unsavedChanges: true
      };

    case 'SET_VASTU_ANALYSIS':
      return { ...state, vastuAnalysis: action.payload };

    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };

    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };

    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [...state.history, action.payload].slice(-50) // Keep last 50 actions
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'SET_PROJECTS_LIST':
      return { ...state, projectsList: action.payload };

    case 'CLEAR_DESIGN':
      return {
        ...state,
        rooms: [],
        furniture: [],
        exteriorElements: [],
        landscapeElements: [],
        vastuAnalysis: initialState.vastuAnalysis,
        unsavedChanges: false
      };

    case 'LOAD_DESIGN_STATE':
      return {
        ...state,
        ...action.payload,
        unsavedChanges: false
      };

    default:
      return state;
  }
}

export function DesignProvider({ children }) {
  const [state, dispatch] = useReducer(designReducer, initialState);

  // Initialize services and check for Electron
  useEffect(() => {
    const initializeServices = async () => {
      // Check if running in Electron
      const isElectron = window.electronAPI?.isElectron || false;
      dispatch({ type: 'SET_ELECTRON_MODE', payload: isElectron });

      // Initialize database service
      await DatabaseService.initialize();

      // Initialize LLM service
      await LLMService.initialize();

      // Load projects list if in Electron
      if (isElectron) {
        try {
          const projects = await DatabaseService.listProjects();
          dispatch({ type: 'SET_PROJECTS_LIST', payload: projects });
        } catch (error) {
          console.error('Failed to load projects list:', error);
        }
      }

      // Set up Electron menu listeners
      if (isElectron) {
        setupElectronListeners();
      }
    };

    initializeServices();
  }, []);

  // Auto-analyze when design changes
  useEffect(() => {
    if (state.settings.autoAnalyze && (state.rooms.length > 0 || state.furniture.length > 0)) {
      analyzeVastu();
    }
  }, [state.rooms, state.furniture, state.settings.autoAnalyze]);

  const setupElectronListeners = () => {
    if (!window.electronAPI) return;

    // File menu handlers
    window.electronAPI.onMenuNewProject(() => newProject());
    window.electronAPI.onMenuOpenProject((_, filePath) => openProject(filePath));
    window.electronAPI.onMenuSaveProject(() => saveProject());
    window.electronAPI.onMenuSaveAsProject((_, filePath) => saveProjectAs(filePath));

    // Export handlers
    window.electronAPI.onMenuExportImage(() => exportAsImage());
    window.electronAPI.onMenuExportPdf(() => exportAsPdf());
    window.electronAPI.onMenuExportDxf(() => exportAsDxf());

    // Design menu handlers
    window.electronAPI.onMenuSetMode((_, mode) => dispatch({ type: 'SET_MODE', payload: mode }));
    window.electronAPI.onMenuVastuAnalysis(() => analyzeVastu());
    window.electronAPI.onMenuAiSuggestions(() => generateAISuggestions());

    // Tools menu handlers
    window.electronAPI.onMenuLlmSettings(() => openLLMSettings());
    window.electronAPI.onMenuVastuRules(() => openVastuRules());
    window.electronAPI.onMenuPreferences(() => openPreferences());
  };

  const analyzeVastu = async () => {
    dispatch({ type: 'SET_ANALYZING', payload: true });
    
    try {
      const analysis = VastuEngine.analyzeDesign(state);
      dispatch({ type: 'SET_VASTU_ANALYSIS', payload: analysis });
      
      // Save analysis if in Electron
      if (state.isElectron && state.currentProject.id) {
        await DatabaseService.saveVastuAnalysis(state.currentProject.id, analysis);
      }
    } catch (error) {
      console.error('Vastu analysis failed:', error);
    } finally {
      dispatch({ type: 'SET_ANALYZING', payload: false });
    }
  };

  const processDesignRequest = async (userInput) => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    
    try {
      const response = await LLMService.processDesignRequest(userInput, state);
      
      // Add to history
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: {
          timestamp: new Date().toISOString(),
          input: userInput,
          response: response
        }
      });

      // Process the response
      if (response.type === 'MULTIPLE_ROOMS') {
        dispatch({ type: 'MULTIPLE_ROOMS', payload: response.data });
      } else if (response.type === 'ADD_ROOM') {
        dispatch({ type: 'ADD_ROOM', payload: response.data });
      } else if (response.type === 'ADD_FURNITURE') {
        dispatch({ type: 'ADD_FURNITURE', payload: response.data });
      }

      return response;
    } catch (error) {
      console.error('Design request processing failed:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  // Desktop-specific functions
  const newProject = () => {
    if (state.unsavedChanges) {
      // Show confirmation dialog
      if (window.electronAPI) {
        window.electronAPI.showMessageBox({
          type: 'question',
          buttons: ['Save', "Don't Save", 'Cancel'],
          defaultId: 0,
          message: 'Do you want to save changes to the current project?'
        }).then((result) => {
          if (result.response === 0) {
            saveProject().then(() => createNewProject());
          } else if (result.response === 1) {
            createNewProject();
          }
        });
      } else {
        createNewProject();
      }
    } else {
      createNewProject();
    }
  };

  const createNewProject = () => {
    dispatch({ type: 'CLEAR_DESIGN' });
    dispatch({
      type: 'SET_PROJECT',
      payload: {
        id: null,
        name: 'Untitled Project',
        description: '',
        type: 'residential'
      }
    });
  };

  const saveProject = async () => {
    try {
      const projectData = {
        ...state.currentProject,
        rooms: state.rooms,
        furniture: state.furniture,
        exteriorElements: state.exteriorElements,
        landscapeElements: state.landscapeElements,
        settings: state.settings,
        vastuAnalysis: state.vastuAnalysis
      };

      const projectId = await DatabaseService.saveProject(projectData);
      
      dispatch({
        type: 'SET_PROJECT',
        payload: { ...state.currentProject, id: projectId }
      });

      // Refresh projects list
      if (state.isElectron) {
        const projects = await DatabaseService.listProjects();
        dispatch({ type: 'SET_PROJECTS_LIST', payload: projects });
      }

      return projectId;
    } catch (error) {
      console.error('Save project failed:', error);
      throw error;
    }
  };

  const openProject = async (filePath) => {
    try {
      let projectData;
      
      if (filePath) {
        // Import from file
        const projectId = await DatabaseService.importProject(filePath);
        projectData = await DatabaseService.loadProject(projectId);
      } else {
        // Show open dialog
        if (window.electronAPI) {
          const result = await window.electronAPI.showOpenDialog({
            properties: ['openFile'],
            filters: [
              { name: 'Vastu Projects', extensions: ['vastu'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          });
          
          if (!result.canceled && result.filePaths[0]) {
            const projectId = await DatabaseService.importProject(result.filePaths[0]);
            projectData = await DatabaseService.loadProject(projectId);
          }
        }
      }

      if (projectData) {
        dispatch({ type: 'LOAD_DESIGN_STATE', payload: projectData });
      }
    } catch (error) {
      console.error('Open project failed:', error);
      throw error;
    }
  };

  const saveProjectAs = async (filePath) => {
    try {
      if (!filePath && window.electronAPI) {
        const result = await window.electronAPI.showSaveDialog({
          filters: [
            { name: 'Vastu Projects', extensions: ['vastu'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });
        
        if (result.canceled) return;
        filePath = result.filePath;
      }

      if (filePath) {
        await DatabaseService.exportProject(state.currentProject.id, filePath);
      }
    } catch (error) {
      console.error('Save as failed:', error);
      throw error;
    }
  };

  // Export functions (placeholder implementations)
  const exportAsImage = () => {
    console.log('Export as image - to be implemented');
  };

  const exportAsPdf = () => {
    console.log('Export as PDF - to be implemented');
  };

  const exportAsDxf = () => {
    console.log('Export as DXF - to be implemented');
  };

  const generateAISuggestions = async () => {
    try {
      const suggestions = await processDesignRequest('Generate AI suggestions for improving this design');
      return suggestions;
    } catch (error) {
      console.error('AI suggestions failed:', error);
    }
  };

  const openLLMSettings = () => {
    console.log('Open LLM settings - to be implemented');
  };

  const openVastuRules = () => {
    console.log('Open Vastu rules - to be implemented');
  };

  const openPreferences = () => {
    console.log('Open preferences - to be implemented');
  };

  const value = {
    state,
    dispatch,
    analyzeVastu,
    processDesignRequest,
    // Desktop functions
    newProject,
    saveProject,
    openProject,
    saveProjectAs,
    exportAsImage,
    exportAsPdf,
    exportAsDxf,
    generateAISuggestions
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
}

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};