class LLMService {
  constructor() {
    this.isConnected = false;
    this.ollamaUrl = 'http://localhost:11434'; // Default Ollama URL
  }

  async initialize() {
    try {
      // Check if Ollama is running
      const response = await fetch(`${this.ollamaUrl}/api/tags`);
      this.isConnected = response.ok;
      return this.isConnected;
    } catch (error) {
      console.warn('Ollama not available, using mock responses');
      this.isConnected = false;
      return false;
    }
  }

  async processDesignRequest(userInput, currentState) {
    // For MVP, we'll use mock responses with pattern matching
    // In production, this would send to Ollama with Vastu-aware prompts
    
    const input = userInput.toLowerCase();
    
    // Pattern matching for common design requests
    if (input.includes('bedroom') || input.includes('room')) {
      return this.generateRoomCommand(input, currentState);
    } else if (input.includes('kitchen')) {
      return this.generateKitchenCommand(input, currentState);
    } else if (input.includes('living') || input.includes('hall')) {
      return this.generateLivingRoomCommand(input, currentState);
    } else if (input.includes('furniture') || input.includes('bed') || input.includes('sofa')) {
      return this.generateFurnitureCommand(input, currentState);
    } else {
      return this.generateGenericCommand(input, currentState);
    }
  }

  generateRoomCommand(input, currentState) {
    const roomCount = currentState.rooms.length;
    
    // Extract room type from input
    let roomType = 'bedroom';
    if (input.includes('kitchen')) roomType = 'kitchen';
    else if (input.includes('living') || input.includes('hall')) roomType = 'living_room';
    else if (input.includes('bathroom') || input.includes('toilet')) roomType = 'bathroom';

    // Vastu-compliant positioning
    const vastuPositions = {
      bedroom: { x: 2, z: 2, direction: 'southwest' },
      kitchen: { x: 3, z: -3, direction: 'southeast' },
      living_room: { x: -2, z: 2, direction: 'northeast' },
      bathroom: { x: -3, z: -2, direction: 'northwest' }
    };

    const position = vastuPositions[roomType] || { x: roomCount * 2, z: 0, direction: 'north' };

    return {
      type: 'ADD_ROOM',
      data: {
        id: `room_${Date.now()}`,
        name: `${roomType.replace('_', ' ')} ${roomCount + 1}`,
        type: roomType,
        position: position,
        dimensions: { width: 4, height: 3, depth: 3 },
        vastuCompliant: true,
        color: this.getRoomColor(roomType)
      }
    };
  }

  generateKitchenCommand(input, currentState) {
    return {
      type: 'ADD_ROOM',
      data: {
        id: `kitchen_${Date.now()}`,
        name: 'Kitchen',
        type: 'kitchen',
        position: { x: 3, z: -3, direction: 'southeast' }, // Vastu-compliant
        dimensions: { width: 3, height: 3, depth: 3 },
        vastuCompliant: true,
        color: '#f59e0b'
      }
    };
  }

  generateLivingRoomCommand(input, currentState) {
    return {
      type: 'ADD_ROOM',
      data: {
        id: `living_${Date.now()}`,
        name: 'Living Room',
        type: 'living_room',
        position: { x: -2, z: 2, direction: 'northeast' }, // Vastu-compliant
        dimensions: { width: 5, height: 3, depth: 4 },
        vastuCompliant: true,
        color: '#10b981'
      }
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
        vastuCompliant: true
      }
    };
  }

  generateGenericCommand(input, currentState) {
    // Default to creating a simple room
    return this.generateRoomCommand('bedroom', currentState);
  }

  extractFurnitureType(input) {
    if (input.includes('bed')) return 'bed';
    if (input.includes('sofa') || input.includes('couch')) return 'sofa';
    if (input.includes('table')) return 'table';
    if (input.includes('chair')) return 'chair';
    return 'bed'; // default
  }

  getRoomColor(roomType) {
    const colors = {
      bedroom: '#8b5cf6',
      kitchen: '#f59e0b',
      living_room: '#10b981',
      bathroom: '#3b82f6',
      default: '#6b7280'
    };
    return colors[roomType] || colors.default;
  }

  // Future: Real Ollama integration
  async sendToOllama(prompt) {
    if (!this.isConnected) return null;

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2', // or your preferred model
          prompt: prompt,
          stream: false
        })
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama request failed:', error);
      return null;
    }
  }
}

export default new LLMService();