
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { AppSettings, HandState } from '../types';
import { getPointsForShape } from '../utils/geometry';

interface ParticleSceneProps {
  settings: AppSettings;
  handState: HandState;
}

const ParticleScene: React.FC<ParticleSceneProps> = ({ settings, handState }) => {
  const { viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null!);
  const particlesCount = settings.particleCount;

  // Track target positions for transitions
  const targetPositions = useMemo(() => {
    return getPointsForShape(settings.shape, particlesCount);
  }, [settings.shape, particlesCount]);

  // Initial positions
  const initialPositions = useMemo(() => {
    return new Float32Array(particlesCount * 3);
  }, [particlesCount]);

  const sizes = useMemo(() => {
    const s = new Float32Array(particlesCount);
    for (let i = 0; i < particlesCount; i++) {
      s[i] = Math.random() * 2 + 0.5;
    }
    return s;
  }, [particlesCount]);

  useFrame((state) => {
    const { clock } = state;
    const time = clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Interaction factor based on hand state
    // Open = high expansion (scatter)
    // Closed = low expansion (tight)
    const expansionBase = handState === 'open' ? 2.5 : handState === 'closed' ? 0.4 : 1.0;
    
    // Smoothly interpolate expansion factor
    const currentExp = pointsRef.current.userData.expansion || 1.0;
    const targetExp = THREE.MathUtils.lerp(currentExp, expansionBase, 0.05);
    pointsRef.current.userData.expansion = targetExp;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Target position
      const tx = targetPositions[i3] * targetExp;
      const ty = targetPositions[i3 + 1] * targetExp;
      const tz = targetPositions[i3 + 2] * targetExp;

      // Current position
      const cx = positions[i3];
      const cy = positions[i3 + 1];
      const cz = positions[i3 + 2];

      // Lerp towards target
      positions[i3] = THREE.MathUtils.lerp(cx, tx + Math.sin(time + i) * 0.1, 0.05);
      positions[i3 + 1] = THREE.MathUtils.lerp(cy, ty + Math.cos(time + i * 0.5) * 0.1, 0.05);
      positions[i3 + 2] = THREE.MathUtils.lerp(cz, tz + Math.sin(time * 0.5 + i) * 0.1, 0.05);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={initialPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particlesCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={settings.particleSize}
        color={settings.color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleScene;
