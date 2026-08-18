import { plantMeta, stageIndex, type PlantId } from "@/lib/canvive/data";
import { cn } from "@/lib/utils";

type Props = { id: PlantId; growth: number; className?: string; animate?: boolean };

const C = {
  soil: "var(--beige)",
  soilDark: "color-mix(in oklab, var(--beige) 78%, var(--foreground) 12%)",
  stem: "color-mix(in oklab, var(--sage) 82%, var(--foreground) 18%)",
  leaf: "var(--sage)",
  leafDeep: "color-mix(in oklab, var(--sage) 75%, var(--foreground) 20%)",
  sun: "var(--sun)",
  sunDeep: "color-mix(in oklab, var(--sun) 80%, var(--coral) 30%)",
  rose: "var(--coral)",
  roseSoft: "var(--coral-soft)",
  blossom: "var(--blossom)",
  water: "var(--water)",
  waterDeep: "color-mix(in oklab, var(--water) 78%, var(--foreground) 12%)",
  bark: "color-mix(in oklab, var(--beige) 60%, var(--foreground) 30%)",
};

function Seed() {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="10" ry="7" fill={C.soilDark} />
      <ellipse cx="100" cy="147" rx="6" ry="8" fill={C.bark} />
    </g>
  );
}

function Sprout({ h = 26 }: { h?: number }) {
  return (
    <g>
      <path d={`M100 152 V${152 - h}`} stroke={C.stem} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d={`M100 ${152 - h + 6} c-16 -2 -20 -12 -20 -12 c14 -3 20 6 20 12z`} fill={C.leaf} />
      <path d={`M100 ${152 - h + 12} c16 -2 20 -12 20 -12 c-14 -3 -20 6 -20 12z`} fill={C.leafDeep} />
    </g>
  );
}

function GardenBase() {
  return (
    <g>
      <ellipse cx="100" cy="156" rx="72" ry="16" fill={C.leaf} opacity="0.28" />
      <ellipse cx="100" cy="152" rx="52" ry="11" fill={C.soil} />
    </g>
  );
}

function WaterBase({ pads = 0 }: { pads?: number }) {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="82" ry="26" fill={C.water} />
      <ellipse cx="100" cy="150" rx="82" ry="26" fill="none" stroke={C.waterDeep} strokeWidth="1.5" opacity="0.5" />
      <ellipse className="ripple-slow" cx="100" cy="156" rx="46" ry="8" fill="none" stroke={C.waterDeep} strokeWidth="1.5" opacity="0.6" />
      <ellipse className="ripple-slow" cx="100" cy="144" rx="30" ry="5" fill="none" stroke={C.waterDeep} strokeWidth="1" opacity="0.45" />
      {pads > 0 && <ellipse cx="66" cy="152" rx="20" ry="7" fill={C.leaf} />}
      {pads > 1 && <ellipse cx="132" cy="146" rx="16" ry="6" fill={C.leafDeep} opacity="0.85" />}
    </g>
  );
}

function Sunflower({ s }: { s: number }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <g>
      <GardenBase />
      {s === 0 && <Seed />}
      {s === 1 && <Sprout />}
      {s >= 2 && (
        <path d="M100 152 V70" stroke={C.stem} strokeWidth="5" strokeLinecap="round" fill="none" />
      )}
      {s >= 2 && (
        <>
          <path d="M100 122 c-24 -4 -30 -18 -30 -18 c20 -5 30 8 30 18z" fill={C.leaf} />
          <path d="M100 108 c24 -4 30 -18 30 -18 c-20 -5 -30 8 -30 18z" fill={C.leafDeep} />
        </>
      )}
      {s === 3 && <ellipse cx="100" cy="66" rx="14" ry="17" fill={C.leafDeep} />}
      {s >= 4 && (
        <g className="float-slow">
          {petals.map((a) => (
            <ellipse key={a} cx="100" cy="42" rx="7" ry="17" fill={C.sun} transform={`rotate(${a} 100 64)`} />
          ))}
          <circle cx="100" cy="64" r="16" fill={C.sunDeep} />
          <circle cx="100" cy="64" r="10" fill={C.bark} opacity="0.35" />
        </g>
      )}
    </g>
  );
}

function Rose({ s }: { s: number }) {
  return (
    <g>
      <GardenBase />
      {s === 0 && <Seed />}
      {s === 1 && <Sprout />}
      {s >= 2 && <path d="M100 152 C96 120 104 100 100 78" stroke={C.stem} strokeWidth="4.5" fill="none" strokeLinecap="round" />}
      {s >= 2 && (
        <>
          <path d="M99 124 c-22 -2 -28 -16 -28 -16 c18 -5 28 6 28 16z" fill={C.leaf} />
          <path d="M101 106 c22 -2 28 -16 28 -16 c-18 -5 -28 6 -28 16z" fill={C.leafDeep} />
        </>
      )}
      {s === 3 && (
        <g>
          <path d="M100 58 c12 4 14 18 6 24 c-6 5 -18 4 -22 -3 c-4 -8 4 -20 16 -21z" fill={C.rose} />
          <path d="M92 82 l8 -4 l8 4 z" fill={C.leafDeep} />
        </g>
      )}
      {s >= 4 && (
        <g className="float-slow">
          <circle cx="100" cy="62" r="24" fill={C.roseSoft} />
          <circle cx="100" cy="62" r="16" fill={C.rose} />
          <path d="M100 50 a12 12 0 0 1 10 18 a10 10 0 0 1 -20 -2 a8 8 0 0 1 10 -16z" fill={C.roseSoft} opacity="0.9" />
          <circle cx="100" cy="62" r="5" fill={C.rose} />
        </g>
      )}
    </g>
  );
}

function Sakura({ s }: { s: number }) {
  const blooms: Array<[number, number]> = [
    [72, 62],
    [128, 60],
    [100, 44],
    [86, 82],
    [116, 84],
    [60, 84],
    [140, 80],
  ];
  return (
    <g>
      <GardenBase />
      {s === 0 && <Seed />}
      {s >= 1 && <path d="M100 152 V88" stroke={C.bark} strokeWidth={s >= 2 ? 8 : 5} strokeLinecap="round" fill="none" />}
      {s >= 2 && (
        <>
          <path d="M100 100 L74 76" stroke={C.bark} strokeWidth="5" strokeLinecap="round" />
          <path d="M100 96 L128 74" stroke={C.bark} strokeWidth="5" strokeLinecap="round" />
          <path d="M100 88 L100 62" stroke={C.bark} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {s === 1 && <ellipse cx="100" cy="80" rx="18" ry="14" fill={C.leaf} />}
      {s >= 3 &&
        blooms.slice(0, s === 3 ? 4 : 7).map(([x, y], i) => (
          <g key={i} className={s >= 4 ? "float-slow" : undefined}>
            <circle cx={x} cy={y} r={s === 3 ? 8 : 15} fill={C.blossom} opacity="0.9" />
            {s >= 4 && (
              <>
                <circle cx={x - 8} cy={y + 6} r="10" fill={C.blossom} opacity="0.8" />
                <circle cx={x + 8} cy={y + 5} r="9" fill={C.roseSoft} opacity="0.9" />
              </>
            )}
          </g>
        ))}
    </g>
  );
}

function Willow({ s }: { s: number }) {
  const strands = [58, 72, 86, 100, 114, 128, 142];
  return (
    <g>
      <ellipse cx="100" cy="156" rx="76" ry="16" fill={C.leaf} opacity="0.25" />
      <ellipse cx="150" cy="154" rx="34" ry="10" fill={C.water} />
      <ellipse cx="100" cy="152" rx="52" ry="11" fill={C.soil} />
      {s === 0 && <Seed />}
      {s === 1 && <Sprout h={30} />}
      {s >= 2 && <path d="M100 152 C98 120 104 108 100 86" stroke={C.bark} strokeWidth="8" fill="none" strokeLinecap="round" />}
      {s >= 2 && <ellipse cx="100" cy="78" rx="34" ry="20" fill={C.leafDeep} opacity="0.85" />}
      {s >= 3 && <ellipse cx="100" cy="72" rx="48" ry="26" fill={C.leaf} />}
      {s >= 3 &&
        strands.slice(0, s === 3 ? 4 : 7).map((x, i) => (
          <path
            key={x}
            d={`M${x} 78 q${i % 2 ? 6 : -6} ${s >= 4 ? 34 : 22} ${i % 2 ? 2 : -2} ${s >= 4 ? 48 : 30}`}
            stroke={C.leafDeep}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
        ))}
    </g>
  );
}

function Lily({ s }: { s: number }) {
  return (
    <g>
      <WaterBase pads={s >= 2 ? 2 : 0} />
      {s === 0 && (
        <g>
          <ellipse cx="100" cy="146" rx="7" ry="5" fill={C.bark} />
        </g>
      )}
      {s >= 1 && <path d="M100 146 V100" stroke={C.stem} strokeWidth="4" strokeLinecap="round" fill="none" />}
      {s === 1 && <path d="M100 108 c-14 -2 -18 -12 -18 -12 c13 -3 18 5 18 12z" fill={C.leaf} />}
      {s >= 2 && <ellipse cx="100" cy="148" rx="26" ry="9" fill={C.leaf} />}
      {s === 3 && <ellipse cx="100" cy="92" rx="11" ry="16" fill={C.roseSoft} />}
      {s >= 4 && (
        <g className="float-slow">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx="100" cy="76" rx="8" ry="22" fill={C.roseSoft} transform={`rotate(${a} 100 96)`} />
          ))}
          {[30, 150, 270].map((a) => (
            <ellipse key={a} cx="100" cy="82" rx="6" ry="17" fill={C.blossom} transform={`rotate(${a} 100 96)`} />
          ))}
          <circle cx="100" cy="96" r="7" fill={C.sun} />
        </g>
      )}
    </g>
  );
}

function Lotus({ s }: { s: number }) {
  return (
    <g>
      <WaterBase pads={s >= 2 ? 2 : 1} />
      {s === 0 && <ellipse cx="100" cy="148" rx="7" ry="5" fill={C.bark} />}
      {s >= 1 && s < 4 && <path d="M100 148 V108" stroke={C.stem} strokeWidth="4" strokeLinecap="round" fill="none" />}
      {s === 1 && <path d="M100 114 c-14 -2 -18 -12 -18 -12 c13 -3 18 5 18 12z" fill={C.leaf} />}
      {s >= 2 && <ellipse cx="100" cy="150" rx="30" ry="10" fill={C.leaf} />}
      {s === 3 && (
        <g>
          <path d="M100 82 c11 8 12 24 0 30 c-12 -6 -11 -22 0 -30z" fill={C.roseSoft} />
        </g>
      )}
      {s >= 4 && (
        <g className="float-slow">
          {[-70, -45, -20, 20, 45, 70].map((a) => (
            <ellipse key={a} cx="100" cy="96" rx="11" ry="26" fill={C.roseSoft} transform={`rotate(${a} 100 122)`} />
          ))}
          {[-30, 0, 30].map((a) => (
            <ellipse key={a} cx="100" cy="100" rx="9" ry="22" fill={C.blossom} transform={`rotate(${a} 100 122)`} />
          ))}
          <ellipse cx="100" cy="112" rx="9" ry="11" fill={C.sun} opacity="0.9" />
        </g>
      )}
    </g>
  );
}

const RENDERERS: Record<PlantId, (p: { s: number }) => React.JSX.Element> = {
  sunflower: Sunflower,
  rose: Rose,
  sakura: Sakura,
  willow: Willow,
  lily: Lily,
  lotus: Lotus,
};

export function PlantArt({ id, growth, className, animate }: Props) {
  const s = stageIndex(growth);
  const meta = plantMeta(id);
  const Render = RENDERERS[id];
  return (
    <svg
      viewBox="0 0 200 180"
      role="img"
      aria-label={`${meta.name} illustration, stage: ${meta.stages[s]}`}
      className={cn("h-full w-full", animate && "grow-pop", className)}
    >
      <rect
        x="0"
        y="0"
        width="200"
        height="180"
        rx="20"
        fill={meta.environment === "water" ? "color-mix(in oklab, var(--water) 40%, var(--cream))" : "var(--sage-soft)"}
      />
      <Render s={s} />
    </svg>
  );
}
