const VastuRules = {
  rooms: {
    bedroom: {
      preferredDirections: ['southwest', 'south', 'west'],
      avoidDirections: ['northeast', 'southeast'],
      description: 'Master bedroom should be in southwest, children bedrooms in west or south',
      energyType: 'rest',
      colors: ['light blue', 'green', 'pink', 'white'],
      avoidColors: ['red', 'black']
    },
    kitchen: {
      preferredDirections: ['southeast', 'east'],
      avoidDirections: ['northeast', 'northwest', 'southwest'],
      description: 'Kitchen should be in southeast corner with cooking facing east',
      energyType: 'fire',
      colors: ['yellow', 'orange', 'red', 'pink'],
      avoidColors: ['blue', 'black']
    },
    living_room: {
      preferredDirections: ['northeast', 'north', 'east'],
      avoidDirections: ['southwest'],
      description: 'Living room should be in northeast for positive energy and social harmony',
      energyType: 'social',
      colors: ['white', 'light yellow', 'light green', 'light blue'],
      avoidColors: ['dark colors', 'red']
    },
    bathroom: {
      preferredDirections: ['northwest', 'west', 'south'],
      avoidDirections: ['northeast', 'east', 'center'],
      description: 'Bathrooms should be in northwest or west, never in northeast',
      energyType: 'cleansing',
      colors: ['white', 'light blue', 'light green'],
      avoidColors: ['red', 'black', 'dark blue']
    },
    dining_room: {
      preferredDirections: ['east', 'west', 'north'],
      avoidDirections: ['south'],
      description: 'Dining room should be adjacent to kitchen, facing east while eating',
      energyType: 'nourishment',
      colors: ['light green', 'yellow', 'orange'],
      avoidColors: ['blue', 'black']
    },
    study_room: {
      preferredDirections: ['northeast', 'east', 'north'],
      avoidDirections: ['southwest'],
      description: 'Study room should be in northeast for enhanced concentration and learning',
      energyType: 'knowledge',
      colors: ['white', 'light yellow', 'light green'],
      avoidColors: ['red', 'black']
    },
    pooja_room: {
      preferredDirections: ['northeast', 'east'],
      avoidDirections: ['south', 'southwest', 'northwest'],
      description: 'Prayer room should be in northeast corner for spiritual energy',
      energyType: 'spiritual',
      colors: ['white', 'light yellow', 'saffron'],
      avoidColors: ['black', 'red', 'blue']
    }
  },

  furniture: {
    bed: {
      placement: 'Place bed in southwest corner of bedroom',
      direction: 'Head should be towards south or east while sleeping',
      avoid: 'Never place bed under a beam or in front of mirror',
      materials: ['wood'],
      avoidMaterials: ['metal']
    },
    sofa: {
      placement: 'Place sofa against south or west wall',
      direction: 'Should face north or east',
      avoid: 'Avoid placing sofa in center of room',
      materials: ['wood', 'fabric'],
      avoidMaterials: []
    },
    dining_table: {
      placement: 'Place in east or west portion of dining room',
      direction: 'Face east while eating',
      avoid: 'Avoid irregular shaped tables',
      shape: 'rectangular or square',
      materials: ['wood']
    },
    study_table: {
      placement: 'Place in east or north wall',
      direction: 'Face east or north while studying',
      avoid: 'Avoid placing back towards door',
      materials: ['wood'],
      lighting: 'Good natural light from left side'
    },
    wardrobe: {
      placement: 'Place in south or west wall',
      direction: 'Opening should face north or east',
      avoid: 'Avoid placing in northeast corner',
      materials: ['wood']
    }
  },

  entrance: {
    main_door: {
      preferredDirections: ['northeast', 'north', 'east'],
      avoidDirections: ['southwest', 'south'],
      description: 'Main entrance should be in northeast for prosperity',
      size: 'Should be larger than other doors',
      materials: ['wood'],
      colors: ['natural wood', 'light colors'],
      threshold: 'Should have a threshold'
    }
  },

  colors: {
    northeast: ['white', 'light yellow', 'light blue', 'light green'],
    east: ['white', 'light green', 'light blue'],
    southeast: ['orange', 'red', 'pink', 'yellow'],
    south: ['red', 'orange', 'pink'],
    southwest: ['yellow', 'brown', 'beige'],
    west: ['white', 'yellow', 'light blue'],
    northwest: ['white', 'light blue', 'grey'],
    north: ['white', 'light green', 'light blue'],
    center: ['white', 'light yellow']
  },

  elements: {
    fire: {
      direction: 'southeast',
      rooms: ['kitchen'],
      colors: ['red', 'orange', 'yellow'],
      avoid: 'northeast, northwest'
    },
    water: {
      direction: 'northeast',
      rooms: ['bathroom', 'well'],
      colors: ['blue', 'white'],
      avoid: 'southeast, southwest'
    },
    earth: {
      direction: 'southwest',
      rooms: ['bedroom', 'storage'],
      colors: ['yellow', 'brown'],
      avoid: 'northeast'
    },
    air: {
      direction: 'northwest',
      rooms: ['guest_room'],
      colors: ['white', 'grey'],
      avoid: 'southeast'
    },
    space: {
      direction: 'center',
      rooms: ['courtyard', 'hall'],
      colors: ['white'],
      avoid: 'heavy structures'
    }
  },

  general_principles: {
    center: 'Keep center of house open and clutter-free',
    natural_light: 'Maximize natural light, especially from east',
    ventilation: 'Ensure good cross-ventilation',
    clutter: 'Avoid clutter, especially in northeast',
    mirrors: 'Place mirrors on north or east walls',
    plants: 'Keep plants in east or north, avoid thorny plants inside',
    water_storage: 'Store water in northeast',
    heavy_items: 'Place heavy furniture in south or west'
  }
};

export default VastuRules;