import { Canvas } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import type { Mesh } from 'three';
import type { Muscle } from '../types/muscle';

type Props = { muscles: Muscle[]; selectedId?: number; onSelect: (muscle: Muscle) => void };

type ModelPoint = {
  position: [number, number, number];
  scale: [number, number, number];
  side?: 'left' | 'right' | 'center';
};

const regionDefaults: Record<string, ModelPoint> = {
  'Head & Neck': { position: [0, 2.1, 0.05], scale: [0.32, 0.18, 0.12], side: 'center' },
  Trunk: { position: [0, 0.75, 0.08], scale: [0.42, 0.34, 0.16], side: 'center' },
  'Upper Limb': { position: [-0.75, 0.85, 0.05], scale: [0.16, 0.42, 0.12], side: 'left' },
  'Lower Limb': { position: [-0.32, -1.05, 0.05], scale: [0.18, 0.52, 0.13], side: 'left' },
};

function hash01(text: string) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Math.abs(h % 1000) / 1000;
}

function getModelPoint(muscle: Muscle, index: number): ModelPoint {
  if (muscle.model3d) return muscle.model3d;

  const base = regionDefaults[muscle.region];
  const mirror = index % 2 === 0 ? 1 : -1;
  const jitter = hash01(muscle.name) - 0.5;
  const xBase = base.side === 'center' ? 0 : base.position[0] * mirror;

  return {
    position: [
      xBase + jitter * 0.18,
      base.position[1] - (index % 8) * 0.08,
      muscle.view === 'back' ? -0.12 : 0.14,
    ],
    scale: base.scale,
    side: base.side,
  };
}

function MuscleBlob({
  muscle,
  point,
  selected,
  onSelect,
}: {
  muscle: Muscle;
  point: ModelPoint;
  selected: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const scale = selected
    ? (point.scale.map((v) => v * 1.18) as [number, number, number])
    : point.scale;

  return (
    <mesh
      ref={ref}
      position={point.position}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[1, 32, 24]} />
      <meshStandardMaterial
        color={selected ? '#0d9488' : hovered ? '#14b8a6' : '#dc2626'}
        roughness={0.45}
        metalness={0.05}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

function BodyScaffold() {
  return (
    <group>
      <mesh position={[0, 2.25, 0]} scale={[0.32, 0.38, 0.28]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.36} />
      </mesh>

      <mesh position={[0, 0.75, 0]} scale={[0.55, 1.05, 0.27]}>
        <capsuleGeometry args={[1, 1.2, 16, 32]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.28} />
      </mesh>

      <mesh position={[-0.78, 0.55, 0]} rotation={[0, 0, -0.22]} scale={[0.18, 1.05, 0.16]}>
        <capsuleGeometry args={[1, 1.8, 12, 24]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.24} />
      </mesh>

      <mesh position={[0.78, 0.55, 0]} rotation={[0, 0, 0.22]} scale={[0.18, 1.05, 0.16]}>
        <capsuleGeometry args={[1, 1.8, 12, 24]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.24} />
      </mesh>

      <mesh position={[-0.28, -1.12, 0]} scale={[0.19, 1.25, 0.18]}>
        <capsuleGeometry args={[1, 1.9, 12, 24]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.24} />
      </mesh>

      <mesh position={[0.28, -1.12, 0]} scale={[0.19, 1.25, 0.18]}>
        <capsuleGeometry args={[1, 1.9, 12, 24]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

export default function AnatomyViewer3D({ muscles, selectedId, onSelect }: Props) {
  const visibleMuscles = useMemo(() => muscles.slice(0, 90), [muscles]);
  const selectedMuscle = muscles.find((muscle) => muscle.id === selectedId);

  return (
    <div className="relative h-[620px] overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-teal-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      <Canvas camera={{ position: [0, 0.45, 5.2], fov: 45 }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 5, 6]} intensity={1.25} />
        <directionalLight position={[-4, 2, -5]} intensity={0.4} />

        <group rotation={[0, 0.25, 0]}>
          <BodyScaffold />
          {visibleMuscles.map((muscle, index) => (
            <MuscleBlob
              key={muscle.id}
              muscle={muscle}
              point={getModelPoint(muscle, index)}
              selected={selectedId === muscle.id}
              onSelect={() => onSelect(muscle)}
            />
          ))}
        </group>
      </Canvas>

      {selectedMuscle && (
        <div className="absolute left-5 top-5 rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-900 shadow-xl dark:bg-slate-950/90 dark:text-white">
          {selectedMuscle.name}
        </div>
      )}

      <div className="absolute bottom-5 left-5 text-xs text-slate-500 dark:text-slate-400">
        Click a muscle marker to view details
      </div>
    </div>
  );
}