import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas3D from './components/Canvas3D';
import InputPanel from './components/InputPanel';
import VastuIndicator from './components/VastuIndicator';
import { DesignProvider } from './context/DesignContext';

function App() {
  const [currentProject, setCurrentProject] = useState(null);
  const [vastuScore, setVastuScore] = useState(85);

  return (
    <DesignProvider>
      <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700">
          <Sidebar 
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Vastu Architect AI
              </h1>
              <span className="text-sm text-gray-400">
                {currentProject ? currentProject.name : 'New Project'}
              </span>
            </div>
            
            <VastuIndicator score={vastuScore} />
          </div>

          {/* 3D Canvas Area */}
          <div className="flex-1 relative">
            <Canvas3D />
          </div>

          {/* Input Panel */}
          <div className="h-48 bg-gray-800 border-t border-gray-700">
            <InputPanel setVastuScore={setVastuScore} />
          </div>
        </div>
      </div>
    </DesignProvider>
  );
}

export default App;