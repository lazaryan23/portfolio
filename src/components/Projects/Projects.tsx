import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { projects, type ProjectCategory } from '../../data/projects';
import { ArrowUpRightIcon } from '../ui/Icons';
import { SectionHeading } from '../ui/SectionHeading';
import { TiltCard } from '../ui/TiltCard';
import { ProjectArt } from './ProjectArt';
import './Projects.css';

type Filter = 'all' | ProjectCategory;

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'professional', label: 'Professional' },
  { id: 'personal', label: 'Personal' },
];

export function Projects() {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title="Things I've built and helped ship."
          subtitle="Professional work at BeeGraphy alongside personal projects and experiments."
        />

        <div className="projects__filters" role="tablist" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`projects__filter ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {filter === f.id && (
                <motion.span layoutId="filter-pill" className="projects__filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="projects__filter-label">{f.label}</span>
              <span className="projects__filter-count">
                {f.id === 'all' ? projects.length : projects.filter((p) => p.category === f.id).length}
              </span>
            </button>
          ))}
        </div>

        <motion.div layout className="projects__grid">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard className="project-card" max={5}>
                  <div className="project-card__art">
                    <ProjectArt variant={p.art} />
                    <span className={`project-card__badge project-card__badge--${p.category}`}>{p.category}</span>
                  </div>
                  <div className="project-card__body">
                    <p className="project-card__subtitle">{p.subtitle}</p>
                    <h3 className="project-card__title">{p.title}</h3>
                    <p className="project-card__desc">{p.description}</p>
                    <ul className="project-card__tags">
                      {p.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    {p.links && (
                      <div className="project-card__links">
                        {p.links.map((l) => (
                          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor-label="Open">
                            {l.label} <ArrowUpRightIcon size={15} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
