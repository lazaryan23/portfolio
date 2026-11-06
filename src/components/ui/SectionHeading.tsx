import { Reveal } from './Reveal';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}

/** Consistent "01 — About" style heading used by every section. */
export function SectionHeading({ index, eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <Reveal className="section-heading">
      <p className="section-heading__eyebrow">
        <span className="section-heading__index">{index}</span>
        <span className="section-heading__line" aria-hidden />
        {eyebrow}
      </p>
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
    </Reveal>
  );
}
