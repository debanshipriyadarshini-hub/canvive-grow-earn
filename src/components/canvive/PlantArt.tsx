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
  sunflowerChrome: "#f5b700",
  sunflowerInner: "#ffd84d",
  sunflowerLight: "#ffe98a",
  rose: "var(--coral)",
  roseSoft: "var(--coral-soft)",
  roseDeep: "#e95668",
  blossom: "var(--blossom)",
  blossomDeep: "#e879a0",
  sakuraLight: "#fff0f5",
  sakuraBlush: "#ffd6e2",
  sakuraPink: "#ff9db5",
  sakuraRose: "#e96b8d",
  lavenderSoft: "#dcc7f2",
  lavenderLight: "#c8a2e8",
  lavender: "#a970d6",
  lavenderDeep: "#8752b8",
  lavenderDark: "#5e3d97",
  lavenderGrass: "#8bcb78",
  lavenderGreen: "#5faf68",
  lavenderLeaf: "#3f8f52",
  lily: "#a875e8",
  lilyDeep: "#7446b8",
  lilyLight: "#d7bbff",
  water: "var(--water)",
  waterDeep: "color-mix(in oklab, var(--water) 78%, var(--foreground) 12%)",
  bark: "color-mix(in oklab, var(--beige) 60%, var(--foreground) 30%)",
  leafBright: "#5fcb7a",
  leafFresh: "#36a85f",
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
      {pads > 0 && <ellipse cx="48" cy="154" rx="22" ry="8" fill={C.leafBright} />}
      {pads > 1 && <ellipse cx="76" cy="142" rx="18" ry="7" fill={C.leafFresh} opacity=".95" />}
      {pads > 2 && <ellipse cx="132" cy="146" rx="20" ry="8" fill={C.leafDeep} opacity="0.9" />}
      {pads > 3 && <ellipse cx="158" cy="156" rx="18" ry="7" fill={C.leafBright} opacity=".9" />}
    </g>
  );
}

function Sunflower({ s }: { s: number }) {
  const outerPetals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const middlePetals = Array.from({ length: 12 }, (_, i) => i * 30 + 15);
  const innerPetals = Array.from({ length: 8 }, (_, i) => i * 45);
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
          <path d="M100 132 C75 136 58 124 54 106 C76 106 94 116 100 132Z" fill={C.leafFresh} />
          <path d="M100 132 C78 126 66 116 58 108" stroke={C.leafBright} strokeWidth="2" fill="none" />
          <path d="M100 116 C124 120 142 108 146 90 C124 91 106 101 100 116Z" fill={C.leafBright} />
          <path d="M100 116 C122 111 134 102 143 93" stroke={C.leafFresh} strokeWidth="2" fill="none" />
          {s >= 3 && <>
            <path d="M100 104 C78 104 64 94 60 78 C80 80 94 89 100 104Z" fill={C.leaf} />
            <path d="M100 104 C80 97 70 88 63 80" stroke={C.leafBright} strokeWidth="2" fill="none" />
            <path d="M100 96 C118 98 132 88 136 73 C118 75 106 82 100 96Z" fill={C.leafDeep} />
            <path d="M100 96 C116 91 126 83 133 75" stroke={C.leafBright} strokeWidth="2" fill="none" />
          </>}
        </>
      )}
      {s === 3 && <g><ellipse cx="100" cy="66" rx="14" ry="17" fill={C.leafDeep} /><ellipse cx="100" cy="62" rx="9" ry="12" fill={C.sunflowerInner} opacity=".75" /></g>}
      {s >= 4 && (
        <g className="float-slow">
          {outerPetals.map((a) => (
            <ellipse key={`outer-${a}`} cx="100" cy="34" rx="7" ry="23" fill={C.sunflowerChrome} transform={`rotate(${a} 100 64)`} />
          ))}
          {middlePetals.map((a) => (
            <ellipse key={`middle-${a}`} cx="100" cy="41" rx="6" ry="19" fill={C.sunflowerInner} transform={`rotate(${a} 100 64)`} />
          ))}
          {innerPetals.map((a) => (
            <ellipse key={`inner-${a}`} cx="100" cy="49" rx="5" ry="14" fill={C.sunflowerLight} transform={`rotate(${a} 100 64)`} />
          ))}
          <circle cx="100" cy="64" r="18" fill={C.sunflowerChrome} />
          <circle cx="100" cy="64" r="12" fill="#8a5a24" />
          <circle cx="96" cy="60" r="2" fill="#c98b3c" /><circle cx="105" cy="58" r="2" fill="#c98b3c" /><circle cx="101" cy="69" r="2" fill="#c98b3c" />
        </g>
      )}
    </g>
  );
}

function RoseLeaf({ x, y, scale = 1, flip = false }: { x: number; y: number; scale?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <path d="M0 0 C-18 -17 -34 -12 -38 0 C-29 15 -12 17 0 0Z" fill={C.leafFresh} />
      <path d="M-2 0 C-18 -2 -28 -5 -36 -2" stroke={C.leafBright} strokeWidth="2" fill="none" />
      <path d="M-15 -3l-5-7M-23 -4l-6 7M-10 -2l-2-8" stroke={C.leafDeep} strokeWidth="1.2" opacity=".8" />
    </g>
  );
}

function RoseBud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 18V5" stroke={C.stem} strokeWidth="3" strokeLinecap="round" />
      <path d="M0 8l-8-8M0 8l8-8" stroke={C.leafDeep} strokeWidth="3" strokeLinecap="round" />
      <path d="M-12 1 C-14 -15 -5 -23 0 -20 C8 -24 15 -14 12 1 C6 8 -6 8 -12 1Z" fill={C.roseDeep} />
      <path d="M-6 -3 C-8 -12 -3 -17 1 -14 C6 -17 9 -10 6 -3 C3 1 -3 1 -6 -3Z" fill={C.roseSoft} />
      <path d="M-12 2l-4 7 9-4 3 7 4-7 9 4-5-8" fill={C.leafFresh} />
    </g>
  );
}

function Rose({ s }: { s: number }) {
  return (
    <g>
      <GardenBase />
      {s === 0 && <Seed />}
      {s === 1 && <Sprout />}
      {s >= 2 && <>
        <path d="M100 152 C96 126 105 102 100 78" stroke={C.stem} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M99 128 C80 118 66 104 56 88 M101 116 C120 106 133 91 142 76" stroke={C.roseDeep} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".75" />
        <RoseLeaf x={95} y={132} scale={.9} /><RoseLeaf x={105} y={117} scale={.78} flip />
        <RoseLeaf x={82} y={117} scale={.62} flip /><RoseLeaf x={119} y={103} scale={.7} />
        {s >= 3 && <><RoseLeaf x={70} y={105} scale={.55} flip /><RoseLeaf x={132} y={91} scale={.58} /><RoseLeaf x={91} y={96} scale={.5} flip /></>}
      </>}
      {s === 3 && <RoseBud x={100} y={66} scale={.8} />}
      {s >= 4 && <>
        <RoseBud x={56} y={84} scale={.72} /><RoseBud x={145} y={72} scale={.62} /><RoseBud x={72} y={112} scale={.42} />
        <g className="float-slow">
          <path d="M100 38 C114 30 132 42 126 57 C139 68 126 87 111 82 C102 94 84 88 82 73 C67 67 72 47 88 45 C90 34 96 32 100 38Z" fill={C.roseSoft} />
          <path d="M100 43 C111 36 124 46 118 57 C129 67 117 79 107 72 C103 84 88 80 91 68 C79 63 83 49 95 50 C92 43 96 39 100 43Z" fill={C.rose} />
          <path d="M100 48 C109 43 118 51 112 59 C121 66 112 75 105 68 C104 77 92 74 95 64 C86 61 90 51 99 54 C95 49 97 46 100 48Z" fill={C.roseDeep} />
          <path d="M100 52 C106 48 112 54 108 60 C114 65 107 71 103 65 C102 71 95 69 98 63 C93 60 96 54 101 57 C98 54 99 52 100 52Z" fill={C.roseSoft} />
          <path d="M100 54 C104 52 107 56 104 60 C108 63 104 67 101 63 C100 67 97 65 99 61 C96 59 98 56 101 58Z" fill={C.roseDeep} />
        </g>
      </>}
    </g>
  );
}

function SakuraFlower({ x, y, scale = 1, tone = C.blossom, falling = false }: { x: number; y: number; scale?: number; tone?: string; falling?: boolean }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <g className={cn("sakura-flower", falling && "petals-fall")} transform={`translate(${x} ${y}) scale(${scale})`}>
      {petals.map((angle) => (
        <path key={angle} d="M0 0 C-7 -5 -7 -15 0 -20 C7 -15 7 -5 0 0Z" fill={tone} transform={`rotate(${angle})`} />
      ))}
      <circle r="4" fill={C.sakuraRose} /><circle cy="-1" r="1.5" fill={C.sakuraBlush} />
    </g>
  );
}

function SakuraCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-34 12 C-47 -5 -33 -28 -12 -26 C-4 -44 24 -41 30 -21 C53 -19 55 9 35 19 C18 30 -18 30 -34 12Z" fill={C.sakuraLight} opacity=".9" />
      <path d="M-23 16 C-36 2 -25 -17 -8 -15 C0 -32 23 -27 26 -11 C43 -7 39 13 24 19 C8 26 -12 26 -23 16Z" fill={C.sakuraBlush} opacity=".82" />
    </g>
  );
}

function Sakura({ s }: { s: number }) {
  const blooms: Array<[number, number]> = [
    [48, 72], [66, 56], [82, 76], [100, 44], [118, 68], [136, 52], [154, 78],
    [58, 96], [78, 92], [100, 82], [122, 92], [144, 98], [36, 88], [166, 90],
  ];
  const clusters: Array<[number, number, number]> = [[50, 64, .72], [82, 50, .8], [116, 52, .82], [148, 68, .72], [62, 88, .7], [102, 78, .9], [140, 92, .68]];
  return (
    <g>
      <GardenBase />
      {s === 0 && <Seed />}
      {s >= 1 && <path d="M100 152 V88" stroke={C.bark} strokeWidth={s >= 2 ? 8 : 5} strokeLinecap="round" fill="none" />}
      {s >= 2 && (
        <>
          <path d="M100 100 L74 76 M100 96 L128 74 M100 88 L100 62 M74 76 L48 70 M128 74 L154 68" stroke={C.bark} strokeWidth="5" strokeLinecap="round" />
          <path d="M100 88 L100 62" stroke={C.bark} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {s === 1 && <ellipse cx="100" cy="80" rx="18" ry="14" fill={C.leaf} />}
      {s >= 3 && <>
        {s >= 4 && clusters.slice(0, s === 4 ? 5 : 7).map(([x, y, scale], i) => <SakuraCluster key={`cluster-${i}`} x={x} y={y} scale={scale} />)}
        {blooms.slice(0, s === 3 ? 5 : s === 4 ? 12 : 14).map(([x, y], i) => <SakuraFlower key={`flower-${i}`} x={x} y={y} scale={s === 3 ? .33 : i % 3 === 0 ? .42 : .34} tone={i % 3 === 0 ? C.sakuraPink : i % 2 ? C.sakuraBlush : C.sakuraLight} />)}
      </>}
    </g>
  );
}

function Lavender({ s }: { s: number }) {
  const stems = [52, 70, 90, 110, 130, 148];
  const flowerOffsets = [
    [40, 58, 0.7],
    [58, 50, 0.82],
    [76, 62, 0.78],
    [92, 46, 0.9],
    [112, 40, 1],
    [130, 54, 0.88],
    [150, 62, 0.72],
    [64, 82, 0.62],
    [86, 82, 0.7],
    [110, 80, 0.7],
    [134, 82, 0.62],
  ] as const;

  const LavenderSpike = ({ x, y, scale = 1, tilt = 0 }: { x: number; y: number; scale?: number; tilt?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${tilt})`}>
      <path d="M0 34V0" stroke={C.leafFresh} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M-3 20 C-12 16 -16 9 -13 2 C-6 3 -2 9 -3 20Z" fill={C.lavenderGreen} />
      <path d="M3 18 C12 14 16 8 13 2 C6 3 2 9 3 18Z" fill={C.lavenderLeaf} />
      <g>
        <ellipse cx="0" cy="-6" rx="8" ry="14" fill={C.lavenderLight} transform="rotate(-10)" />
        <ellipse cx="-4" cy="-10" rx="7" ry="12" fill={C.lavender} transform="rotate(16)" />
        <ellipse cx="4" cy="-12" rx="7" ry="12" fill={C.lavenderDeep} transform="rotate(-18)" />
        <ellipse cx="0" cy="-16" rx="5" ry="8" fill={C.lavenderSoft} />
      </g>
    </g>
  );

  return (
    <g>
      <ellipse cx="100" cy="156" rx="76" ry="16" fill={C.lavenderGrass} opacity="0.26" />
      <ellipse cx="100" cy="152" rx="58" ry="12" fill={C.soil} />
      {s === 0 && <Seed />}
      {s === 1 && <Sprout h={26} />}
      {s >= 2 && <path d="M100 152 C96 128 100 104 100 82" stroke={C.stem} strokeWidth="7" fill="none" strokeLinecap="round" />}
      {s >= 2 &&
        stems.slice(0, s === 2 ? 3 : s === 3 ? 5 : 6).map((x, i) => (
          <g key={x}>
            <path d={`M${x} 152 L${x} ${85 + (i % 2) * 8}`} stroke={C.stem} strokeWidth="4" strokeLinecap="round" />
            <path d={`M${x} ${118 + (i % 2) * 10} C${x - 10} ${116 + (i % 2) * 8}, ${x - 12} ${103 + (i % 2) * 8}, ${x} ${92}`} stroke={C.lavenderGreen} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d={`M${x} ${118 + (i % 2) * 10} C${x + 10} ${116 + (i % 2) * 8}, ${x + 12} ${103 + (i % 2) * 8}, ${x} ${92}`} stroke={C.lavenderLeaf} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ))}
      {s >= 3 &&
        flowerOffsets.slice(0, s === 3 ? 7 : s === 4 ? 11 : flowerOffsets.length).map(([x, y, scale], i) => (
          <LavenderSpike key={`${x}-${y}-${i}`} x={x} y={y} scale={scale} tilt={i % 2 === 0 ? -6 : 6} />
        ))}
      {s >= 4 && (
        <g className="float-slow">
          {[-24, 0, 20, 46].map((offset, i) => (
            <LavenderSpike key={`extra-${offset}`} x={82 + i * 20} y={96 + (i % 2) * 10} scale={0.8} tilt={offset} />
          ))}
        </g>
      )}
    </g>
  );
}

function Lily({ s }: { s: number }) {
  return (
    <g>
      <WaterBase pads={s >= 4 ? 4 : s >= 2 ? 3 : 0} />
      {s === 0 && (
        <g>
          <ellipse cx="100" cy="146" rx="7" ry="5" fill={C.bark} />
        </g>
      )}
      {s >= 1 && <path d="M100 146 V100" stroke={C.stem} strokeWidth="4" strokeLinecap="round" fill="none" />}
      {s === 1 && <path d="M100 108 c-14 -2 -18 -12 -18 -12 c13 -3 18 5 18 12z" fill={C.leaf} />}
      {s >= 2 && <><ellipse cx="100" cy="148" rx="26" ry="9" fill={C.leafFresh} /><path d="M100 148l16-7" stroke="#a8e6b5" strokeWidth="2" opacity=".8" /><path d="M100 148l-16-7" stroke="#a8e6b5" strokeWidth="2" opacity=".8" /></>}
      {s === 3 && <g><path d="M100 92 C112 78 124 92 114 108 C106 116 94 110 100 92Z" fill={C.lilyDeep} /><path d="M100 92 C88 78 76 92 86 108 C94 116 106 110 100 92Z" fill={C.lily} /></g>}
      {s >= 4 && (
        <g className="float-slow">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={`outer-${a}`} cx="100" cy="70" rx="11" ry="29" fill={C.lilyLight} transform={`rotate(${a} 100 96)`} />
          ))}
          {[30, 90, 150, 210, 270, 330].map((a) => (
            <ellipse key={`inner-${a}`} cx="100" cy="78" rx="9" ry="23" fill={a % 2 ? C.lily : C.lilyDeep} transform={`rotate(${a} 100 96)`} />
          ))}
          <circle cx="100" cy="96" r="10" fill={C.lilyDeep} /><circle cx="100" cy="96" r="5" fill={C.sun} /><circle cx="96" cy="93" r="2" fill="#fff4b8" /><circle cx="105" cy="94" r="2" fill="#fff4b8" />
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

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#ffffff" opacity=".7"><circle cx="0" cy="8" r="12" /><circle cx="15" cy="2" r="16" /><circle cx="32" cy="9" r="11" /><path d="M-8 9h48v9H-8z" /></g>;
}

function MeadowFlowers({ count }: { count: number }) {
  return <g className="scene-flowers" aria-hidden="true">{Array.from({ length: count }, (_, i) => { const x = 32 + i * 29; return <g key={x} transform={`translate(${x} ${218 - (i % 2) * 5})`}><path d="M0 12V0" stroke="var(--garden-green, #36a85f)" strokeWidth="2" /><circle cy="-1" r="3" fill={i % 2 ? "var(--garden-yellow, #ffd84d)" : "var(--garden-pink, #ff9db5)"} /></g>; })}</g>;
}

function SceneBackdrop({ id, s }: { id: PlantId; s: number }) {
  const developed = s >= 2;
  const mature = s >= 4;
  if (id === "sunflower") return <g className="scene-backdrop"><rect width="400" height="300" fill="#dff6ff" /><circle cx="318" cy="54" r="28" fill="#ffd84d" opacity=".9" /><Cloud x={48} y={36} /><Cloud x={255} y={88} scale={.7} /><path d="M0 170 Q90 112 185 166 Q285 105 400 166V226H0Z" fill="#a8d8f0" opacity=".7" /><path d="M0 188 Q100 145 210 188 Q315 142 400 180V300H0Z" fill="#a8e6b5" /><path d="M0 214 Q110 188 220 216 Q310 186 400 210V300H0Z" fill="#5fcb7a" opacity=".72" />{developed && <MeadowFlowers count={mature ? 9 : 4} />}</g>;
  if (id === "rose") return <g className="scene-backdrop"><rect width="400" height="300" fill="#ffe5e8" /><path d="M0 128 Q100 88 205 132 Q300 92 400 126V215H0Z" fill="#a8e6b5" /><path d="M0 196 Q100 170 200 198 Q300 170 400 194V300H0Z" fill="#36a85f" opacity=".8" /><path d="M70 300 Q160 240 210 180 Q270 240 345 300Z" fill="#ffc6a8" opacity=".9" />{developed && <><circle cx="55" cy="170" r="28" fill="#2f855a" opacity=".8" /><circle cx="345" cy="165" r="34" fill="#2f855a" opacity=".8" /><MeadowFlowers count={mature ? 7 : 3} /></>}</g>;
  if (id === "sakura") return <g className="scene-backdrop"><rect width="400" height="300" fill="#dff6ff" /><Cloud x={40} y={38} scale={.8} /><path d="M0 170 Q85 112 175 166 Q280 105 400 160V225H0Z" fill="#a875e8" opacity=".28" /><path d="M0 196 Q115 164 205 198 Q310 160 400 192V300H0Z" fill="#a8e6b5" />{developed && <g className="scene-petals">{[42, 82, 318, 358].slice(0, mature ? 4 : 2).map((x, i) => <circle key={x} cx={x} cy={125 + i * 16} r="4" fill="#ff9db5" />)}</g>}</g>;
  if (id === "lavender") return <g className="scene-backdrop"><rect width="400" height="300" fill="#f4ecff" /><path d="M0 166 Q92 120 187 168 Q290 120 400 166V220H0Z" fill="#bfe6b3" /><path d="M0 193 Q90 152 188 202 Q298 162 400 196V300H0Z" fill="#8bcb78" opacity=".8" /><path d="M0 226 Q90 206 180 228 Q286 194 400 230V300H0Z" fill="#5faf68" opacity="0.74" /><path d="M30 220 Q76 197 117 218 Q160 196 199 220 Q239 210 286 220" stroke="#ffffff" strokeWidth="4" opacity=".42" fill="none" />{developed && <g className="scene-flowers">{[24, 58, 94, 132, 170, 208, 244, 280, 316, 350].map((x, i) => <g key={x} transform={`translate(${x} ${208 - (i % 2) * 8})`}><path d="M0 12V0" stroke="#3f8f52" strokeWidth="2" /><circle cy="-2" r={i % 3 === 0 ? 4 : 3.2} fill={i % 2 ? "#c8a2e8" : "#a970d6"} /></g>)}</g>}</g>;
  return <g className="scene-backdrop"><rect width="400" height="300" fill="#d9f2ff" /><path d="M0 168 Q72 126 146 170 Q266 118 400 168V205H0Z" fill="#a8e6b5" /><ellipse cx="200" cy="235" rx={mature ? 190 : 150} ry={mature ? 64 : 48} fill="#5aa9e6" /><ellipse cx="200" cy="220" rx="145" ry="30" fill="#a8d8f0" opacity=".5" /><path d="M18 220q22-34 44 0M340 220q22-38 44 0" stroke="#36a85f" strokeWidth="7" fill="none" strokeLinecap="round" />{developed && <><ellipse cx="78" cy="224" rx="28" ry="10" fill="#36a85f" /><ellipse cx="320" cy="232" rx="34" ry="12" fill="#2f855a" /><g className="scene-ripples"><ellipse cx="102" cy="248" rx="34" ry="6" fill="none" stroke="#ffffff" opacity=".5" /><ellipse cx="298" cy="214" rx="28" ry="5" fill="none" stroke="#ffffff" opacity=".45" /></g></>}</g>;
}

function BiomeDetails({ id, s }: { id: PlantId; s: number }) {
  const meadowFlowers = s >= 2 ? [35, 52, 165].slice(0, s - 1) : [];
  return (
    <g aria-hidden="true">
      {id === "sunflower" && <><circle cx="32" cy="34" r="12" fill="var(--garden-sky, #63b3ed)" opacity=".45" /><circle cx="48" cy="34" r="15" fill="var(--garden-sky, #63b3ed)" opacity=".35" />{meadowFlowers.map((x) => <circle key={x} cx={x} cy="145" r="3" fill="var(--garden-coral, #ff5f6d)" />)}</>}
      {(id === "rose" || id === "sakura") && s >= 2 && <path d="M16 151 Q45 132 72 151 M130 151 Q160 128 190 151" stroke="var(--garden-green, #36a85f)" strokeWidth="5" fill="none" opacity=".7" />}
      {id === "sakura" && s >= 3 && [22, 42, 158, 178].slice(0, s - 1).map((x, i) => <SakuraFlower key={x} x={x} y={45 + i * 18} scale={i % 2 ? .11 : .08} tone={i % 2 ? C.sakuraPink : C.sakuraBlush} falling />)}
      {id === "lavender" && s >= 2 && <><path d="M16 144 Q44 124 68 142" stroke="#3f8f52" strokeWidth="4" fill="none" opacity=".7" /><path d="M138 147 Q169 126 196 146" stroke="#5faf68" strokeWidth="3" fill="none" opacity=".8" /><path d="M238 134 Q264 120 288 138" stroke="#8752b8" strokeWidth="3" fill="none" opacity=".7" /></>}
      {(id === "lily" || id === "lotus") && s >= 2 && <><ellipse className="ripple-slow" cx="38" cy="126" rx="20" ry="4" fill="none" stroke="var(--garden-water-deep, #2f855a)" opacity=".5" /><ellipse className="ripple-slow" cx="166" cy="112" rx="22" ry="4" fill="none" stroke="var(--garden-water-deep, #2f855a)" opacity=".45" /></>}
    </g>
  );
}

const RENDERERS: Record<PlantId, (p: { s: number }) => React.JSX.Element> = {
  sunflower: Sunflower,
  rose: Rose,
  sakura: Sakura,
  lavender: Lavender,
  lily: Lily,
  lotus: Lotus,
};

export function PlantArt({ id, growth, className, animate }: Props) {
  const s = stageIndex(growth);
  const meta = plantMeta(id);
  const Render = RENDERERS[id];
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label={`${meta.name} illustration, stage: ${meta.stages[s]}`}
      className={cn("garden-plant-art", "garden-scene-art", `garden-plant-${id}`, `garden-stage-${s}`, "h-full w-full", animate && "grow-pop", className)}
    >
      <SceneBackdrop id={id} s={s} />
      <g transform="translate(100 75) scale(1.1)">
        <BiomeDetails id={id} s={s} />
        <Render s={s} />
      </g>
    </svg>
  );
}
