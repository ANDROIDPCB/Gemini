
import React from 'react';
import { ShapeType, AppSettings, HandState } from '../types';

interface UIPanelProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  handState: HandState;
  onToggleFullscreen: () => void;
  isProcessing: boolean;
}

const shapes: { id: ShapeType; label: string; icon: string }[] = [
  { id: 'sphere', label: 'Sphere', icon: '🌐' },
  { id: 'cube', label: 'Cube', icon: '📦' },
  { id: 'heart', label: 'Heart', icon: '❤️' },
  { id: 'bottle', label: 'Bottle', icon: '🍾' },
  { id: 'torus', label: 'Torus', icon: '🍩' },
  { id: 'star', label: 'Star', icon: '⭐' },
];

const UIPanel: React.FC<UIPanelProps> = ({ 
  settings, 
  setSettings, 
  handState, 
  onToggleFullscreen,
  isProcessing 
}) => {
  return (
    <div className="fixed top-6 left-6 z-20 w-80 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ZENITH PARTICLES
        </h1>
        <button 
          onClick={onToggleFullscreen}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Toggle Fullscreen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-white/50 uppercase mb-2 block">Choose Pattern</label>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSettings(prev => ({ ...prev, shape: s.id }))}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  settings.shape === s.id 
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-white/5 border-transparent hover:border-white/20'
                }`}
              >
                <span className="text-xl mb-1">{s.icon}</span>
                <span className="text-[10px]">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-white/50 uppercase">Color Theme</label>
              <input 
                type="color" 
                value={settings.color}
                onChange={(e) => setSettings(prev => ({ ...prev, color: e.target.value }))}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
              />
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden flex">
              <div className="flex-1 bg-blue-500"></div>
              <div className="flex-1 bg-purple-500"></div>
              <div className="flex-1 bg-pink-500"></div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-white/50 uppercase mb-2 block">Particle Density</label>
            <input 
              type="range" 
              min="5000" 
              max="30000" 
              step="1000"
              value={settings.particleCount}
              onChange={(e) => setSettings(prev => ({ ...prev, particleCount: parseInt(e.target.value) }))}
              className="w-full accent-blue-500 bg-white/10 rounded-lg appearance-none h-1"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl">
          <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
          <div className="flex-1">
            <p className="text-[10px] uppercase text-white/40 leading-none mb-1">Gesture Detector</p>
            <p className="text-sm font-medium">
              {handState === 'open' ? '🖐️ Open (Expanded)' : handState === 'closed' ? '✊ Closed (Contracted)' : '🔍 Searching...'}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-white/30 text-center italic">
        Tip: Open hand to scatter, close fist to condense.
      </p>
    </div>
  );
};

export default UIPanel;
