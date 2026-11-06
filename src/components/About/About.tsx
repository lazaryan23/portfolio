import { aboutHighlights, aboutParagraphs, experience, profile } from '../../data/profile';
import { allSkills } from '../../data/skills';
import { CountUp } from '../ui/CountUp';
import { ArrowUpRightIcon } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { TiltCard } from '../ui/TiltCard';
import { Portrait } from './Portrait';
import './About.css';

const stats = [
  { value: profile.yearsOfExperience, suffix: '+', label: 'Years building at BeeGraphy' },
  { value: allSkills.length, suffix: '+', label: 'Technologies in my toolbox' },
  { value: 3, suffix: 'D', label: 'Node engines, viewports & CAD tools' },
];

export function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading
          index="01"
          eyebrow="About me"
          title="Engineering the tools designers create with."
        />

        <div className="about__grid">
          <Reveal className="about__portrait">
            <Portrait />
          </Reveal>

          <div className="about__text">
            {aboutParagraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <ul className="about__highlights">
                {aboutHighlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="about__lower">
          <Reveal className="about__code-wrap">
            <TiltCard className="code-card" max={5}>
              <div className="code-card__bar">
                <span />
                <span />
                <span />
                <p>developer.ts</p>
              </div>
              <CodeSnippet />
            </TiltCard>
          </Reveal>

          <div className="about__stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="stat">
                  <p className="stat__value gradient-text">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="stat__label">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="timeline">
          {experience.map((job) => (
            <Reveal key={job.company + job.period}>
              <article className="timeline__item">
                <div className="timeline__meta">
                  <p className="timeline__period">{job.period}</p>
                  <h3 className="timeline__company">
                    {job.url ? (
                      <a href={job.url} target="_blank" rel="noreferrer">
                        {job.company} <ArrowUpRightIcon size={16} />
                      </a>
                    ) : (
                      job.company
                    )}
                  </h3>
                  <p className="timeline__role">{job.role}</p>
                </div>
                <ul className="timeline__points">
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A tiny hand-highlighted TypeScript snippet — no syntax-highlighter dependency needed. */
function CodeSnippet() {
  const K = ({ children }: { children: string }) => <span className="tk-key">{children}</span>;
  const S = ({ children }: { children: string }) => <span className="tk-str">{children}</span>;
  const P = ({ children }: { children: string }) => <span className="tk-prop">{children}</span>;
  const list = (items: string[]) =>
    items.map((it, i) => (
      <span key={it}>
        <S>{`'${it}'`}</S>
        {i < items.length - 1 ? ', ' : ''}
      </span>
    ));

  return (
    <pre className="code-card__body">
      <code>
        <K>const</K> <span className="tk-var">developer</span> = {'{'}
        {'\n  '}<P>name</P>: <S>{`'${profile.name}'`}</S>,
        {'\n  '}<P>role</P>: <S>{`'${profile.role}'`}</S>,
        {'\n  '}<P>company</P>: <S>{`'${profile.company}'`}</S>,
        {'\n  '}<P>experience</P>: <span className="tk-num">{profile.yearsOfExperience}</span>, <span className="tk-comment">{'// years'}</span>
        {'\n  '}<P>focus</P>: [{list(['3D engines', 'CAD tools', 'Web apps'])}],
        {'\n  '}<P>stack</P>: [{list(['React', 'Next.js', 'TypeScript', 'Three.js'])}],
        {'\n  '}<P>loves</P>: <S>{`'interfaces that feel alive'`}</S>,
        {'\n'}{'}'};
        {'\n\n'}<span className="tk-var">developer</span>.<span className="tk-fn">build</span>(<S>{`'something remarkable'`}</S>);
        <span className="code-card__caret" aria-hidden />
      </code>
    </pre>
  );
}
