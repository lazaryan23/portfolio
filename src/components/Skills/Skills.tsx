import type { CSSProperties } from 'react';
import { allSkills, skillGroups, type SkillGroup } from '../../data/skills';
import { CubeIcon, LayoutIcon, ServerIcon, ToolIcon } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { TiltCard } from '../ui/TiltCard';
import { Constellation } from './Constellation';
import './Skills.css';

const groupIcons: Record<SkillGroup['icon'], typeof LayoutIcon> = {
  layout: LayoutIcon,
  cube: CubeIcon,
  server: ServerIcon,
  tool: ToolIcon,
};

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Skills & stack"
          title="A toolkit tuned for interactive, 3D-heavy products."
          subtitle="From typed component systems to shaders and the Node.js services behind them."
        />

        <div className="skills__grid">
          {skillGroups.map((group, i) => {
            const Icon = groupIcons[group.icon];
            return (
              <Reveal key={group.title} delay={i * 0.08}>
                <TiltCard className="skill-card">
                  <div className="skill-card__head">
                    <span className="skill-card__icon">
                      <Icon size={22} />
                    </span>
                    <span className="skill-card__count">{String(group.skills.length).padStart(2, '0')}</span>
                  </div>
                  <h3 className="skill-card__title">{group.title}</h3>
                  <p className="skill-card__desc">{group.description}</p>
                  <ul className="skill-card__list">
                    {group.skills.map((s) => (
                      <li key={s.name} className="skill-chip" style={{ '--chip': s.color } as CSSProperties}>
                        <span className="skill-chip__badge">{s.short}</span>
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="skills__playground">
            <p className="skills__hint">
              <span className="skills__hint-dot" /> Move your cursor through the stack
            </p>
            <Constellation items={allSkills} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
