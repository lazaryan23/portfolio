import { useId } from 'react';
import type { ProjectArtVariant } from '../../data/projects';

/**
 * Generated SVG illustrations for project cards — crisp at any size,
 * zero image weight, and animated with CSS (see Projects.css).
 */
export function ProjectArt({ variant }: { variant: ProjectArtVariant }) {
  // useId returns ":r1:"-style ids; strip colons so they are safe inside url(#…).
  const uid = useId().replace(/:/g, '');
  const grad = `grad-${uid}`;
  const glow = `glow-${uid}`;

  return (
    <svg className={`project-art project-art--${variant}`} viewBox="0 0 400 220" role="img" aria-hidden>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.55" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#0b0b12" />
      <Grid />
      {variant === 'nodes' && <NodesArt grad={grad} />}
      {variant === 'viewport' && <ViewportArt grad={grad} glow={glow} />}
      {variant === 'cad' && <CadArt grad={grad} />}
      {variant === 'platform' && <PlatformArt grad={grad} />}
      {variant === 'portfolio' && <PortfolioArt grad={grad} glow={glow} />}
      {variant === 'github' && <GithubArt grad={grad} />}
    </svg>
  );
}

function Grid() {
  const lines = [];
  for (let x = 20; x < 400; x += 20) lines.push(<line key={`x${x}`} x1={x} y1="0" x2={x} y2="220" />);
  for (let y = 20; y < 220; y += 20) lines.push(<line key={`y${y}`} x1="0" y1={y} x2="400" y2={y} />);
  return (
    <g stroke="#ffffff" strokeOpacity="0.035" strokeWidth="1">
      {lines}
    </g>
  );
}

/** A miniature node graph with data flowing along the wires. */
function NodesArt({ grad }: { grad: string }) {
  const nodes = [
    { x: 30, y: 34, w: 96, h: 52, title: 'Point' },
    { x: 30, y: 134, w: 96, h: 52, title: 'Vector' },
    { x: 160, y: 82, w: 96, h: 56, title: 'Extrude' },
    { x: 292, y: 38, w: 86, h: 48, title: 'Mesh' },
    { x: 292, y: 134, w: 86, h: 48, title: 'Export' },
  ];
  const wires = [
    'M126 60 C 145 60, 140 100, 160 100',
    'M126 160 C 145 160, 140 120, 160 120',
    'M256 110 C 275 110, 272 62, 292 62',
    'M256 110 C 275 110, 272 158, 292 158',
  ];
  return (
    <g>
      {wires.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="#8b5cf6" strokeOpacity="0.35" strokeWidth="2" />
          <path className="art-flow" d={d} fill="none" stroke={`url(#${grad})`} strokeWidth="2" style={{ animationDelay: `${i * -0.4}s` }} />
        </g>
      ))}
      {nodes.map((n, i) => (
        <g key={n.title} className="art-node" style={{ animationDelay: `${i * 0.3}s` }}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="9" fill="#14131f" stroke="#ffffff" strokeOpacity="0.12" />
          <rect x={n.x} y={n.y} width={n.w} height="16" rx="9" fill={`url(#${grad})`} fillOpacity="0.85" />
          <rect x={n.x} y={n.y + 9} width={n.w} height="7" fill={`url(#${grad})`} fillOpacity="0.85" />
          <text x={n.x + 9} y={n.y + 12} fontSize="8.5" fontFamily="JetBrains Mono, monospace" fill="#0b0b12" fontWeight="600">
            {n.title}
          </text>
          <rect x={n.x + 10} y={n.y + 26} width={n.w * 0.55} height="5" rx="2.5" fill="#ffffff" fillOpacity="0.14" />
          <rect x={n.x + 10} y={n.y + 36} width={n.w * 0.35} height="5" rx="2.5" fill="#ffffff" fillOpacity="0.08" />
          <circle cx={n.x} cy={n.y + n.h / 2 + 6} r="4" fill="#0b0b12" stroke="#22d3ee" strokeWidth="1.5" />
          <circle cx={n.x + n.w} cy={n.y + n.h / 2 + 6} r="4" fill="#22d3ee" />
        </g>
      ))}
    </g>
  );
}

/** Isometric wireframe cube with a transform gizmo. */
function ViewportArt({ grad, glow }: { grad: string; glow: string }) {
  return (
    <g>
      <ellipse cx="200" cy="112" rx="120" ry="80" fill={`url(#${glow})`} />
      <g stroke="#ffffff" strokeOpacity="0.08">
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1={200 + i * 40} y1="170" x2={200 + i * 70} y2="220" />
          </g>
        ))}
        <line x1="40" y1="170" x2="360" y2="170" />
        <line x1="0" y1="194" x2="400" y2="194" />
      </g>
      <g className="art-spin">
        <g fill="none" stroke={`url(#${grad})`} strokeWidth="2" strokeLinejoin="round">
          <path d="M200 40 L256 72 L200 104 L144 72 Z" fill="#8b5cf6" fillOpacity="0.12" />
          <path d="M144 72 L144 136 L200 168 L200 104" fill="#22d3ee" fillOpacity="0.06" />
          <path d="M256 72 L256 136 L200 168" fill="#f472b6" fillOpacity="0.05" />
        </g>
        <g stroke="#ffffff" strokeOpacity="0.18" strokeDasharray="3 4" fill="none">
          <path d="M144 72 L200 104 L256 72 M200 104 L200 168" />
        </g>
        {[[200, 40], [256, 72], [144, 72], [200, 104], [144, 136], [256, 136], [200, 168]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#ffffff" />
        ))}
      </g>
      <g transform="translate(46 176)" strokeWidth="2.5" strokeLinecap="round">
        <line x1="0" y1="0" x2="26" y2="0" stroke="#f87171" />
        <line x1="0" y1="0" x2="0" y2="-26" stroke="#4ade80" />
        <line x1="0" y1="0" x2="-15" y2="14" stroke="#60a5fa" />
        <circle r="3" fill="#fff" />
      </g>
      <text x="330" y="28" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#ffffff" fillOpacity="0.4">60 FPS</text>
    </g>
  );
}

/** An L-shaped profile with dimension lines and snap markers. */
function CadArt({ grad }: { grad: string }) {
  return (
    <g fontFamily="JetBrains Mono, monospace" fontSize="9">
      <path
        className="art-draw"
        d="M120 50 H260 V100 H190 V170 H120 Z"
        fill="#8b5cf6"
        fillOpacity="0.08"
        stroke={`url(#${grad})`}
        strokeWidth="2"
      />
      <g stroke="#22d3ee" strokeOpacity="0.7" strokeWidth="1" fill="#22d3ee">
        <line x1="120" y1="32" x2="260" y2="32" />
        <line x1="120" y1="27" x2="120" y2="44" />
        <line x1="260" y1="27" x2="260" y2="44" />
        <line x1="96" y1="50" x2="96" y2="170" />
        <line x1="91" y1="50" x2="108" y2="50" />
        <line x1="91" y1="170" x2="108" y2="170" />
      </g>
      <text x="172" y="26" fill="#67e8f9">140.00</text>
      <text x="56" y="114" fill="#67e8f9">120.00</text>
      {[[260, 100], [190, 100], [190, 170]].map(([x, y], i) => (
        <g key={i} className="art-snap" style={{ animationDelay: `${i * 0.5}s` }}>
          <rect x={x - 5} y={y - 5} width="10" height="10" fill="none" stroke="#f472b6" strokeWidth="1.5" />
        </g>
      ))}
      <g stroke="#f472b6" strokeOpacity="0.5" strokeDasharray="4 4">
        <line x1="190" y1="170" x2="330" y2="170" />
        <line x1="260" y1="100" x2="330" y2="100" />
      </g>
      <g transform="translate(290 128)">
        <rect width="86" height="30" rx="6" fill="#14131f" stroke="#ffffff" strokeOpacity="0.12" />
        <text x="10" y="19" fill="#f9a8d4">∠ 90.0°</text>
      </g>
    </g>
  );
}

/** A dashboard mock with animated bar chart. */
function PlatformArt({ grad }: { grad: string }) {
  const bars = [46, 70, 54, 88, 64, 96, 78];
  return (
    <g>
      <rect x="20" y="20" width="360" height="190" rx="10" fill="#11101a" stroke="#ffffff" strokeOpacity="0.1" />
      <rect x="20" y="20" width="70" height="190" rx="10" fill="#ffffff" fillOpacity="0.03" />
      <circle cx="42" cy="42" r="9" fill={`url(#${grad})`} />
      {[70, 92, 114, 136].map((y, i) => (
        <rect key={y} x="34" y={y} width={i === 0 ? 42 : 34} height="7" rx="3.5" fill="#ffffff" fillOpacity={i === 0 ? 0.35 : 0.1} />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${106 + i * 92} 36)`}>
          <rect width="82" height="48" rx="8" fill="#ffffff" fillOpacity="0.035" stroke="#ffffff" strokeOpacity="0.07" />
          <rect x="10" y="12" width="34" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.18" />
          <rect x="10" y="26" width="52" height="10" rx="3" fill={`url(#${grad})`} fillOpacity={0.9 - i * 0.2} />
        </g>
      ))}
      <g transform="translate(110 192)">
        {bars.map((h, i) => (
          <rect
            key={i}
            className="art-bar"
            x={i * 38}
            y={-h}
            width="22"
            height={h}
            rx="5"
            fill={`url(#${grad})`}
            fillOpacity={0.45 + (i / bars.length) * 0.5}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </g>
    </g>
  );
}

/** Echo of the hero: a glowing core with orbiting nodes. */
function PortfolioArt({ grad, glow }: { grad: string; glow: string }) {
  return (
    <g>
      <circle cx="200" cy="110" r="100" fill={`url(#${glow})`} />
      <g className="art-spin-slow" fill="none" stroke="#ffffff" strokeOpacity="0.12">
        <ellipse cx="200" cy="110" rx="140" ry="44" />
        <ellipse cx="200" cy="110" rx="110" ry="70" transform="rotate(30 200 110)" />
        <ellipse cx="200" cy="110" rx="110" ry="70" transform="rotate(-30 200 110)" />
        <circle cx="340" cy="110" r="4" fill="#22d3ee" stroke="none" />
        <circle cx="105" cy="55" r="3.5" fill="#f472b6" stroke="none" />
        <circle cx="290" cy="170" r="3" fill="#a78bfa" stroke="none" />
      </g>
      <circle className="art-pulse" cx="200" cy="110" r="44" fill={`url(#${grad})`} />
      <circle cx="186" cy="96" r="14" fill="#ffffff" fillOpacity="0.25" />
    </g>
  );
}

/** Contribution-graph style grid with a code bracket. */
function GithubArt({ grad }: { grad: string }) {
  const cells = [];
  for (let c = 0; c < 22; c++) {
    for (let r = 0; r < 7; r++) {
      // Deterministic pseudo-random intensity so it renders identically every time.
      const v = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1;
      cells.push(
        <rect
          key={`${c}-${r}`}
          className="art-cell"
          x={26 + c * 16}
          y={66 + r * 16}
          width="12"
          height="12"
          rx="3"
          fill={v > 0.35 ? `url(#${grad})` : '#ffffff'}
          fillOpacity={v > 0.35 ? 0.2 + v * 0.75 : 0.05}
          style={{ animationDelay: `${(c + r) * 0.05}s` }}
        />,
      );
    }
  }
  return (
    <g>
      <text x="26" y="48" fontSize="22" fontFamily="JetBrains Mono, monospace" fill={`url(#${grad})`} fontWeight="500">
        {'</> lazaryan23'}
      </text>
      {cells}
    </g>
  );
}
