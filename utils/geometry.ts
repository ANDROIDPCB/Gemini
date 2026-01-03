
import * as THREE from 'three';
import { ShapeType } from '../types';

export const getPointsForShape = (shape: ShapeType, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const temp = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    switch (shape) {
      case 'sphere': {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        temp.setFromSphericalCoords(10, phi, theta);
        break;
      }
      case 'cube': {
        temp.set(
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16
        );
        break;
      }
      case 'heart': {
        const t = Math.random() * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const z = (Math.random() - 0.5) * 5;
        temp.set(x * 0.6, y * 0.6, z);
        break;
      }
      case 'bottle': {
        // Beer/Wine bottle shape logic
        const h = Math.random(); // height 0 to 1
        let radius = 0;
        if (h < 0.6) {
          // Main body
          radius = 4;
        } else if (h < 0.8) {
          // Tapering neck
          const localT = (h - 0.6) / 0.2;
          radius = 4 - (localT * 3);
        } else {
          // Top neck
          radius = 1;
        }
        const angle = Math.random() * Math.PI * 2;
        temp.set(
          Math.cos(angle) * radius,
          (h - 0.5) * 20,
          Math.sin(angle) * radius
        );
        break;
      }
      case 'torus': {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const R = 8;
        const r = 3;
        temp.set(
          (R + r * Math.cos(v)) * Math.cos(u),
          (R + r * Math.cos(v)) * Math.sin(u),
          r * Math.sin(v)
        );
        break;
      }
      case 'star': {
        const p = 5; // number of points
        const angle = Math.random() * Math.PI * 2;
        const r = (i % 2 === 0 ? 10 : 4) * (0.8 + Math.random() * 0.4);
        temp.set(
          Math.cos(angle) * r,
          Math.sin(angle) * r,
          (Math.random() - 0.5) * 2
        );
        break;
      }
    }
    positions[i * 3] = temp.x;
    positions[i * 3 + 1] = temp.y;
    positions[i * 3 + 2] = temp.z;
  }
  return positions;
};
