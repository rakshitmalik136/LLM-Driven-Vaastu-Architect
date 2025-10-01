// Conditionally import Node.js modules only in Electron environment
let Database, path;
if (typeof window !== 'undefined' && window.electronAPI?.isElectron) {
  try {
    Database = require('better-sqlite3');
    path = require('path');
  } catch (error) {
    console.warn('Failed to load Node.js modules, using web fallbacks');
  }
}

class DatabaseService {
  constructor() {
    this.db = null;
    this.isElectron = window.electronAPI?.isElectron || false;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      if (this.isElectron) {
        // Desktop: Use SQLite
        const userDataPath = window.nodeAPI?.os.homedir() || '.';
        const dbPath = window.nodeAPI?.path.join(userDataPath, '.vastu-architect', 'projects.db') || './projects.db';
        
        // Ensure directory exists
        const dbDir = window.nodeAPI?.path.dirname(dbPath);
        if (dbDir && !window.nodeAPI?.fs.existsSync(dbDir)) {
          window.nodeAPI?.fs.mkdirSync(dbDir, { recursive: true });
        }

        this.db = new Database(dbPath);
        this.createTables();
      } else {
        // Web: Use localStorage as fallback
        console.log('Using localStorage for data persistence');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      // Fallback to localStorage
      this.isElectron = false;
    }
  }

  createTables() {
    if (!this.db) return;

    // Projects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT DEFAULT 'residential',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        data TEXT NOT NULL
      )
    `);

    // Design elements table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS design_elements (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        type TEXT NOT NULL,
        name TEXT,
        position TEXT,
        dimensions TEXT,
        properties TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `);

    // Vastu analysis table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vastu_analysis (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        violations TEXT,
        suggestions TEXT,
        analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables created successfully');
  }

  // Project operations
  async saveProject(project) {
    if (!this.initialized) await this.initialize();

    const projectData = {
      id: project.id || this.generateId(),
      name: project.name,
      description: project.description || '',
      type: project.type || 'residential',
      data: JSON.stringify(project)
    };

    if (this.isElectron && this.db) {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO projects (id, name, description, type, data, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      stmt.run(projectData.id, projectData.name, projectData.description, projectData.type, projectData.data);
      return projectData.id;
    } else {
      // localStorage fallback
      const projects = this.getStoredProjects();
      projects[projectData.id] = projectData;
      localStorage.setItem('vastu_projects', JSON.stringify(projects));
      return projectData.id;
    }
  }

  async loadProject(projectId) {
    if (!this.initialized) await this.initialize();

    if (this.isElectron && this.db) {
      const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
      const row = stmt.get(projectId);
      
      if (row) {
        return {
          ...JSON.parse(row.data),
          id: row.id,
          created_at: row.created_at,
          updated_at: row.updated_at
        };
      }
    } else {
      // localStorage fallback
      const projects = this.getStoredProjects();
      const project = projects[projectId];
      if (project) {
        return JSON.parse(project.data);
      }
    }

    return null;
  }

  async listProjects() {
    if (!this.initialized) await this.initialize();

    if (this.isElectron && this.db) {
      const stmt = this.db.prepare('SELECT id, name, description, type, created_at, updated_at FROM projects ORDER BY updated_at DESC');
      return stmt.all();
    } else {
      // localStorage fallback
      const projects = this.getStoredProjects();
      return Object.values(projects).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        type: p.type,
        created_at: p.created_at || new Date().toISOString(),
        updated_at: p.updated_at || new Date().toISOString()
      }));
    }
  }

  async deleteProject(projectId) {
    if (!this.initialized) await this.initialize();

    if (this.isElectron && this.db) {
      const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
      stmt.run(projectId);
    } else {
      // localStorage fallback
      const projects = this.getStoredProjects();
      delete projects[projectId];
      localStorage.setItem('vastu_projects', JSON.stringify(projects));
    }
  }

  // Vastu analysis operations
  async saveVastuAnalysis(projectId, analysis) {
    if (!this.initialized) await this.initialize();

    const analysisData = {
      id: this.generateId(),
      project_id: projectId,
      score: analysis.score,
      violations: JSON.stringify(analysis.violations),
      suggestions: JSON.stringify(analysis.suggestions)
    };

    if (this.isElectron && this.db) {
      const stmt = this.db.prepare(`
        INSERT INTO vastu_analysis (id, project_id, score, violations, suggestions)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run(analysisData.id, analysisData.project_id, analysisData.score, analysisData.violations, analysisData.suggestions);
    } else {
      // localStorage fallback
      const analyses = JSON.parse(localStorage.getItem('vastu_analyses') || '{}');
      analyses[analysisData.id] = analysisData;
      localStorage.setItem('vastu_analyses', JSON.stringify(analyses));
    }

    return analysisData.id;
  }

  // Helper methods
  getStoredProjects() {
    return JSON.parse(localStorage.getItem('vastu_projects') || '{}');
  }

  generateId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Export/Import operations
  async exportProject(projectId, filePath) {
    const project = await this.loadProject(projectId);
    if (!project) throw new Error('Project not found');

    const exportData = {
      version: '1.0',
      project: project,
      exported_at: new Date().toISOString()
    };

    if (this.isElectron) {
      window.nodeAPI?.fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    } else {
      // Web: Download as file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name || 'project'}.vastu`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  async importProject(filePath) {
    let data;
    
    if (this.isElectron) {
      const fileContent = window.nodeAPI?.fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(fileContent);
    } else {
      throw new Error('Import not supported in web mode');
    }

    if (data.version && data.project) {
      const projectId = await this.saveProject(data.project);
      return projectId;
    } else {
      throw new Error('Invalid project file format');
    }
  }
}

export default new DatabaseService();