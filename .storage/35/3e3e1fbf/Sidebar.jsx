import React, { useState } from 'react';
import { Home, Building, TreePine, Layers, Settings, FolderOpen, Plus } from 'lucide-react';

const Sidebar = ({ currentProject, setCurrentProject }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects] = useState([
    { id: 1, name: 'Modern Villa', type: 'Residential', vastuScore: 92 },
    { id: 2, name: 'Office Complex', type: 'Commercial', vastuScore: 78 },
    { id: 3, name: 'Garden House', type: 'Residential', vastuScore: 95 }
  ]);

  const designModes = [
    { id: 'interior', name: 'Interior Design', icon: Home, color: 'text-blue-400' },
    { id: 'exterior', name: 'Exterior Design', icon: Building, color: 'text-green-400' },
    { id: 'landscape', name: 'Landscape Design', icon: TreePine, color: 'text-emerald-400' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'projects' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FolderOpen className="w-4 h-4 mx-auto mb-1" />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'tools' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 mx-auto mb-1" />
          Tools
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'projects' && (
          <div className="p-4">
            {/* New Project Button */}
            <button className="w-full mb-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            {/* Recent Projects */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Recent Projects</h3>
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setCurrentProject(project)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentProject?.id === project.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{project.name}</span>
                    <span className="text-xs text-gray-400">{project.vastuScore}%</span>
                  </div>
                  <span className="text-xs text-gray-400">{project.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="p-4">
            {/* Design Modes */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Design Modes</h3>
              {designModes.map((mode) => (
                <button
                  key={mode.id}
                  className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-3 transition-colors"
                >
                  <mode.icon className={`w-5 h-5 ${mode.color}`} />
                  <span className="text-sm">{mode.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Tools */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Tools</h3>
              <button className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left text-sm transition-colors">
                Vastu Analysis
              </button>
              <button className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left text-sm transition-colors">
                Material Library
              </button>
              <button className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left text-sm transition-colors">
                Furniture Catalog
              </button>
              <button className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left text-sm transition-colors">
                Export Design
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-3 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;