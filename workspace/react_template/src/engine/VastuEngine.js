import VastuRules from '../data/VastuRules.js';

class VastuEngine {
  constructor() {
    this.rules = VastuRules;
  }

  analyzeDesign(designState) {
    const violations = [];
    const suggestions = [];
    let score = 100;

    // Analyze rooms
    designState.rooms.forEach(room => {
      const roomAnalysis = this.analyzeRoom(room, designState.rooms);
      violations.push(...roomAnalysis.violations);
      suggestions.push(...roomAnalysis.suggestions);
      score -= roomAnalysis.penalty;
    });

    // Analyze furniture placement
    designState.furniture.forEach(furniture => {
      const furnitureAnalysis = this.analyzeFurniture(furniture, designState.rooms);
      violations.push(...furnitureAnalysis.violations);
      suggestions.push(...furnitureAnalysis.suggestions);
      score -= furnitureAnalysis.penalty;
    });

    // Ensure score doesn't go below 0
    score = Math.max(0, Math.round(score));

    return {
      score,
      violations,
      suggestions,
      compliance: this.getComplianceLevel(score)
    };
  }

  analyzeRoom(room, allRooms) {
    const violations = [];
    const suggestions = [];
    let penalty = 0;

    const roomRules = this.rules.rooms[room.type] || {};

    // Check direction compliance
    if (roomRules.preferredDirections) {
      const isInPreferredDirection = roomRules.preferredDirections.includes(room.position.direction);
      if (!isInPreferredDirection) {
        violations.push({
          type: 'direction',
          severity: 'medium',
          message: `${room.name} should be placed in ${roomRules.preferredDirections.join(' or ')} direction`
        });
        suggestions.push(`Move ${room.name} to ${roomRules.preferredDirections[0]} for better Vastu compliance`);
        penalty += 10;
      }
    }

    // Check position relative to other rooms
    if (room.type === 'kitchen') {
      const livingRoom = allRooms.find(r => r.type === 'living_room');
      if (livingRoom && this.calculateDistance(room.position, livingRoom.position) < 2) {
        violations.push({
          type: 'proximity',
          severity: 'low',
          message: 'Kitchen should not be too close to living room'
        });
        penalty += 5;
      }
    }

    // Check entrance direction for main rooms
    if (room.type === 'living_room' && room.position.direction !== 'northeast') {
      suggestions.push('Consider placing living room in northeast for positive energy flow');
    }

    return { violations, suggestions, penalty };
  }

  analyzeFurniture(furniture, rooms) {
    const violations = [];
    const suggestions = [];
    let penalty = 0;

    const room = rooms.find(r => r.id === furniture.roomId);
    if (!room) return { violations, suggestions, penalty };

    const furnitureRules = this.rules.furniture[furniture.type] || {};

    // Check furniture placement rules
    if (furniture.type === 'bed' && room.type === 'bedroom') {
      // Bed should not face south
      if (furniture.rotation.y === Math.PI) { // facing south
        violations.push({
          type: 'orientation',
          severity: 'medium',
          message: 'Bed should not face south direction'
        });
        suggestions.push('Rotate bed to face east or north for better sleep quality');
        penalty += 8;
      }
    }

    if (furniture.type === 'sofa' && room.type === 'living_room') {
      // Sofa should face east or north
      const facingDirection = this.getFurnitureFacingDirection(furniture.rotation.y);
      if (!['east', 'north'].includes(facingDirection)) {
        suggestions.push('Position sofa to face east or north for positive energy');
        penalty += 3;
      }
    }

    return { violations, suggestions, penalty };
  }

  calculateDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.z - pos2.z, 2));
  }

  getFurnitureFacingDirection(rotationY) {
    const angle = (rotationY * 180) / Math.PI;
    if (angle >= -45 && angle < 45) return 'north';
    if (angle >= 45 && angle < 135) return 'east';
    if (angle >= 135 || angle < -135) return 'south';
    return 'west';
  }

  getComplianceLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }

  // Get Vastu recommendations for room placement
  getRecommendedPosition(roomType, existingRooms = []) {
    const roomRules = this.rules.rooms[roomType];
    if (!roomRules || !roomRules.preferredDirections) {
      return { x: 0, z: 0, direction: 'north' };
    }

    const preferredDirection = roomRules.preferredDirections[0];
    const positions = {
      'north': { x: 0, z: 3, direction: 'north' },
      'south': { x: 0, z: -3, direction: 'south' },
      'east': { x: 3, z: 0, direction: 'east' },
      'west': { x: -3, z: 0, direction: 'west' },
      'northeast': { x: 2, z: 2, direction: 'northeast' },
      'northwest': { x: -2, z: 2, direction: 'northwest' },
      'southeast': { x: 2, z: -2, direction: 'southeast' },
      'southwest': { x: -2, z: -2, direction: 'southwest' }
    };

    return positions[preferredDirection] || { x: 0, z: 0, direction: 'north' };
  }
}

export default new VastuEngine();