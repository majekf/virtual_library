
import React from 'react';
import { Box } from '@react-three/drei';

export default function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      
      {/* Back Wall */}
      <mesh receiveShadow position={[0, 5, -5]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#fdf5e6" />
      </mesh>

      {/* Rug */}
      <mesh receiveShadow position={[0, 0, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 6]} />
        <meshStandardMaterial color="#a0522d" roughness={0.8} />
      </mesh>

      {/* Sofa (simple representation) */}
      <group position={[0, 0.4, 2.5]}>
        <Box args={[2.5, 0.5, 1]} castShadow>
          <meshStandardMaterial color="#8b4513" />
        </Box>
        <Box args={[2.5, 0.8, 0.2]} position={[0, 0.65, -0.4]} castShadow>
          <meshStandardMaterial color="#8b4513" />
        </Box>
      </group>
    </group>
  );
}
