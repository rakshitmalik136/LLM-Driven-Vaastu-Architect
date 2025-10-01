class OllamaService {
  constructor() {
    this.baseUrl = 'http://localhost:11434';
    this.isConnected = false;
    this.availableModels = [];
    this.currentModel = 'llama2';
  }

  async initialize() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        this.availableModels = data.models || [];
        this.isConnected = true;
        
        // Set default model if available
        if (this.availableModels.length > 0) {
          this.currentModel = this.availableModels[0].name;
        }
        
        console.log('Ollama connected successfully');
        console.log('Available models:', this.availableModels.map(m => m.name));
        return true;
      }
    } catch (error) {
      console.warn('Ollama not available:', error.message);
    }
    
    this.isConnected = false;
    return false;
  }

  async generateDesign(userInput, currentDesignState) {
    if (!this.isConnected) {
      throw new Error('Ollama is not connected. Please ensure Ollama is running on localhost:11434');
    }

    const prompt = this.buildVastuDesignPrompt(userInput, currentDesignState);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.currentModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseDesignResponse(data.response);
    } catch (error) {
      console.error('Ollama generation error:', error);
      throw error;
    }
  }

  buildVastuDesignPrompt(userInput, currentDesignState) {
    const roomsDescription = currentDesignState.rooms.length > 0 
      ? `Current rooms: ${currentDesignState.rooms.map(r => `${r.name} (${r.type}) at position ${r.position.direction}`).join(', ')}`
      : 'No rooms currently in the design';

    return `You are a Vastu Shastra expert and architectural designer. Help create building designs that follow traditional Vastu principles.

VASTU PRINCIPLES TO FOLLOW:
- Northeast (Ishaan): Best for entrance, living room, prayer room - represents water element
- Southeast (Agneya): Best for kitchen, fire-related activities - represents fire element
- Southwest (Nairutya): Best for master bedroom, heavy storage - represents earth element
- Northwest (Vayavya): Best for guest rooms, storage - represents air element

ROOM PLACEMENT RULES:
- Kitchen: Southeast corner, cooking facing east
- Master Bedroom: Southwest corner for stability
- Living Room: Northeast for positive energy
- Bathrooms: Northwest or west, never northeast
- Main Entrance: North, northeast, or east preferred

CURRENT DESIGN STATE:
${roomsDescription}

USER REQUEST: "${userInput}"

Please respond with a JSON object containing design commands. Format:
{
  "type": "ADD_ROOM" | "ADD_FURNITURE" | "MODIFY_LAYOUT",
  "data": {
    "name": "room name",
    "type": "bedroom|kitchen|living_room|bathroom",
    "position": {
      "x": number,
      "z": number,
      "direction": "north|south|east|west|northeast|northwest|southeast|southwest"
    },
    "dimensions": {
      "width": number,
      "height": number,
      "depth": number
    },
    "vastuCompliant": boolean,
    "vastuReason": "explanation of Vastu compliance"
  },
  "explanation": "Brief explanation of the design decision and Vastu principles applied"
}

Ensure all suggestions follow Vastu principles and provide clear reasoning.`;
  }

  parseDesignResponse(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const designCommand = JSON.parse(jsonMatch[0]);
        return designCommand;
      }
      
      // Fallback: Parse text response and convert to design command
      return this.parseTextResponse(response);
    } catch (error) {
      console.error('Error parsing Ollama response:', error);
      // Return a default response based on common patterns
      return this.createFallbackResponse(response);
    }
  }

  parseTextResponse(response) {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('kitchen')) {
      return {
        type: 'ADD_ROOM',
        data: {
          name: 'Kitchen',
          type: 'kitchen',
          position: { x: 3, z: -3, direction: 'southeast' },
          dimensions: { width: 3, height: 3, depth: 3 },
          vastuCompliant: true,
          vastuReason: 'Kitchen placed in southeast (Agneya) corner following fire element placement'
        },
        explanation: 'Kitchen positioned in southeast corner as per Vastu principles for fire element'
      };
    }
    
    if (lowerResponse.includes('bedroom')) {
      return {
        type: 'ADD_ROOM',
        data: {
          name: 'Master Bedroom',
          type: 'bedroom',
          position: { x: -3, z: -3, direction: 'southwest' },
          dimensions: { width: 4, height: 3, depth: 4 },
          vastuCompliant: true,
          vastuReason: 'Master bedroom in southwest (Nairutya) for stability and earth element'
        },
        explanation: 'Master bedroom positioned in southwest corner for stability and peaceful rest'
      };
    }
    
    if (lowerResponse.includes('living') || lowerResponse.includes('hall')) {
      return {
        type: 'ADD_ROOM',
        data: {
          name: 'Living Room',
          type: 'living_room',
          position: { x: 2, z: 2, direction: 'northeast' },
          dimensions: { width: 5, height: 3, depth: 4 },
          vastuCompliant: true,
          vastuReason: 'Living room in northeast (Ishaan) for positive energy and water element'
        },
        explanation: 'Living room positioned in northeast corner for positive energy flow and social harmony'
      };
    }

    // Default room creation
    return this.createFallbackResponse(response);
  }

  createFallbackResponse(response) {
    return {
      type: 'ADD_ROOM',
      data: {
        name: 'New Room',
        type: 'bedroom',
        position: { x: 0, z: 0, direction: 'north' },
        dimensions: { width: 3, height: 3, depth: 3 },
        vastuCompliant: true,
        vastuReason: 'Default room placement'
      },
      explanation: `Generated room based on request: ${response.substring(0, 100)}...`
    };
  }

  async getAvailableModels() {
    if (!this.isConnected) {
      await this.initialize();
    }
    return this.availableModels;
  }

  setModel(modelName) {
    if (this.availableModels.some(m => m.name === modelName)) {
      this.currentModel = modelName;
      return true;
    }
    return false;
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      currentModel: this.currentModel,
      availableModels: this.availableModels.map(m => m.name),
      baseUrl: this.baseUrl
    };
  }

  async pullModel(modelName) {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to pull model: ${response.statusText}`);
      }

      // This is a streaming response, but for simplicity we'll just return success
      return true;
    } catch (error) {
      console.error('Error pulling model:', error);
      throw error;
    }
  }
}

export default new OllamaService();