const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-project');
          }
        },
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Vastu Projects', extensions: ['vastu'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled) {
              mainWindow.webContents.send('menu-open-project', result.filePaths[0]);
            }
          }
        },
        {
          label: 'Save Project',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save-project');
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              filters: [
                { name: 'Vastu Projects', extensions: ['vastu'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled) {
              mainWindow.webContents.send('menu-save-as-project', result.filePath);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Export',
          submenu: [
            {
              label: 'Export as Image',
              click: () => {
                mainWindow.webContents.send('menu-export-image');
              }
            },
            {
              label: 'Export as PDF',
              click: () => {
                mainWindow.webContents.send('menu-export-pdf');
              }
            },
            {
              label: 'Export as DXF',
              click: () => {
                mainWindow.webContents.send('menu-export-dxf');
              }
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Design',
      submenu: [
        {
          label: 'Interior Mode',
          click: () => {
            mainWindow.webContents.send('menu-set-mode', 'interior');
          }
        },
        {
          label: 'Exterior Mode',
          click: () => {
            mainWindow.webContents.send('menu-set-mode', 'exterior');
          }
        },
        {
          label: 'Landscape Mode',
          click: () => {
            mainWindow.webContents.send('menu-set-mode', 'landscape');
          }
        },
        { type: 'separator' },
        {
          label: 'Run Vastu Analysis',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('menu-vastu-analysis');
          }
        },
        {
          label: 'Generate AI Suggestions',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            mainWindow.webContents.send('menu-ai-suggestions');
          }
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'LLM Settings',
          click: () => {
            mainWindow.webContents.send('menu-llm-settings');
          }
        },
        {
          label: 'Vastu Rules',
          click: () => {
            mainWindow.webContents.send('menu-vastu-rules');
          }
        },
        { type: 'separator' },
        {
          label: 'Preferences',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('menu-preferences');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Vastu Architect AI',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Vastu Architect AI',
              message: 'Vastu Architect AI',
              detail: 'LLM-Powered Vastu-Aware Architectural Design Studio\nVersion 1.0.0\n\nBuilt with Electron, React, and Three.js'
            });
          }
        },
        {
          label: 'User Guide',
          click: () => {
            shell.openExternal('https://docs.vastuarchitectai.com');
          }
        },
        {
          label: 'Vastu Principles',
          click: () => {
            mainWindow.webContents.send('menu-vastu-help');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationURL) => {
    navigationEvent.preventDefault();
    shell.openExternal(navigationURL);
  });
});