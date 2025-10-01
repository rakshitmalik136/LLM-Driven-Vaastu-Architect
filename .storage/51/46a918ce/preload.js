const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // File operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),

  // Menu events
  onMenuNewProject: (callback) => ipcRenderer.on('menu-new-project', callback),
  onMenuOpenProject: (callback) => ipcRenderer.on('menu-open-project', callback),
  onMenuSaveProject: (callback) => ipcRenderer.on('menu-save-project', callback),
  onMenuSaveAsProject: (callback) => ipcRenderer.on('menu-save-as-project', callback),
  onMenuExportImage: (callback) => ipcRenderer.on('menu-export-image', callback),
  onMenuExportPdf: (callback) => ipcRenderer.on('menu-export-pdf', callback),
  onMenuExportDxf: (callback) => ipcRenderer.on('menu-export-dxf', callback),
  onMenuSetMode: (callback) => ipcRenderer.on('menu-set-mode', callback),
  onMenuVastuAnalysis: (callback) => ipcRenderer.on('menu-vastu-analysis', callback),
  onMenuAiSuggestions: (callback) => ipcRenderer.on('menu-ai-suggestions', callback),
  onMenuLlmSettings: (callback) => ipcRenderer.on('menu-llm-settings', callback),
  onMenuVastuRules: (callback) => ipcRenderer.on('menu-vastu-rules', callback),
  onMenuPreferences: (callback) => ipcRenderer.on('menu-preferences', callback),
  onMenuVastuHelp: (callback) => ipcRenderer.on('menu-vastu-help', callback),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // Platform info
  platform: process.platform,
  isElectron: true
});

// Node.js APIs for database operations
contextBridge.exposeInMainWorld('nodeAPI', {
  path: require('path'),
  fs: require('fs'),
  os: require('os')
});