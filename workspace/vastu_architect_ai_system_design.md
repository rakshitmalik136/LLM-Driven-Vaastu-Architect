# System Architecture Design: Local LLM-Powered Vastu-Aware Desktop Application

## Implementation Approach

We will implement a **desktop application architecture** using modern cross-platform technologies to create a comprehensive design platform that integrates architectural, interior, and exterior design capabilities with Vastu Shastra compliance. The system operates **completely offline** with local LLM integration.

**Core Technologies:**
- **Desktop Framework**: Tauri (Rust + TypeScript) for lightweight, secure desktop application
- **Frontend**: React 18 with TypeScript, Shadcn-ui components, Tailwind CSS
- **Backend**: Embedded Rust backend with async runtime (Tokio)
- **Local LLM Integration**: Ollama integration with Llama 3.1, Mistral, or CodeLlama models
- **3D Engine**: Three.js with React Three Fiber for real-time 3D visualization
- **Local Database**: SQLite with embedded storage for all application data
- **Local Network**: Optional LAN-based collaboration using WebRTC
- **File System**: Direct file system access for CAD exports and asset management

**Key Architectural Decisions:**
1. **Desktop-First Architecture**: Native desktop performance with OS-level integrations
2. **Embedded Services Pattern**: All services run as embedded components within the application
3. **Local-First Data**: All data stored locally with optional network sync
4. **Offline-Complete Operation**: Full functionality without internet dependency
5. **Modular Plugin System**: Extensible architecture for additional features

**Open Source Libraries:**
- **Tauri**: Cross-platform desktop application framework
- **Ollama**: Local LLM runtime and model management
- **SQLite**: Embedded database with full-text search
- **Three.js**: 3D graphics and visualization
- **WebRTC**: Peer-to-peer local network collaboration
- **Serde**: Rust serialization for data handling
- **Tokio**: Async runtime for Rust backend
- **React Query**: Data fetching and caching for frontend

## Local LLM Integration Architecture

### 1. Local LLM Service Layer

**Ollama Integration:**
```rust
// Rust backend service for LLM integration
pub struct LocalLLMService {
    ollama_client: OllamaClient,
    model_manager: ModelManager,
    vastu_context: VastuContextManager,
}

impl LocalLLMService {
    pub async fn process_design_request(&self, prompt: String) -> Result<DesignResponse> {
        let enhanced_prompt = self.vastu_context.enhance_prompt(prompt);
        let response = self.ollama_client.generate(enhanced_prompt).await?;
        Ok(self.parse_design_response(response))
    }
    
    pub async fn validate_vastu_compliance(&self, design: &DesignData) -> VastuResult {
        let validation_prompt = self.vastu_context.create_validation_prompt(design);
        let response = self.ollama_client.generate(validation_prompt).await?;
        self.parse_vastu_response(response)
    }
}
```

**Model Management:**
- **Primary Model**: Llama 3.1 8B for general architectural understanding
- **Specialized Model**: Fine-tuned Mistral 7B for Vastu-specific reasoning
- **Code Generation**: CodeLlama for generating CAD export scripts
- **Automatic Model Download**: First-run setup downloads required models
- **Model Switching**: Runtime model selection based on task complexity

### 2. Desktop Application Architecture

**Tauri Application Structure:**
```
src-tauri/
├── src/
│   ├── main.rs              # Application entry point
│   ├── llm/                 # Local LLM integration
│   │   ├── ollama_client.rs # Ollama API client
│   │   ├── model_manager.rs # Model lifecycle management
│   │   └── vastu_engine.rs  # Vastu-specific LLM processing
│   ├── database/            # SQLite database layer
│   │   ├── models.rs        # Data models and schemas
│   │   ├── migrations.rs    # Database migrations
│   │   └── repositories.rs  # Data access layer
│   ├── services/            # Core business logic
│   │   ├── design_service.rs    # Design generation and management
│   │   ├── rendering_service.rs # 3D rendering coordination
│   │   ├── export_service.rs    # CAD file export
│   │   └── collaboration_service.rs # Local network collaboration
│   ├── utils/               # Utility functions
│   └── commands.rs          # Tauri command handlers

src/                         # React frontend
├── components/
│   ├── desktop/            # Desktop-specific components
│   │   ├── menu-bar/       # Native menu integration
│   │   ├── file-dialogs/   # File system dialogs
│   │   └── notifications/  # OS notifications
│   ├── design-canvas/      # 3D visualization
│   ├── llm-interface/      # Local LLM interaction
│   └── collaboration/      # LAN collaboration
├── hooks/
│   ├── use-local-llm.ts    # LLM interaction hook
│   ├── use-sqlite.ts       # Database operations
│   └── use-file-system.ts  # File operations
├── stores/
│   ├── design-store.ts     # Design state management
│   ├── llm-store.ts        # LLM state and models
│   └── settings-store.ts   # Application settings
└── services/
    ├── tauri-api.ts        # Tauri backend communication
    ├── ollama-client.ts    # Frontend LLM client
    └── webrtc-client.ts    # P2P collaboration
```

### 3. Local Database Architecture

**SQLite Schema Design:**
```sql
-- Projects and designs
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    design_data TEXT, -- JSON blob for design information
    vastu_score REAL,
    thumbnail BLOB
);

-- Asset libraries (furniture, materials, plants)
CREATE TABLE assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'furniture', 'material', 'plant'
    subcategory TEXT,
    model_path TEXT, -- Path to 3D model file
    texture_paths TEXT, -- JSON array of texture file paths
    dimensions TEXT, -- JSON object with width, height, depth
    vastu_properties TEXT, -- JSON object with Vastu classifications
    metadata TEXT -- Additional properties as JSON
);

-- Vastu rules and principles
CREATE TABLE vastu_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'architectural', 'interior', 'exterior'
    description TEXT,
    conditions TEXT, -- JSON array of conditions
    remedies TEXT, -- JSON array of remedial suggestions
    priority INTEGER DEFAULT 1,
    regional_variant TEXT
);

-- Local collaboration sessions
CREATE TABLE collaboration_sessions (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    session_name TEXT,
    host_ip TEXT,
    participants TEXT, -- JSON array of participant info
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- User preferences and settings
CREATE TABLE user_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Design history and versions
CREATE TABLE design_versions (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    version_name TEXT,
    design_data TEXT, -- JSON snapshot of design state
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
);
```

### 4. Local 3D Rendering Engine

**WebGL-Based Rendering:**
```typescript
// Desktop-optimized 3D rendering service
export class LocalRenderingEngine {
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private assetLoader: LocalAssetLoader;
    
    constructor() {
        this.initializeRenderer();
        this.setupDesktopOptimizations();
    }
    
    private setupDesktopOptimizations() {
        // Enable hardware acceleration
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Desktop-specific performance settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Multi-threading for complex scenes
        this.renderer.capabilities.maxTextures = 32;
    }
    
    async renderDesign(designData: DesignData): Promise<RenderResult> {
        // Load assets from local file system
        const assets = await this.assetLoader.loadDesignAssets(designData);
        
        // Create scene from design data
        const scene = this.createSceneFromDesign(designData, assets);
        
        // Apply Vastu-compliant lighting
        this.applyVastuLighting(scene, designData.vastuCompliance);
        
        return {
            scene,
            thumbnails: await this.generateThumbnails(scene),
            exportReady: true
        };
    }
}
```

### 5. Offline Collaboration System

**Local Network Collaboration:**
```typescript
// WebRTC-based local network collaboration
export class LocalCollaborationService {
    private peerConnections: Map<string, RTCPeerConnection> = new Map();
    private localStream: MediaStream | null = null;
    
    async startCollaborationSession(projectId: string): Promise<SessionInfo> {
        // Create local server for peer discovery
        const sessionInfo = await invoke('create_collaboration_session', { projectId });
        
        // Set up WebRTC for real-time design sharing
        await this.setupPeerConnections();
        
        // Broadcast session availability on local network
        await this.broadcastSessionAvailability(sessionInfo);
        
        return sessionInfo;
    }
    
    async joinSession(sessionId: string, hostIP: string): Promise<void> {
        // Connect to host via WebRTC
        const connection = await this.createPeerConnection(hostIP);
        
        // Sync initial design state
        await this.syncDesignState(connection);
        
        // Set up real-time change broadcasting
        this.setupChangeStreaming(connection);
    }
    
    broadcastDesignChange(change: DesignChange): void {
        // Send change to all connected peers
        this.peerConnections.forEach((connection, peerId) => {
            if (connection.connectionState === 'connected') {
                this.sendChangeToConnection(connection, change);
            }
        });
    }
}
```

### 6. Desktop Security Model

**Local Security Architecture:**
```rust
// Desktop security service
pub struct DesktopSecurityService {
    encryption_key: [u8; 32],
    file_permissions: FilePermissionManager,
}

impl DesktopSecurityService {
    pub fn encrypt_project_data(&self, data: &str) -> Result<Vec<u8>> {
        // Encrypt sensitive project data before saving
        let cipher = ChaCha20Poly1305::new(&self.encryption_key.into());
        cipher.encrypt(&Nonce::from_slice(b"unique nonce"), data.as_bytes())
    }
    
    pub fn secure_asset_access(&self, asset_path: &Path) -> Result<bool> {
        // Validate asset file integrity and permissions
        self.file_permissions.validate_access(asset_path)
    }
    
    pub fn sanitize_llm_output(&self, output: &str) -> String {
        // Remove potentially harmful content from LLM responses
        self.content_filter.sanitize(output)
    }
}
```

**Security Features:**
- **Local Data Encryption**: All project data encrypted at rest
- **File System Sandboxing**: Restricted file system access
- **LLM Output Sanitization**: Filter potentially harmful generated content
- **Network Security**: Optional TLS for local network collaboration
- **Asset Validation**: Verify integrity of 3D models and textures

### 7. Installation and Distribution

**Desktop Installer:**
```toml
# Tauri configuration for desktop distribution
[tauri]
bundle = { identifier = "com.vastuarchitect.app" }

[tauri.bundle]
targets = ["msi", "deb", "dmg", "appimage"]
icon = ["icons/32x32.png", "icons/128x128.png", "icons/icon.icns", "icons/icon.ico"]

[tauri.bundle.windows]
certificateThumbprint = ""
digestAlgorithm = "sha256"
timestampUrl = ""

[tauri.bundle.macOS]
entitlements = "entitlements.plist"
providerShortName = "VastuArchitect"

[tauri.bundle.linux]
appimage = { bundleMediaFramework = true }
```

**First-Run Setup:**
1. **Model Download**: Automatic download of required LLM models (Llama 3.1 8B)
2. **Asset Library**: Install basic furniture, material, and plant libraries
3. **Database Initialization**: Create local SQLite database with sample data
4. **Vastu Rules**: Load comprehensive Vastu Shastra rule database
5. **User Preferences**: Configure default settings and regional preferences

### 8. Performance Optimization for Desktop

**Local Performance Features:**
- **Native File I/O**: Direct file system access for faster asset loading
- **GPU Acceleration**: Hardware-accelerated 3D rendering
- **Multi-threading**: Parallel processing for LLM inference and rendering
- **Memory Management**: Efficient memory usage for large 3D scenes
- **Caching Strategy**: Local file-based caching for frequently used assets

**Hardware Requirements:**
- **Minimum**: 8GB RAM, 4-core CPU, integrated graphics, 10GB storage
- **Recommended**: 16GB RAM, 8-core CPU, dedicated GPU, 50GB storage
- **LLM Processing**: Additional 8GB RAM for local model inference

### 9. Local Asset Management

**File System Organization:**
```
~/VastuArchitect/
├── projects/           # User project files
├── assets/            # 3D models, textures, materials
│   ├── furniture/     # Furniture 3D models
│   ├── materials/     # Texture and material files
│   ├── plants/        # Plant and landscape models
│   └── templates/     # Design templates
├── models/            # LLM model files
│   ├── llama-3.1-8b/ # Primary architectural model
│   ├── mistral-7b/   # Vastu-specialized model
│   └── codellama/     # Code generation model
├── database/          # SQLite database files
├── exports/           # Generated CAD files and drawings
├── cache/             # Temporary and cache files
└── logs/              # Application logs
```

### 10. CAD Integration and Export

**Local CAD Export Service:**
```rust
pub struct LocalCADExportService {
    export_templates: HashMap<CADFormat, ExportTemplate>,
    file_system: FileSystemService,
}

impl LocalCADExportService {
    pub async fn export_to_dwg(&self, design: &DesignData) -> Result<PathBuf> {
        // Generate DWG file using local libraries
        let dwg_data = self.generate_dwg_from_design(design).await?;
        
        // Save to user-specified location
        let export_path = self.file_system.save_export_file(dwg_data, "dwg").await?;
        
        Ok(export_path)
    }
    
    pub async fn export_to_pdf(&self, design: &DesignData) -> Result<PathBuf> {
        // Generate professional PDF drawings
        let pdf_data = self.generate_pdf_drawings(design).await?;
        
        let export_path = self.file_system.save_export_file(pdf_data, "pdf").await?;
        
        Ok(export_path)
    }
}
```

## Anything UNCLEAR

Several aspects require clarification for desktop implementation:

1. **LLM Model Selection**: Which specific local models should be bundled for optimal Vastu understanding
2. **Asset Library Size**: Balance between comprehensive asset library and application size
3. **Regional Vastu Variations**: How to package different regional interpretations in offline mode
4. **Hardware Compatibility**: Minimum system requirements for smooth LLM inference and 3D rendering
5. **Update Mechanism**: Strategy for updating LLM models and asset libraries without internet
6. **Cross-Platform Testing**: Ensuring consistent behavior across Windows, macOS, and Linux
7. **File Format Support**: Priority order for CAD export formats and compatibility requirements
8. **Local Network Security**: Security protocols for LAN-based collaboration features

This desktop architecture provides a complete offline solution while maintaining all the comprehensive design capabilities of the original cloud-based system, with the added benefits of local data control, faster performance, and independence from internet connectivity.