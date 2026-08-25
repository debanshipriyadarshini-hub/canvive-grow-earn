import { useState } from "react";
import { STATIONS } from "@/lib/canvive/data";
import { cn } from "@/lib/utils";

const YOU = { x: 18, y: 62 };

const markerTheme: Record<string, { ring: string; dot: string; glow: string }> = {
  Active: { ring: "#36a85f", dot: "#5fcb7a", glow: "rgba(54,168,95,.35)" },
  "Almost Full": { ring: "#f0872c", dot: "#ffb570", glow: "rgba(240,135,44,.35)" },
  Unavailable: { ring: "#e2586b", dot: "#ff92a1", glow: "rgba(226,88,107,.35)" },
};

const walkTime: Record<string, string> = {
  campus: "2 min walk",
  cafe: "4 min walk",
  vending: "6 min walk",
  sports: "9 min walk",
};

function Tree({ x, y, s = 1, dark = false, delay = 0 }: { x: number; y: number; s?: number; dark?: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="cmap-sway" style={{ animationDelay: `${delay}s` }}>
      <ellipse cx="0" cy="3.2" rx="3" ry="1" fill="rgba(47,41,51,.12)" />
      <rect x="-0.55" y="-1.4" width="1.1" height="4.6" rx="0.5" fill="#a97b52" />
      <circle cx="0" cy="-3.2" r="3.1" fill={dark ? "#2f8b52" : "#4fbf72"} />
      <circle cx="-1.7" cy="-1.9" r="2.1" fill={dark ? "#3aa062" : "#63d489"} />
      <circle cx="1.7" cy="-2.1" r="2" fill={dark ? "#43ac69" : "#7ee09c"} />
      <circle cx="0.6" cy="-4.3" r="1.1" fill="#a7f0bd" opacity=".75" />
    </g>
  );
}

function Bush({ x, y, s = 1, c = "#63d489" }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-1.3" cy="0" r="1.5" fill={c} />
      <circle cx="1.3" cy="0.2" r="1.3" fill={c} />
      <circle cx="0" cy="-0.8" r="1.7" fill={c} />
    </g>
  );
}

function Flower({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y})`} className="cmap-twinkle">
      <circle cx="0" cy="-0.7" r="0.5" fill={c} />
      <circle cx="0.7" cy="0" r="0.5" fill={c} />
      <circle cx="-0.7" cy="0" r="0.5" fill={c} />
      <circle cx="0" cy="0.7" r="0.5" fill={c} />
      <circle cx="0" cy="0" r="0.42" fill="#ffd84d" />
    </g>
  );
}

export function CampusMap({ onSelect }: { onSelect: (id: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="cmap card-soft">
      <svg viewBox="0 0 100 62" className="cmap-svg" role="img" aria-label="Illustrated CanVive campus map with recycling stations">
        <defs>
          <linearGradient id="cmapGrass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e7fbe9" />
            <stop offset="55%" stopColor="#d3f6dd" />
            <stop offset="100%" stopColor="#fdf3e6" />
          </linearGradient>
          <linearGradient id="cmapWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fd9f7" />
            <stop offset="100%" stopColor="#c7f0fb" />
          </linearGradient>
          <linearGradient id="cmapPath" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffeccd" />
            <stop offset="100%" stopColor="#ffe0c2" />
          </linearGradient>
        </defs>

        <rect width="100" height="62" fill="url(#cmapGrass)" />
        {/* meadow blobs */}
        <ellipse cx="20" cy="14" rx="20" ry="11" fill="#c2f0cf" opacity=".8" />
        <ellipse cx="82" cy="46" rx="22" ry="13" fill="#bdefd3" opacity=".7" />
        <ellipse cx="55" cy="30" rx="18" ry="10" fill="#defbe6" opacity=".9" />

        {/* pond */}
        <ellipse cx="86" cy="15" rx="10" ry="5.6" fill="url(#cmapWater)" />
        <ellipse cx="83" cy="13.6" rx="3" ry="1.1" fill="#ffffff" opacity=".55" />

        {/* paths */}
        <path d="M4 54 C 26 50, 30 40, 32 34" stroke="url(#cmapPath)" strokeWidth="4.2" fill="none" strokeLinecap="round" />
        <path d="M32 34 C 44 30, 52 44, 62 56" stroke="url(#cmapPath)" strokeWidth="4.2" fill="none" strokeLinecap="round" />
        <path d="M32 34 C 50 26, 62 26, 76 24" stroke="url(#cmapPath)" strokeWidth="4.2" fill="none" strokeLinecap="round" />
        <path d="M62 56 C 70 50, 74 40, 76 24" stroke="url(#cmapPath)" strokeWidth="3.2" fill="none" strokeLinecap="round" opacity=".75" />

        {/* routes from user to stations */}
        {STATIONS.map((s) => (
          <path
            key={`r-${s.id}`}
            d={`M${YOU.x} ${(YOU.y / 100) * 62} Q ${(YOU.x + s.x) / 2} ${((YOU.y + s.y) / 200) * 62 - 6}, ${s.x} ${(s.y / 100) * 62}`}
            className={cn("cmap-route", hover === s.id && "is-active")}
            fill="none"
          />
        ))}

        {/* landmarks */}
        {/* academic building near campus station */}
        <g transform="translate(24 20)">
          <rect x="-7" y="-6" width="14" height="8" rx="2" fill="#fff6ea" stroke="#ffd0a8" strokeWidth=".4" />
          <path d="M-8 -6 L0 -10 L8 -6 Z" fill="#ffb570" />
          <rect x="-4.4" y="-3.6" width="2.4" height="2.4" rx=".6" fill="#8fd9f7" />
          <rect x="-0.9" y="-3.6" width="2.4" height="2.4" rx=".6" fill="#8fd9f7" />
          <rect x="2.6" y="-3.6" width="2.4" height="2.4" rx=".6" fill="#8fd9f7" />
          <rect x="-1.2" y="-0.4" width="2.4" height="2.4" rx=".6" fill="#ffd84d" />
        </g>
        <Tree x={14} y={24} s={1.2} delay={0.2} />
        <Tree x={35} y={16} s={1} dark delay={0.9} />
        <Bush x={31} y={24} s={1} />
        <Flower x={11} y={31} c="#ff8fa3" />
        <Flower x={39} y={26} c="#c4a6f5" />

        {/* café landmark */}
        <g transform="translate(58 44)">
          <rect x="-6" y="-5" width="12" height="7" rx="2" fill="#fff2ef" stroke="#ffc2bb" strokeWidth=".4" />
          <path d="M-7.5 -5 h15 l-1.6 -3 h-11.8 Z" fill="#ff8fa3" />
          <path d="M-7.5 -5 h3 l.6 -3 h-2 Z" fill="#fff0f3" />
          <path d="M0.5 -5 h3 l.6 -3 h-2 Z" fill="#fff0f3" />
          <circle cx="0" cy="-1" r="1.4" fill="#ffb570" />
        </g>
        <Bush x={51} y={47} s={1.1} c="#7ee09c" />
        <Bush x={66} y={48} s={0.9} c="#4fbf72" />
        <Flower x={54} y={51} c="#ffb570" />
        <Tree x={70} y={42} s={1.05} delay={1.4} />

        {/* vending landmark */}
        <g transform="translate(76 10)">
          <rect x="-3.2" y="-6" width="6.4" height="9" rx="1.6" fill="#dff1ff" stroke="#8fd9f7" strokeWidth=".4" />
          <rect x="-2.2" y="-5" width="3" height="6" rx=".8" fill="#8fd9f7" />
          <circle cx="1.7" cy="-4" r=".5" fill="#c4a6f5" />
          <circle cx="1.7" cy="-2.4" r=".5" fill="#ff8fa3" />
          <rect x="-2.2" y="1.6" width="4.4" height="1" rx=".5" fill="#c4a6f5" />
        </g>
        <Bush x={69} y={16} s={0.9} c="#63d489" />
        <Flower x={82} y={26} c="#c4a6f5" />

        {/* sports area */}
        <ellipse cx="44" cy="54" rx="9" ry="4.6" fill="#c2f0cf" />
        <ellipse cx="44" cy="54" rx="5.4" ry="2.6" fill="none" stroke="#ffffff" strokeWidth=".5" opacity=".8" />
        <Tree x={33} y={52} s={0.95} delay={0.5} />
        {/* bench */}
        <g transform="translate(24 44)">
          <rect x="-2.4" y="-1" width="4.8" height="1" rx=".5" fill="#c99a67" />
          <rect x="-2" y="0" width=".6" height="1.2" fill="#a97b52" />
          <rect x="1.4" y="0" width=".6" height="1.2" fill="#a97b52" />
        </g>

        {/* you-are-here character */}
        <g transform={`translate(${YOU.x} ${(YOU.y / 100) * 62})`}>
          <circle r="4.6" className="cmap-ring" />
          <ellipse cx="0" cy="1.6" rx="2.4" ry=".8" fill="rgba(47,41,51,.16)" />
          <g className="cmap-bob">
            <rect x="-1.7" y="-2.6" width="3.4" height="4" rx="1.6" fill="#36a85f" />
            <rect x="-1.7" y="-0.4" width="3.4" height="1.9" rx=".9" fill="#ff8f6b" />
            <circle cx="0" cy="-4.4" r="2" fill="#ffe0c2" />
            <path d="M-2 -5 a2 2 0 0 1 4 0 z" fill="#ffd84d" />
            <circle cx="-0.7" cy="-4.4" r=".28" fill="#2f2933" />
            <circle cx="0.7" cy="-4.4" r=".28" fill="#2f2933" />
            <path d="M-0.6 -3.7 q0.6 0.5 1.2 0" stroke="#2f2933" strokeWidth=".22" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      <span className="cmap-you-label" style={{ left: `${YOU.x}%`, top: `${YOU.y}%` }}>
        <span className="cmap-you-dot" aria-hidden />
        You are here
      </span>

      {STATIONS.map((s) => {
        const t = markerTheme[s.status] ?? markerTheme.Active;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            onMouseEnter={() => setHover(s.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(s.id)}
            onBlur={() => setHover(null)}
            style={{ left: `${s.x}%`, top: `${s.y}%`, ["--cmap-ring" as string]: t.ring, ["--cmap-dot" as string]: t.dot, ["--cmap-glow" as string]: t.glow }}
            className="cmap-marker"
          >
            <span className="cmap-marker-dot" aria-hidden />
            <span className="cmap-marker-name">{s.name}</span>
            <span className="cmap-marker-walk">{walkTime[s.id]}</span>
          </button>
        );
      })}

      <div className="cmap-legend">
        <span><i style={{ background: "#36a85f" }} />Active</span>
        <span><i style={{ background: "#f0872c" }} />Almost full</span>
        <span><i style={{ background: "#e2586b" }} />Unavailable</span>
      </div>
    </div>
  );
}
