import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Character3D } from './Character3D';

function FloatingOrb({ position, color, scale = 1, speed = 1 }: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.5}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 150;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffb2c3"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function HeartParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 30;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      // Make particles float upward
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += 0.01;
        if (posArray[i * 3 + 1] > 10) {
          posArray[i * 3 + 1] = -10;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ff6b9d"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff5a3c" />
          <pointLight position={[5, 5, 5]} intensity={0.3} color="#ff7eb3" />
          
          {/* 3D Characters - Male and Female welcoming */}
          <Character3D position={[-3.5, -0.5, 0]} gender="female" scale={0.9} />
          <Character3D position={[3.5, -0.5, 0]} gender="male" scale={0.95} />
          
          {/* Smaller floating orbs for atmosphere */}
          <FloatingOrb position={[0, 3, -5]} color="#ff5a3c" scale={0.4} speed={1.2} />
          <FloatingOrb position={[-5, 1, -6]} color="#ff8b7b" scale={0.3} speed={0.8} />
          <FloatingOrb position={[5, -2, -7]} color="#9b4dca" scale={0.35} speed={1.5} />
          <FloatingOrb position={[0, -3, -6]} color="#ffb2c3" scale={0.25} speed={1} />
          
          {/* Particle effects */}
          <ParticleField />
          <HeartParticles />
          
          {/* Background stars */}
          <Stars radius={50} depth={50} count={800} factor={4} saturation={0} fade speed={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
