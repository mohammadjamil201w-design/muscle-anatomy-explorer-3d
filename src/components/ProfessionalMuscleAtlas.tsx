import type { Muscle } from '../types/muscle';

type Props = {
  view: 'front' | 'back';
  muscles: Muscle[];
  selectedId?: number;
  onSelect: (muscle: Muscle) => void;
};

const muscleShapes = [
  { name: 'Deltoid', path: 'M250 155 C220 165 205 195 215 230 C245 220 265 195 250 155Z' },
  { name: 'Pectoralis Major', path: 'M285 170 C330 150 385 160 405 205 C365 235 315 230 285 190Z' },
  { name: 'Biceps Brachii', path: 'M210 235 C185 275 180 335 205 370 C235 325 235 270 210 235Z' },
  { name: 'Rectus Abdominis', path: 'M310 245 C350 235 385 245 395 310 C390 390 360 455 330 455 C300 455 285 390 290 310Z' },
  { name: 'External Oblique', path: 'M265 270 C235 315 240 390 285 430 C300 370 300 310 265 270Z' },
  { name: 'Sartorius', path: 'M300 470 C260 540 250 635 275 710 C315 620 335 540 300 470Z' },
  { name: 'Rectus Femoris', path: 'M355 470 C390 545 395 640 365 720 C330 620 325 545 355 470Z' },
  { name: 'Vastus Lateralis', path: 'M405 490 C445 570 440 665 395 735 C380 620 375 550 405 490Z' },
  { name: 'Tibialis Anterior', path: 'M335 745 C360 815 360 895 330 955 C305 875 305 805 335 745Z' },
  { name: 'Gastrocnemius', path: 'M390 745 C430 815 425 900 385 960 C360 875 360 805 390 745Z' },
];

export default function ProfessionalMuscleAtlas({ muscles, selectedId, onSelect }: Props) {
  const findMuscle = (name: string) =>
    muscles.find((m) => m.name.toLowerCase() === name.toLowerCase());

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-cyan-50 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      <svg
        viewBox="0 0 660 1000"
        className="mx-auto h-[720px] max-h-[75vh] w-full max-w-[620px]"
        role="img"
        aria-label="Interactive muscular anatomy atlas"
      >
        <defs>
          <linearGradient id="muscleGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.22" />
          </filter>
        </defs>

        <path
          d="M330 65 C280 65 250 100 250 145 C250 190 285 220 330 220 C375 220 410 190 410 145 C410 100 380 65 330 65Z"
          fill="#fee2e2"
          stroke="#991b1b"
          strokeWidth="2"
          opacity="0.7"
        />

        <path
          d="M250 155 C190 185 150 275 150 410 C150 530 190 600 250 600"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="38"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M410 155 C470 185 510 275 510 410 C510 530 470 600 410 600"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="38"
          strokeLinecap="round"
          opacity="0.55"
        />

        <path
          d="M250 160 C295 130 365 130 410 160 C450 250 435 405 395 465 C360 500 300 500 265 465 C225 405 210 250 250 160Z"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="3"
          opacity="0.75"
        />

        <path
          d="M285 465 C250 550 245 720 300 965"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="46"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M375 465 C410 550 415 720 360 965"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="46"
          strokeLinecap="round"
          opacity="0.5"
        />

        {muscleShapes.map((shape) => {
          const muscle = findMuscle(shape.name);
          const selected = muscle?.id === selectedId;

          return (
            <path
              key={shape.name}
              d={shape.path}
              fill={selected ? '#0d9488' : 'url(#muscleGradient)'}
              stroke={selected ? '#134e4a' : '#fee2e2'}
              strokeWidth={selected ? 4 : 2}
              opacity={muscle ? 0.95 : 0.35}
              filter="url(#softShadow)"
              className="cursor-pointer transition-all duration-200 hover:opacity-100"
              onClick={() => muscle && onSelect(muscle)}
            >
              <title>{shape.name}</title>
            </path>
          );
        })}

        <line x1="330" y1="230" x2="330" y2="455" stroke="#fee2e2" strokeWidth="3" opacity="0.65" />

        {muscleShapes.map((shape, index) => {
          const muscle = findMuscle(shape.name);
          if (!muscle) return null;

          const labelX = index % 2 === 0 ? 70 : 500;
          const labelY = 125 + index * 68;
          const anchorX = index % 2 === 0 ? 250 : 410;

          return (
            <g key={`${shape.name}-label`}>
              <line
                x1={labelX + (index % 2 === 0 ? 130 : 0)}
                y1={labelY}
                x2={anchorX}
                y2={labelY + 10}
                stroke="#0f766e"
                strokeWidth="2"
                opacity="0.65"
              />
              <rect
                x={labelX}
                y={labelY - 18}
                width="145"
                height="34"
                rx="12"
                fill={muscle.id === selectedId ? '#0f766e' : '#ffffff'}
                stroke="#0f766e"
                strokeWidth="2"
                className="cursor-pointer"
                onClick={() => onSelect(muscle)}
              />
              <text
                x={labelX + 72}
                y={labelY + 4}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill={muscle.id === selectedId ? '#ffffff' : '#0f172a'}
                className="pointer-events-none"
              >
                {shape.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}