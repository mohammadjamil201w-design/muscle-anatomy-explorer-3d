import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AnatomyFigure from '../components/AnatomyFigure';
import ProfessionalMuscleAtlas from '../components/ProfessionalMuscleAtlas';
import ProfessionalAnatomyViewer from '../components/ProfessionalAnatomyViewer';
import SearchFilters from '../components/SearchFilters';
import { allMuscles, searchMuscles } from '../services/muscleService';
import type { Muscle } from '../types/muscle';

export default function Explorer() {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [mode, setMode] = useState<'3d' | '2d'>('2d');
  const [selected, setSelected] = useState<Muscle | undefined>();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');
  const [action, setAction] = useState('All');
  const muscles = useMemo(() => searchMuscles(query, region, action), [query, region, action]);
  const displayedMuscles = muscles.length ? muscles : allMuscles;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-10">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-600">3D learning lab</p>
        <h1 className="text-4xl font-black">Interactive anatomy viewer</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Rotate the 3D body, click muscle markers, switch to the flat atlas view, and filter by region or movement.
        </p>
      </div>
      <SearchFilters query={query} region={region} action={action} setQuery={setQuery} setRegion={setRegion} setAction={setAction} />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="rounded-[2rem] bg-white p-4 shadow-sm dark:bg-slate-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <button onClick={() => setMode('3d')} className={`rounded-xl px-4 py-2 ${mode === '3d' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>3D model</button>
            <button onClick={() => setMode('2d')} className={`rounded-xl px-4 py-2 ${mode === '2d' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>2D atlas</button>
            {mode === '2d' && <>
              <button onClick={() => setView('front')} className={`rounded-xl px-4 py-2 ${view === 'front' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Front</button>
              <button onClick={() => setView('back')} className={`rounded-xl px-4 py-2 ${view === 'back' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Back</button>
            </>}
            <span className="ml-auto rounded-xl bg-slate-100 px-4 py-2 text-sm dark:bg-slate-800">{displayedMuscles.length} muscles loaded</span>
          </div>
    {mode === '3d' ? (
  <ProfessionalAnatomyViewer
    muscles={displayedMuscles}
    selectedId={selected?.id}
    onSelect={setSelected}
  />
) : (
  <ProfessionalMuscleAtlas
    view={view}
    muscles={displayedMuscles}
    selectedId={selected?.id}
    onSelect={setSelected}
  />
)}
        </section>
        <aside className="medical-card rounded-[2rem] bg-white p-6 dark:bg-slate-900">
          {selected ? <>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600">{selected.region}</p>
            <h2 className="mt-2 text-3xl font-black">{selected.name}</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">{selected.function}</p>
            <div className="mt-4 flex flex-wrap gap-2">{selected.actions.map(a => <span key={a} className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">{a}</span>)}</div>
            <Link to={`/muscles/${selected.id}`} className="mt-6 inline-flex rounded-2xl bg-teal-600 px-5 py-3 font-bold text-white">Open full profile</Link>
          </> : <div className="text-slate-500">Select a muscle to view summary information.</div>}
        </aside>
      </div>
    </div>
  );
}
