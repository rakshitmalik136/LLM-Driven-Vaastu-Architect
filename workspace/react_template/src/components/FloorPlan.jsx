import React from 'react';
import { useDesign } from '../context/DesignContext';

const FloorPlan = () => {
  const { state } = useDesign();

  return (
    <group>
      {state.rooms.map((room, index) => (
        <mesh
          key={room.id}
          position={[room.position.x, 0.1, room.position.z]}
          receiveShadow
        >
          <boxGeometry args={[room.dimensions.width, 0.2, room.dimensions.depth]} />
          <meshStandardMaterial 
            color={room.color} 
            opacity={0.7} 
            transparent 
          />
        </mesh>
      ))}
    </group>
  );
};

export default FloorPlan;