import React, { createContext, useContext, useReducer } from 'react';

const DesignContext = createContext();

const initialState = {
  rooms: [],
  furniture: [],
  materials: {},
  vastuCompliance: {
    score: 85,
    violations: [],
    suggestions: []
  },
  currentMode: 'interior', // 'interior' | 'exterior' | 'landscape'
  selectedElement: null,
  history: []
};

function designReducer(state, action) {
  switch (action.type) {
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
        history: [...state.history, { type: 'ADD_ROOM', timestamp: Date.now() }]
      };
    
    case 'ADD_FURNITURE':
      return {
        ...state,
        furniture: [...state.furniture, action.payload],
        history: [...state.history, { type: 'ADD_FURNITURE', timestamp: Date.now() }]
      };
    
    case 'UPDATE_VASTU_SCORE':
      return {
        ...state,
        vastuCompliance: {
          ...state.vastuCompliance,
          score: action.payload.score,
          violations: action.payload.violations || state.vastuCompliance.violations,
          suggestions: action.payload.suggestions || state.vastuCompliance.suggestions
        }
      };
    
    case 'SET_MODE':
      return {
        ...state,
        currentMode: action.payload
      };
    
    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElement: action.payload
      };
    
    case 'CLEAR_DESIGN':
      return {
        ...initialState,
        history: [...state.history, { type: 'CLEAR_DESIGN', timestamp: Date.now() }]
      };
    
    default:
      return state;
  }
}

export function DesignProvider({ children }) {
  const [state, dispatch] = useReducer(designReducer, initialState);

  return (
    <DesignContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}