import { useState } from 'react';
import { profile } from '../../data/profile';
import { TiltCard } from '../ui/TiltCard';

/**
 * Framed portrait with a gradient border, glow and caption.
 * Falls back to an initials monogram if the image file is missing.
 */
export function Portrait() {
  const [failed, setFailed] = useState(false);
  // BASE_URL keeps the path correct when deployed under /<repo-name>/ on GitHub Pages.
  const src = `${import.meta.env.BASE_URL}${profile.photo}`;

  return (
    <div className="portrait-wrap">
      <div className="portrait-wrap__glow" aria-hidden />
      <TiltCard className="portrait" max={6}>
        <div className="portrait__frame">
          {failed ? (
            <div className="portrait__fallback" aria-hidden>
              {profile.initials}
            </div>
          ) : (
            <img
              className="portrait__img"
              src={src}
              alt={`Portrait of ${profile.name}`}
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
            />
          )}
          <div className="portrait__shade" aria-hidden />

          <span className="portrait__badge">
            <span className="portrait__badge-dot" />
            {profile.yearsOfExperience}+ yrs at {profile.company}
          </span>

          <div className="portrait__caption">
            <p className="portrait__name">{profile.name}</p>
            <p className="portrait__role">{profile.role}</p>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
