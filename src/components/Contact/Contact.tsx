import { useState } from 'react';
import { profile } from '../../data/profile';
import { ArrowUpRightIcon, CheckIcon, CopyIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../ui/Icons';
import { Magnetic } from '../ui/Magnetic';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import './Contact.css';

const links = [
  {
    label: 'GitHub',
    handle: '@lazaryan23',
    href: profile.socials.github,
    Icon: GitHubIcon,
  },
  {
    label: 'LinkedIn',
    handle: 'Levon Lazaryan',
    href: profile.socials.linkedin,
    Icon: LinkedInIcon,
  },
  {
    label: 'Email',
    handle: profile.email,
    href: `mailto:${profile.email}`,
    Icon: MailIcon,
  },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="contact__aurora" aria-hidden />
      <div className="container">
        <SectionHeading index="04" eyebrow="Contact" title="Let's build something remarkable." />

        <Reveal>
          <div className="contact__card">
            <p className="contact__lead">
              Have a product that needs a sharp frontend, a 3D experience on the web, or just want to talk about
              node editors and shaders? My inbox is always open.
            </p>

            <div className="contact__email-row">
              <Magnetic strength={0.2}>
                <a className="contact__email gradient-text" href={`mailto:${profile.email}`} data-cursor-label="Write">
                  {profile.email}
                </a>
              </Magnetic>
              <button className="icon-btn contact__copy" onClick={copyEmail} aria-label="Copy email address">
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
              <span className={`contact__toast ${copied ? 'is-visible' : ''}`} role="status">
                Copied to clipboard
              </span>
            </div>
          </div>
        </Reveal>

        <div className="contact__links">
          {links.map(({ label, handle, href, Icon }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <a
                className="contact-link"
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                <span className="contact-link__icon">
                  <Icon size={22} />
                </span>
                <span className="contact-link__text">
                  <span className="contact-link__label">{label}</span>
                  <span className="contact-link__handle">{handle}</span>
                </span>
                <ArrowUpRightIcon className="contact-link__arrow" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
