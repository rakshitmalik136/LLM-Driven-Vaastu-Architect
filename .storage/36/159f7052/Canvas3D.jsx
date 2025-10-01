import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera } from '@react-three/drei';
import FloorPlan from './FloorPlan';
import Room3D from './Room3D';
import { useDesign } from '../context/DesignContext';

const Canvas3D = () => {
  const { state } = useDesign();
  const [viewMode, setViewMode] = useState('3d'); // '2d' | '3d'

  return (
    <div className="w-full h-full relative">
      {/* View Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => setViewMode('2d')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === '2d'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          2D Plan
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === '3d'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          3D View
        </button>
      </div>

      {/* Mode Indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-600">
          <span className="text-sm text-gray-300">Mode: </span>
          <span className="text-sm font-medium text-blue-400 capitalize">
            {state.currentMode}
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 60 }}
        style={{ background: '#1f2937' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Environment */}
          <Environment preset="apartment" />
          
          {/* Grid */}
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#374151"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#4b5563"
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />

          {/* Design Elements */}
          {state.rooms.map((room, index) => (
            <Room3D key={index} room={room} />
          ))}

          {/* Sample Room for Demo */}
          <mesh position={[0, 0.1, 0]} receiveShadow>
            <boxGeometry args={[8, 0.2, 6]} />
            <meshStandardMaterial color="#8b5cf6" opacity={0.3} transparent />
          </mesh>

          {/* Sample Walls */}
          <group>
            {/* North Wall */}
            <mesh position={[0, 1.5, 3]} castShadow>
              <boxGeometry args={[8, 3, 0.2]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            {/* South Wall */}
            <mesh position={[0, 1.5, -3]} castShadow>
              <boxGeometry args={[8, 3, 0.2]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            {/* East Wall */}
            <mesh position={[4, 1.5, 0]} castShadow>
              <boxGeometry args={[0.2, 3, 6]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            {/* West Wall */}
            <mesh position={[-4, 1.5, 0]} castShadow>
              <boxGeometry args={[0.2, 3, 6]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
          </group>

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
          />
        </Suspense>
      </Canvas>

      {/* Loading Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-gray-400 text-sm">
          {state.rooms.length === 0 && 'Start by describing your design in natural language below'}
        </div>
      </div>
    </div>
  );
};

export default Canvas3D;