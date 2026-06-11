import { useLocalStorage } from '../hooks/useLocalStorage';
import { allMuscles } from '../services/muscleService';
import MuscleCard from '../components/MuscleCard';
export default function Favorites(){const [favorites]=useLocalStorage<number[]>('mae-favorites',[]);const muscles=allMuscles.filter(m=>favorites.includes(m.id));return <div className="mx-auto max-w-6xl p-5 md:p-10"><h1 className="text-4xl font-black">Bookmarked muscles</h1>{muscles.length?<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{muscles.map(m=><MuscleCard key={m.id} muscle={m}/>)}</div>:<p className="mt-6 rounded-3xl bg-white p-8 text-slate-500 dark:bg-slate-900">No bookmarks yet. Add muscles from their profile pages.</p>}</div>}
