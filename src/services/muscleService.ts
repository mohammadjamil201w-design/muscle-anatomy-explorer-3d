import muscles from '../data/muscles.json';
import type { Muscle, Region } from '../types/muscle';

export const allMuscles = muscles as Muscle[];
export const regions: Region[] = ['Upper Limb', 'Lower Limb', 'Trunk', 'Head & Neck'];
export const getMuscleById = (id: string | number) => allMuscles.find(m => m.id === Number(id));
export const getActions = () => Array.from(new Set(allMuscles.flatMap(m => m.actions))).sort();
export const searchMuscles = (query: string, region = 'All', action = 'All') => {
  const q = query.trim().toLowerCase();
  return allMuscles.filter(m =>
    (!q || [m.name, m.function, m.origin, m.insertion].some(v => v.toLowerCase().includes(q))) &&
    (region === 'All' || m.region === region) &&
    (action === 'All' || m.actions.includes(action))
  );
};
