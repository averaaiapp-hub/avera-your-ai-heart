import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
  gender: 'male' | 'female';
  scale?: number;
}

function SmilingFace({ color }: { color: string }) {
  return (
    <group>
      {/* Left eye */}
      <mesh position={[-0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Eye sparkles */}
      <mesh position={[-0.12, 0.12, 0.45]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.18, 0.12, 0.45]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>
      {/* Smile - curved tube */}
      <mesh position={[0, -0.12, 0.38]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.15, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      {/* Rosy cheeks */}
      <mesh position={[-0.28, -0.05, 0.32]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffb3b3" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.28, -0.05, 0.32]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffb3b3" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export function Character3D({ position, gender, scale = 1 }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const armLeftRef = useRef<THREE.Group>(null);
  const armRightRef = useRef<THREE.Group>(null);

  // Colors based on gender
  const skinColor = gender === 'female' ? '#ffd5c8' : '#e8c4a8';
  const hairColor = gender === 'female' ? '#4a3728' : '#2d1f14';
  const shirtColor = gender === 'female' ? '#ff7eb3' : '#6b9fff';
  const pantsColor = gender === 'female' ? '#9b6bff' : '#4a5568';

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      // Slight rotation to look welcoming
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    
    // Waving animation for arms
    if (armRightRef.current) {
      armRightRef.current.rotation.z = -0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
    }
    if (armLeftRef.current) {
      armLeftRef.current.rotation.z = 0.2 + Math.sin(state.clock.elapsedTime * 2 + 1) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Head */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        
        {/* Face */}
        <group position={[0, 1.6, 0]}>
          <SmilingFace color={skinColor} />
        </group>

        {/* Hair */}
        {gender === 'female' ? (
          // Female hair - longer
          <group position={[0, 1.85, 0]}>
            <mesh>
              <sphereGeometry args={[0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            {/* Side hair */}
            <mesh position={[-0.4, -0.4, 0]} rotation={[0, 0, 0.3]}>
              <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            <mesh position={[0.4, -0.4, 0]} rotation={[0, 0, -0.3]}>
              <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
          </group>
        ) : (
          // Male hair - shorter
          <mesh position={[0, 1.95, 0]}>
            <sphereGeometry args={[0.48, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
        )}

        {/* Body/Torso */}
        <mesh position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.35, 0.6, 16, 32]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>

        {/* Left Arm */}
        <group ref={armLeftRef} position={[-0.5, 1, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.1, 0.4, 8, 16]} />
            <meshStandardMaterial color={shirtColor} roughness={0.7} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.8} />
          </mesh>
        </group>

        {/* Right Arm - Waving */}
        <group ref={armRightRef} position={[0.5, 1, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.1, 0.4, 8, 16]} />
            <meshStandardMaterial color={shirtColor} roughness={0.7} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.8} />
          </mesh>
        </group>

        {/* Legs */}
        <mesh position={[-0.18, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>

        {/* Glow effect around character */}
        <pointLight position={[0, 1, 1]} intensity={0.3} color={shirtColor} distance={3} />
      </group>
    </Float>
  );
}
