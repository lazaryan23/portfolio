export interface Skill {
  name: string;
  /** Short monogram rendered inside the skill badge. */
  short: string;
  /** Accent colour for the badge. */
  color: string;
}

export interface SkillGroup {
  title: string;
  description: string;
  icon: 'layout' | 'cube' | 'server' | 'tool';
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    description: 'Component-driven, typed and accessible interfaces that scale.',
    icon: 'layout',
    skills: [
      { name: 'React', short: 'Re', color: '#61dafb' },
      { name: 'Next.js', short: 'Nx', color: '#ffffff' },
      { name: 'TypeScript', short: 'TS', color: '#3178c6' },
      { name: 'JavaScript', short: 'JS', color: '#f7df1e' },
      { name: 'HTML5', short: 'H5', color: '#e34f26' },
      { name: 'CSS3', short: 'C3', color: '#2965f1' },
      { name: 'Mantine UI', short: 'Mt', color: '#339af0' },
    ],
  },
  {
    title: '3D & Graphics',
    description: 'Real-time rendering, geometry and interaction in the browser.',
    icon: 'cube',
    skills: [
      { name: 'Three.js', short: '3J', color: '#a78bfa' },
      { name: 'WebGL', short: 'GL', color: '#990000' },
      { name: 'GLSL Shaders', short: 'SL', color: '#22d3ee' },
      { name: 'Canvas & SVG', short: 'Cv', color: '#f472b6' },
    ],
  },
  {
    title: 'Backend',
    description: 'APIs and services that keep the frontend fast and honest.',
    icon: 'server',
    skills: [
      { name: 'Node.js', short: 'No', color: '#5fa04e' },
      { name: 'REST APIs', short: 'API', color: '#f59e0b' },
      { name: 'WebSockets', short: 'WS', color: '#10b981' },
    ],
  },
  {
    title: 'Tooling',
    description: 'The workflow that keeps shipping smooth and predictable.',
    icon: 'tool',
    skills: [
      { name: 'Git', short: 'Gt', color: '#f05032' },
      { name: 'Vite', short: 'Vi', color: '#bd34fe' },
      { name: 'Webpack', short: 'Wp', color: '#8dd6f9' },
      { name: 'Figma', short: 'Fg', color: '#f24e1e' },
      { name: 'npm / pnpm', short: 'pm', color: '#cb3837' },
    ],
  },
];

/** Flat list of every skill name — used by the marquee and the constellation. */
export const allSkills: string[] = skillGroups.flatMap((g) => g.skills.map((s) => s.name));
