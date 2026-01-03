
import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Bloom, EffectComposer } from '@react-three/drei';
import ParticleScene from './components/ParticleScene';
import UIPanel from './components/UIPanel';
import CameraHandler from './components/CameraHandler';
import { AppSettings, HandState } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    color: '#3b82f6',
    shape: 'sphere',
    particleCount: 15000,
    particleSize: 0.1,
    sensitivity: 1.0,
  });

  const [handState, setHandState] = useState<HandState>('none');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="w-full h-screen relative bg-[#050505]">
      {/* Three.js Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        <PerspectiveCamera makeDefault position={[0, 0, 40]} fov={60} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ParticleScene settings={settings} handState={handState} />

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={10}
          maxDistance={100}
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4} 
          />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      <UIPanel 
        settings={settings} 
        setSettings={setSettings} 
        handState={handState}
        onToggleFullscreen={toggleFullscreen}
        isProcessing={isProcessing}
      />

      {/* Camera and Gesture Handling */}
      <CameraHandler 
        onHandStateChange={setHandState} 
        setProcessing={setIsProcessing}
      />

      {/* Footer Branding */}
      <div className="fixed bottom-6 left-6 z-10 pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium">
          Powered by Gemini Vision & Three.js Engine
        </p>
      </div>
    </div>
  );
};

export default App;
