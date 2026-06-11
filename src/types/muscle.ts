export type Region = 'Upper Limb' | 'Lower Limb' | 'Trunk' | 'Head & Neck';

export interface MuscleModel3D {
  position: [number, number, number];
  scale: [number, number, number];
  side?: 'left' | 'right' | 'center';
}

export interface Muscle {
  id: number;
  name: string;
  region: Region;
  function: string;
  origin: string;
  insertion: string;
  innervation: string;
  bloodSupply: string;
  actions: string[];
  clinicalImportance: string;
  image: string;
  view: 'front' | 'back' | 'both';
  hotspot: { x: number; y: number; width: number; height: number };
  model3d?: MuscleModel3D;
}

export interface QuizQuestion {
  id: number;
  type: 'identify' | 'function';
  prompt: string;
  answer: string;
  options: string[];
  muscleId?: number;
}
