import OllamaService from './OllamaService.js';

class LLMService {
  constructor() {
    this.isConnected = false;
    this.ollamaService = OllamaService;
    this.useOllama = false;
  }

  async initialize() {
    try {
      // Try to connect to Ollama first
      this.useOllama = await this.ollamaService.initialize();
      this.isConnected = this.useOllama;
      
      if (this.useOllama) {
        console.log('LLMService: Using Ollama for AI processing');
      } else {
        console.log('LLMService: Using mock responses (Ollama not available)');
        this.isConnected = true; // Still functional with mock responses
      }
      
      return this.isConnected;
    } catch (error) {
      console.warn('LLM initialization failed, using mock responses:', error);
      this.useOllama = false;
      this.isConnected = true;
      return true;
    }
  }

  async processDesignRequest(userInput, currentState) {
    if (!this.isConnected) {
      await this.initialize();
    }

    try {
      if (this.useOllama) {
        // Use real Ollama service
        return await this.ollamaService.generateDesign(userInput, currentState);
      } else {
        // Use mock responses with enhanced pattern matching
        return this.generateMockResponse(userInput, currentState);
      }
    } catch (error) {
      console.error('Design request processing failed:', error);
      // Fallback to mock response
      return this.generateMockResponse(userInput, currentState);
    }
  }

  generateMockResponse(userInput, currentState) {
    const input = userInput.toLowerCase();
    
    // Enhanced pattern matching for better mock responses
    if (input.includes('house') || input.includes('home')) {
      return this.generateHouseLayout(input, currentState);
    } else if (input.includes('bedroom') || input.includes('room')) {
      return this.generateRoomCommand(input, currentState);
    } else if (input.includes('kitchen')) {
      return this.generateKitchenCommand(input, currentState);
    } else if (input.includes('living') || input.includes('hall')) {
      return this.generateLivingRoomCommand(input, currentState);
    } else if (input.includes('bathroom') || input.includes('toilet')) {
      return this.generateBathroomCommand(input, currentState);
    } else if (input.includes('furniture') || input.includes('bed') || input.includes('sofa')) {
      return this.generateFurnitureCommand(input, currentState);
    } else if (input.includes('entrance') || input.includes('door')) {
      return this.generateEntranceCommand(input, currentState);
    } else {
      return this.generateGenericCommand(input, currentState);
    }
  }

  generateHouseLayout(input, currentState) {
    // Generate a complete house layout
    const rooms = [];
    
    // Extract number of bedrooms if mentioned
    const bedroomMatch = input.match(/(\d+)\s*bedroom/);
    const numBedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : 2;
    
    // Master bedroom in southwest
    rooms.push({
      type: 'ADD_ROOM',
      data: {
        id: `room_${Date.now()}_1`,
        name: 'Master Bedroom',
        type: 'bedroom',
        position: { x: -3, z: -3, direction: 'southwest' },
        dimensions: { width: 4, height: 3, depth: 4 },
        vastuCompliant: true,
        color: '#8b5cf6',
        vastuReason: 'Master bedroom in southwest for stability and earth element'
      }
    });

    // Additional bedrooms
    for (let i = 2; i <= numBedrooms; i++) {
      rooms.push({
        type: 'ADD_ROOM',
        data: {
          id: `room_${Date.now()}_${i}`,
          name: `Bedroom ${i}`,
          type: 'bedroom',
          position: { x: i === 2 ? -3 : 3, z: i === 2 ? 2 : -1, direction: i === 2 ? 'west' : 'south' },
          dimensions: { width: 3, height: 3, depth: 3 },
          vastuCompliant: true,
          color: '#8b5cf6'
        }
      });
    }

    // Kitchen in southeast
    rooms.push({
      type: 'ADD_ROOM',
      data: {
        id: `kitchen_${Date.now()}`,
        name: 'Kitchen',
        type: 'kitchen',
        position: { x: 3, z: -3, direction: 'southeast' },
        dimensions: { width: 3, height: 3, depth: 3 },
        vastuCompliant: true,
        color: '#f59e0b',
        vastuReason: 'Kitchen in southeast (Agneya) for fire element'
      }
    });

    // Living room in northeast
    rooms.push({
      type: 'ADD_ROOM',
      data: {
        id: `living_${Date.now()}`,
        name: 'Living Room',
        type: 'living_room',
        position: { x: 2, z: 2, direction: 'northeast' },
        dimensions: { width: 5, height: 3, depth: 4 },
        vastuCompliant: true,
        color: '#10b981',
        vastuReason: 'Living room in northeast for positive energy'
      }
    });

    // Bathroom in northwest
    rooms.push({
      type: 'ADD_ROOM',
      data: {
        id: `bathroom_${Date.now()}`,
        name: 'Bathroom',
        type: 'bathroom',
        position: { x: -2, z: 3, direction: 'northwest' },
        dimensions: { width: 2, height: 3, depth: 2 },
        vastuCompliant: true,
        color: '#3b82f6',
        vastuReason: 'Bathroom in northwest for water element'
      }
    });

    return {
      type: 'MULTIPLE_ROOMS',
      data: rooms,
      explanation: `Generated ${numBedrooms}-bedroom house layout following Vastu principles: Master bedroom (SW), Kitchen (SE), Living room (NE), Bathroom (NW)`
    };
  }

  generateRoomCommand(input, currentState) {
    const roomCount = currentState.rooms.length;
    
    let roomType = 'bedroom';
    if (input.includes('kitchen')) roomType = 'kitchen';
    else if (input.includes('living') || input.includes('hall')) roomType = 'living_room';
    else if (input.includes('bathroom') || input.includes('toilet')) roomType = 'bathroom';
    else if (input.includes('study')) roomType = 'study_room';
    else if (input.includes('dining')) roomType = 'dining_room';

    const vastuPositions = {
      bedroom: { x: -2, z: -2, direction: 'southwest' },
      kitchen: { x: 3, z: -3, direction: 'southeast' },
      living_room: { x: 2, z: 2, direction: 'northeast' },
      bathroom: { x: -3, z: 2, direction: 'northwest' },
      study_room: { x: 2, z: 3, direction: 'northeast' },
      dining_room: { x: 1, z: -2, direction: 'east' }
    };

    const position = vastuPositions[roomType] || { x: roomCount * 2, z: 0, direction: 'north' };

    return {
      type: 'ADD_ROOM',
      data: {
        id: `room_${Date.now()}`,
        name: `${roomType.replace('_', ' ')} ${roomCount + 1}`,
        type: roomType,
        position: position,
        dimensions: { width: roomType === 'living_room' ? 5 : 3, height: 3, depth: roomType === 'living_room' ? 4 : 3 },
        vastuCompliant: true,
        color: this.getRoomColor(roomType),
        vastuReason: this.getVastuReason(roomType, position.direction)
      },
      explanation: `Added ${roomType.replace('_', ' ')} in ${position.direction} direction following Vastu principles`
    };
  }

  generateKitchenCommand(input, currentState) {
    return {
      type: 'ADD_ROOM',
      data: {
        id: `kitchen_${Date.now()}`,
        name: 'Kitchen',
        type: 'kitchen',
        position: { x: 3, z: -3, direction: 'southeast' },
        dimensions: { width: 3, height: 3, depth: 3 },
        vastuCompliant: true,
        color: '#f59e0b',
        vastuReason: 'Kitchen in southeast (Agneya) corner for fire element and cooking facing east'
      },
      explanation: 'Kitchen positioned in southeast corner as per Vastu principles for fire element'
    };
  }

  generateLivingRoomCommand(input, currentState) {
    return {
      type: 'ADD_ROOM',
      data: {
        id: `living_${Date.now()}`,
        name: 'Living Room',
        type: 'living_room',
        position: { x: 2, z: 2, direction: 'northeast' },
        dimensions: { width: 5, height: 3, depth: 4 },
        vastuCompliant: true,
        color: '#10b981',
        vastuReason: 'Living room in northeast (Ishaan) for positive energy and social harmony'
      },
      explanation: 'Living room positioned in northeast corner for positive energy flow and social interactions'
    };
  }

  generateBathroomCommand(input, currentState) {
    return {
      type: 'ADD_ROOM',
      data: {
        id: `bathroom_${Date.now()}`,
        name: 'Bathroom',
        type: 'bathroom',
        position: { x: -2, z: 3, direction: 'northwest' },
        dimensions: { width: 2, height: 3, depth: 2 },
        vastuCompliant: true,
        color: '#3b82f6',
        vastuReason: 'Bathroom in northwest for water element, avoiding northeast'
      },
      explanation: 'Bathroom positioned in northwest corner following Vastu water element placement'
    };
  }

  generateFurnitureCommand(input, currentState) {
    const furnitureType = this.extractFurnitureType(input);
    const roomId = currentState.rooms[0]?.id || 'default';

    return {
      type: 'ADD_FURNITURE',
      data: {
        id: `furniture_${Date.now()}`,
        type: furnitureType,
        roomId: roomId,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        vastuCompliant: true,
        vastuReason: this.getFurnitureVastuReason(furnitureType)
      },
      explanation: `Added ${furnitureType} with Vastu-compliant positioning`
    };
  }

  generateEntranceCommand(input, currentState) {
    return {
      type: 'ADD_ENTRANCE',
      data: {
        id: `entrance_${Date.now()}`,
        name: 'Main Entrance',
        position: { x: 0, z: 4, direction: 'north' },
        dimensions: { width: 1.5, height: 2.5, depth: 0.2 },
        vastuCompliant: true,
        vastuReason: 'Main entrance facing north for prosperity and positive energy'
      },
      explanation: 'Main entrance positioned facing north as per Vastu principles for prosperity'
    };
  }

  generateGenericCommand(input, currentState) {
    return this.generateRoomCommand('bedroom', currentState);
  }

  extractFurnitureType(input) {
    if (input.includes('bed')) return 'bed';
    if (input.includes('sofa') || input.includes('couch')) return 'sofa';
    if (input.includes('table')) return 'table';
    if (input.includes('chair')) return 'chair';
    if (input.includes('wardrobe') || input.includes('closet')) return 'wardrobe';
    return 'bed';
  }

  getRoomColor(roomType) {
    const colors = {
      bedroom: '#8b5cf6',
      kitchen: '#f59e0b',
      living_room: '#10b981',
      bathroom: '#3b82f6',
      study_room: '#06b6d4',
      dining_room: '#84cc16',
      default: '#6b7280'
    };
    return colors[roomType] || colors.default;
  }

  getVastuReason(roomType, direction) {
    const reasons = {
      bedroom: `Bedroom in ${direction} for rest and stability`,
      kitchen: `Kitchen in ${direction} for fire element and cooking facing east`,
      living_room: `Living room in ${direction} for positive energy and social harmony`,
      bathroom: `Bathroom in ${direction} for water element placement`,
      study_room: `Study room in ${direction} for enhanced concentration and learning`,
      dining_room: `Dining room in ${direction} for nourishment and family bonding`
    };
    return reasons[roomType] || `Room positioned in ${direction} following Vastu principles`;
  }

  getFurnitureVastuReason(furnitureType) {
    const reasons = {
      bed: 'Bed positioned with head towards south/east for better sleep',
      sofa: 'Sofa facing north/east for positive energy',
      table: 'Table positioned for optimal functionality and energy flow',
      chair: 'Chair positioned for comfort and positive energy',
      wardrobe: 'Wardrobe placed against south/west wall'
    };
    return reasons[furnitureType] || 'Furniture positioned following Vastu guidelines';
  }

  // Desktop-specific methods
  getConnectionStatus() {
    if (this.useOllama) {
      return this.ollamaService.getConnectionStatus();
    }
    return {
      connected: this.isConnected,
      currentModel: 'mock',
      availableModels: ['mock'],
      baseUrl: 'localhost'
    };
  }

  async getAvailableModels() {
    if (this.useOllama) {
      return await this.ollamaService.getAvailableModels();
    }
    return [{ name: 'mock', size: 0 }];
  }

  setModel(modelName) {
    if (this.useOllama) {
      return this.ollamaService.setModel(modelName);
    }
    return true;
  }
}

export default new LLMService();