
export type ShapeType = 'sphere' | 'cube' | 'heart' | 'bottle' | 'torus' | 'star';

export type HandState = 'open' | 'closed' | 'none';

export interface AppSettings {
  color: string;
  shape: ShapeType;
  particleCount: number;
  particleSize: number;
  sensitivity: number;
}

export interface GeminiGestureResponse {
  state: HandState;
  confidence: number;
}
