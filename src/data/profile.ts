/**
 * ─────────────────────────────────────────────────────────────
 *  All portfolio content lives in /src/data.
 *  Edit these files to update text, links, skills and projects —
 *  no component code needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Levon Lazaryan',
  initials: 'LL',
  /** Portrait shown in the About section — a file inside /public. */
  photo: 'profile.jpg',
  role: 'Frontend & Web Developer',
  company: 'BeeGraphy',
  companyUrl: 'https://beegraphy.com',
  yearsOfExperience: 3,
  tagline:
    'I engineer interactive 3D interfaces, node-based design engines and fast, delightful web applications.',
  /** Rotating words shown in the hero ("I'm a …") */
  roles: ['Frontend Engineer', '3D Web Developer', 'Three.js Enthusiast', 'UI Craftsman', 'Node.js Developer'],
  email: 'lazaryanlyov79@gmail.com',
  socials: {
    github: 'https://github.com/lazaryan23',
    linkedin: 'https://www.linkedin.com/in/levon-lazaryan-a0b6a0234/',
  },
} as const;

/** Paragraphs for the About section. */
export const aboutParagraphs: string[] = [
  `I'm a frontend and web developer with ${profile.yearsOfExperience} years of professional experience at BeeGraphy, where I help build a browser-based platform for computational and parametric 3D design.`,
  'My day-to-day sits where engineering meets visual thinking: a node-based design engine that turns graphs into geometry, real-time Three.js viewports, precise CAD-style tooling, and the web applications wrapped around them.',
  'I care about interfaces that feel instant, code that stays readable as it scales, and the small interaction details that make complex tools feel effortless.',
];

/** Short highlight bullets rendered as chips next to the About text. */
export const aboutHighlights: string[] = [
  'Node-based 3D design engine',
  'CAD tools in the browser',
  'Real-time WebGL rendering',
  'Production React & Next.js apps',
];

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  url?: string;
  points: string[];
}

export const experience: ExperienceItem[] = [
  {
    company: 'BeeGraphy',
    role: 'Frontend & Web Developer',
    period: '2023 — Present',
    url: 'https://beegraphy.com',
    points: [
      'Engineer the node-based visual editor at the core of the 3D design engine — graph canvas, connections, evaluation feedback and editor UX.',
      'Build Three.js viewports and CAD tooling: geometry previews, camera controls, selection, gizmos, snapping and measurement.',
      'Ship production web applications with React, Next.js, TypeScript and Mantine UI, backed by Node.js services.',
      'Focus on rendering performance, reusable component architecture and polished interaction design.',
    ],
  },
];
