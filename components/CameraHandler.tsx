
import React, { useRef, useEffect, useState } from 'react';
import { detectHandGesture } from '../services/geminiService';
import { HandState } from '../types';

interface CameraHandlerProps {
  onHandStateChange: (state: HandState) => void;
  setProcessing: (val: boolean) => void;
}

const CameraHandler: React.FC<CameraHandlerProps> = ({ onHandStateChange, setProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240, facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Camera access is required for gesture control.");
      }
    }
    setupCamera();

    // Polling Gemini for gesture recognition
    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64Image = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
          
          setProcessing(true);
          const result = await detectHandGesture(base64Image);
          onHandStateChange(result.state);
          setProcessing(false);
        }
      }
    }, 2000); // 2 seconds delay to avoid API rate limits and ensure some fluidity

    return () => clearInterval(interval);
  }, [onHandStateChange, setProcessing]);

  if (error) {
    return (
      <div className="fixed bottom-6 right-6 z-30 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-xs backdrop-blur-md">
        {error}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 group">
      <div className="relative w-40 h-30 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transition-all duration-500 group-hover:scale-105">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
        />
        <canvas ref={canvasRef} width={320} height={240} className="hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-2 left-2 flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">LIVE GESTURE</span>
        </div>
      </div>
    </div>
  );
};

export default CameraHandler;
