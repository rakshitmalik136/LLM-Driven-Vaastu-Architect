import React from 'react';

function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Vastu Architect AI - LLM-Powered Design Studio
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">🏗️ Design Features</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• 3D Architectural Visualization</li>
              <li>• Vastu Shastra Compliance Analysis</li>
              <li>• AI-Powered Design Suggestions</li>
              <li>• Real-time Design Feedback</li>
              <li>• Interactive 3D Models</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">📊 Vastu Compliance</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl font-bold">
                95%
              </div>
              <div>
                <div className="text-green-400 font-semibold">Excellent</div>
                <div className="text-gray-400 text-sm">Vastu Score</div>
              </div>
            </div>
            <div className="text-gray-300">
              Your design follows Vastu principles for prosperity and positive energy.
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">🤖 AI Design Assistant</h2>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-300 mb-4">
              Describe your architectural design in natural language, and our AI will help create 
              a Vastu-compliant layout with 3D visualization.
            </p>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="e.g., Create a 3-bedroom house with southeast kitchen..."
                className="flex-1 bg-gray-600 text-white p-3 rounded border-none outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold">
                Generate Design
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-800 text-green-200 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Application Status: Running</span>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400">
          <p>Frontend: React + Vite + Three.js | Backend: FastAPI | Database: MongoDB</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;