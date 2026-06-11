import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import {
  Box3,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Muscle } from '../types/muscle';

type Props = {
  muscles: Muscle[];
  selectedId?: number;
  onSelect: (muscle: Muscle) => void;
};

function normalizeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function AnatomyModel({ selectedId }: Props) {
  const gltf = useLoader(GLTFLoader, '/models/anatomy.glb');
  const groupRef = useRef<Group>(null);
  const [hoveredMesh, setHoveredMesh] = useState<string | null>(null);

  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);

    const box = new Box3().setFromObject(clonedScene);
    const size = new Vector3();
    const center = new Vector3();

    box.getSize(size);
    box.getCenter(center);

    const maxAxis = Math.max(size.x, size.y, size.z);
    const scale = 3.5 / maxAxis;

    clonedScene.scale.setScalar(scale);
    clonedScene.position.sub(center.multiplyScalar(scale));

    clonedScene.rotation.x = -Math.PI / 2;
    clonedScene.rotation.z = Math.PI;

    clonedScene.position.y -= 1.5;

    clonedScene.traverse((object: Object3D) => {
      if ((object as Mesh).isMesh) {
        const mesh = object as Mesh;

        mesh.material = new MeshStandardMaterial({
          color: '#dc2626',
          roughness: 0.48,
          metalness: 0.03,
          transparent: true,
          opacity: 0.92,
        });

        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return clonedScene;
  }, [gltf.scene]);

  useFrame(() => {
    scene.traverse((object: Object3D) => {
      if (!(object as Mesh).isMesh) return;

      const mesh = object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      const normalized = normalizeName(mesh.name);

      if (hoveredMesh === normalized) {
        material.color = new Color('#f97316');
        material.opacity = 1;
      } else if (selectedId) {
        material.color = new Color('#991b1b');
        material.opacity = 0.65;
      } else {
        material.color = new Color('#dc2626');
        material.opacity = 0.92;
      }
    });
  });

  return (
    <primitive
      ref={groupRef}
      object={scene}
      onPointerMove={(event: any) => {
        event.stopPropagation();

        const mesh = event.object as Mesh;
        setHoveredMesh(normalizeName(mesh.name));
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredMesh(null);
        document.body.style.cursor = 'default';
      }}
      onClick={(event: any) => {
        event.stopPropagation();

        const mesh = event.object as Mesh;
        console.log('Clicked mesh:', mesh.name);
        alert(`Clicked: ${mesh.name}`);
      }}
    />
  );
}

export default function ProfessionalAnatomyViewer({ muscles, selectedId, onSelect }: Props) {
  const selectedMuscle = muscles.find((muscle) => muscle.id === selectedId);

  return (
    <div className="relative h-[680px] overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-b from-slate-50 via-cyan-50 to-teal-50 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950">
      <Canvas camera={{ position: [0, 0, 7], fov: 35 }} shadows>
        <color attach="background" args={['#ecfeff']} />

        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 5]} intensity={1.45} castShadow />
        <directionalLight position={[-3, 2, -4]} intensity={0.45} />

        <OrbitControls
          enableRotate={true}
          enableZoom={true}
          enablePan={true}
          minDistance={3}
          maxDistance={12}
          target={[0, 0, 0]}
        />

        <Suspense fallback={null}>
          <AnatomyModel muscles={muscles} selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
      </Canvas>

      <div className="absolute left-5 top-5 rounded-2xl bg-white/90 px-4 py-3 shadow-xl backdrop-blur dark:bg-slate-950/90">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
          Professional 3D Anatomy
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Drag to rotate · Scroll to zoom · Click a muscle
        </p>
      </div>

      {selectedMuscle && (
        <div className="absolute bottom-5 left-5 max-w-sm rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur dark:bg-slate-950/95">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">
            {selectedMuscle.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {selectedMuscle.function}
          </p>
        </div>
      )}
    </div>
  );
}