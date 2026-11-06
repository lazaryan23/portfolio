import type { SVGProps } from 'react';

/** Small inline SVG icon set — avoids pulling in an icon library. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  'aria-hidden': true as const,
  focusable: false as const,
});

export const GitHubIcon = ({ size = 20, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...base(size)} {...p}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export const LinkedInIcon = ({ size = 20, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...base(size)} {...p}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Stroke = ({ size = 20, children, ...p }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...base(size)}
    {...p}
  >
    {children}
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Stroke>
);

export const ArrowUpRightIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Stroke>
);

export const ArrowDownIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Stroke>
);

export const ArrowUpIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Stroke>
);

export const CopyIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </Stroke>
);

export const CheckIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m5 12 5 5 9-10" />
  </Stroke>
);

export const LayoutIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M9 9v11" />
  </Stroke>
);

export const CubeIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 2.8 20.5 7.5v9L12 21.2 3.5 16.5v-9z" />
    <path d="m3.5 7.5 8.5 4.7 8.5-4.7M12 12.2v9" />
  </Stroke>
);

export const ServerIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M7 7.5h.01M7 16.5h.01" />
  </Stroke>
);

export const ToolIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M14.7 6.3a4 4 0 0 0 5 5L21 12.6 12.6 21a2.1 2.1 0 0 1-3-3L18 9.6l-1.3-1.3a4 4 0 0 1-5-5L13 4.6" />
    <path d="M3 21l4.5-4.5" />
  </Stroke>
);
