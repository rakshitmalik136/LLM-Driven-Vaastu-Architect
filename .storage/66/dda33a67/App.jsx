import React, { useEffect } from 'react';
import { DesignProvider } from './context/DesignContext';
import Sidebar from './components/Sidebar';
import Canvas3D from './components/Canvas3D';
import InputPanel from './components/InputPanel';
import VastuIndicator from './components/VastuIndicator';

function App() {
  useEffect(() => {
    // Set up desktop-specific initialization
    if (window.electronAPI?.isElectron) {
      console.log('Running in Electron desktop mode');
      
      // Set up window title
      document.title = 'Vastu Architect AI - Desktop Application';
      
      // Handle window close events
      const handleBeforeUnload = (e) => {
        // This will be handled by the Electron main process
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else {
      console.log('Running in web browser mode');
      document.title = 'Vastu Architect AI - Web Application';
    }
  }, []);

  return (
    <DesignProvider>
      <div className="h-screen bg-gray-900 text-white overflow-hidden">
        {/* Desktop Status Bar */}
        {window.electronAPI?.isElectron && (
          <div className="h-6 bg-gray-800 border-b border-gray-700 flex items-center px-4 text-xs text-gray-400">
            <span>Vastu Architect AI - Desktop Application</span>
            <div className="ml-auto flex items-center space-x-4">
              <span>Local LLM: Connected</span>
              <span>Database: SQLite</span>
            </div>
          </div>
        )}
        
        <div className={`flex ${window.electronAPI?.isElectron ? 'h-[calc(100vh-24px)]' : 'h-full'}`}>
          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar with Vastu Indicator */}
            <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-white">
                  {window.electronAPI?.isElectron ? 'Desktop Studio' : 'Web Studio'}
                </h1>
                <div className="text-sm text-gray-400">
                  LLM-Powered Vastu-Aware Design
                </div>
              </div>
              <VastuIndicator />
            </div>

            {/* 3D Canvas */}
            <div className="flex-1 relative">
              <Canvas3D />
            </div>

            {/* Input Panel */}
            <div className="h-48 bg-gray-800 border-t border-gray-700">
              <InputPanel />
            </div>
          </div>
        </div>

        {/* Desktop-specific overlay for connection status */}
        {window.electronAPI?.isElectron && (
          <ConnectionStatus />
        )}
      </div>
    </DesignProvider>
  );
}

// Desktop connection status component
function ConnectionStatus() {
  const [status, setStatus] = React.useState({
    ollama: 'checking',
    database: 'connected'
  });

  React.useEffect(() => {
    // Check Ollama connection status
    const checkConnections = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        setStatus(prev => ({
          ...prev,
          ollama: response.ok ? 'connected' : 'disconnected'
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          ollama: 'disconnected'
        }));
      }
    };

    checkConnections();
    const interval = setInterval(checkConnections, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-3 text-xs">
      <div className="flex items-center space-x-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${
          status.ollama === 'connected' ? 'bg-green-500' : 
          status.ollama === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <span>Ollama LLM: {status.ollama}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          status.database === 'connected' ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span>Database: {status.database}</span>
      </div>
    </div>
  );
}

export default App;