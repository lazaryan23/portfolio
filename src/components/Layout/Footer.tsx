import { profile } from '../../data/profile';
import { ArrowUpIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../ui/Icons';
import { Magnetic } from '../ui/Magnetic';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy">
          © {new Date().getFullYear()} {profile.name}. Designed &amp; built with React, Three.js &amp; Vite.
        </p>
        <div className="footer__actions">
          <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-btn">
            <GitHubIcon size={18} />
          </a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-btn">
            <LinkedInIcon size={18} />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="icon-btn">
            <MailIcon size={18} />
          </a>
          <Magnetic>
            <a href="#home" className="icon-btn footer__top" aria-label="Back to top">
              <ArrowUpIcon size={18} />
            </a>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
