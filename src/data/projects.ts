import { profile } from './profile';

export type ProjectCategory = 'professional' | 'personal';

/** Which generated SVG illustration to show on the project card. */
export type ProjectArtVariant = 'nodes' | 'viewport' | 'cad' | 'platform' | 'portfolio' | 'github';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  category: ProjectCategory;
  art: ProjectArtVariant;
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'node-editor',
    title: 'Node-Based Design Engine',
    subtitle: 'BeeGraphy · Core editor',
    description:
      'A visual programming editor where designers wire nodes together to generate parametric 3D geometry. Graph canvas, typed connections, live evaluation feedback and a fast, keyboard-friendly editing experience.',
    tags: ['React', 'TypeScript', 'Canvas', 'State management'],
    category: 'professional',
    art: 'nodes',
    links: [{ label: 'beegraphy.com', href: profile.companyUrl }],
  },
  {
    id: 'viewport',
    title: 'Real-Time 3D Viewport',
    subtitle: 'BeeGraphy · Rendering',
    description:
      'Three.js viewport that previews generated geometry instantly — orbit controls, selection and highlighting, transform gizmos, materials and performance tuning for heavy scenes.',
    tags: ['Three.js', 'WebGL', 'GLSL', 'TypeScript'],
    category: 'professional',
    art: 'viewport',
    links: [{ label: 'beegraphy.com', href: profile.companyUrl }],
  },
  {
    id: 'cad-tools',
    title: 'Browser CAD Tooling',
    subtitle: 'BeeGraphy · Precision tools',
    description:
      'CAD-style interactions for precise modelling on the web: snapping, measurements, dimension guides and tools that make complex geometry approachable.',
    tags: ['Three.js', 'Geometry', 'UX engineering'],
    category: 'professional',
    art: 'cad',
    links: [{ label: 'beegraphy.com', href: profile.companyUrl }],
  },
  {
    id: 'platform',
    title: 'Web Platform & Dashboard',
    subtitle: 'BeeGraphy · Product web apps',
    description:
      'The web applications around the engine — workspaces, project management and product pages — built with Next.js and Mantine UI and powered by Node.js services.',
    tags: ['Next.js', 'Mantine UI', 'Node.js', 'REST'],
    category: 'professional',
    art: 'platform',
    links: [{ label: 'beegraphy.com', href: profile.companyUrl }],
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    subtitle: 'Personal · Open source',
    description:
      'The site you are looking at: a shader-driven Three.js hero, a reactive node network, magnetic UI and custom cursor — built with React, TypeScript and Vite, deployed to GitHub Pages.',
    tags: ['React', 'Three.js', 'GLSL', 'Framer Motion', 'Vite'],
    category: 'personal',
    art: 'portfolio',
    links: [{ label: 'Source', href: profile.socials.github }],
  },
  {
    id: 'github',
    title: 'More on GitHub',
    subtitle: 'Personal · Experiments',
    description:
      'Side projects, experiments with 3D on the web and open-source contributions. Explore the repositories to see what I am building next.',
    tags: ['Open source', 'Experiments'],
    category: 'personal',
    art: 'github',
    links: [{ label: 'github.com/lazaryan23', href: profile.socials.github }],
  },
];
