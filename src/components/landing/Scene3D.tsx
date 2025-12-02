import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

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
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        size={0.03}
        color="#ff8b7b"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function AnimatedRing({ position, color }: { position: [number, number, number]; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ringRef} position={position}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} transparent opacity={0.5} />
      </mesh>
    </Float>
  );
}

export function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff5a3c" />
          
          {/* Main floating orbs */}
          <FloatingOrb position={[3, 1, -2]} color="#ff5a3c" scale={0.8} speed={1.2} />
          <FloatingOrb position={[-3.5, -0.5, -3]} color="#ff8b7b" scale={0.6} speed={0.8} />
          <FloatingOrb position={[4, -2, -4]} color="#9b4dca" scale={0.5} speed={1.5} />
          <FloatingOrb position={[-2, 2, -2]} color="#ffb2c3" scale={0.4} speed={1} />
          <FloatingOrb position={[0, -3, -5]} color="#6b2c91" scale={0.7} speed={0.7} />
          
          {/* Animated rings */}
          <AnimatedRing position={[2.5, 0.5, -3]} color="#ff5a3c" />
          <AnimatedRing position={[-2, -1.5, -4]} color="#9b4dca" />
          
          {/* Particle field */}
          <ParticleField />
          
          {/* Background stars */}
          <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
