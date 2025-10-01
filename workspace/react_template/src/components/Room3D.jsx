import React from 'react';

const Room3D = ({ room }) => {
  const { position, dimensions, color, name } = room;

  return (
    <group position={[position.x, 0, position.z]}>
      {/* Floor */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[dimensions.width, 0.2, dimensions.depth]} />
        <meshStandardMaterial color={color} opacity={0.3} transparent />
      </mesh>

      {/* Walls */}
      {/* North Wall */}
      <mesh position={[0, dimensions.height / 2, dimensions.depth / 2]} castShadow>
        <boxGeometry args={[dimensions.width, dimensions.height, 0.2]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* South Wall */}
      <mesh position={[0, dimensions.height / 2, -dimensions.depth / 2]} castShadow>
        <boxGeometry args={[dimensions.width, dimensions.height, 0.2]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* East Wall */}
      <mesh position={[dimensions.width / 2, dimensions.height / 2, 0]} castShadow>
        <boxGeometry args={[0.2, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* West Wall */}
      <mesh position={[-dimensions.width / 2, dimensions.height / 2, 0]} castShadow>
        <boxGeometry args={[0.2, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* Room Label */}
      {/* Note: Text rendering would require additional setup, using a simple marker for now */}
      <mesh position={[0, dimensions.height + 0.5, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

export default Room3D;