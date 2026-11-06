import { allSkills } from '../../data/skills';

/** Two infinitely scrolling rows of tech names moving in opposite directions. */
export function TechMarquee() {
  const half = Math.ceil(allSkills.length / 2);
  const rows = [allSkills.slice(0, half), allSkills.slice(half)];

  return (
    <div className="marquee" aria-label="Technologies I work with">
      {rows.map((row, r) => (
        <div key={r} className={`marquee__row ${r === 1 ? 'marquee__row--reverse' : ''}`}>
          {/* The list is rendered twice so the loop is seamless. */}
          {[0, 1].map((copy) => (
            <ul key={copy} className="marquee__track" aria-hidden={copy === 1}>
              {row.map((name) => (
                <li key={name}>
                  {name}
                  <span className="marquee__star">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}
