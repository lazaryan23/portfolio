import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { profile } from '../../data/profile';
import { ArrowDownIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../ui/Icons';
import { Magnetic } from '../ui/Magnetic';
import './Hero.css';

// Three.js is heavy — load the scene in its own chunk after the page shell renders.
const HeroScene = lazy(() => import('./HeroScene'));

const ease = [0.22, 1, 0.36, 1] as const;

/** Checks once whether the browser can create a WebGL context. */
function useWebGLSupport() {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setSupported(!!(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const webgl = useWebGLSupport();

  // Pause the WebGL render loop while the hero is off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="home" className="hero" ref={sectionRef}>
      <div className="hero__canvas" aria-hidden>
        {webgl && (
          <Suspense fallback={null}>
            <HeroScene active={inView} />
          </Suspense>
        )}
      </div>
      <div className="hero__fade" aria-hidden />

      <div className="container hero__content">
        <motion.p
          className="hero__badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="hero__badge-dot" />
          {profile.role} at{' '}
          <a href={profile.companyUrl} target="_blank" rel="noreferrer">
            {profile.company}
          </a>
        </motion.p>

        <h1 className="hero__title">
          <motion.span
            className="hero__hello"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            Hi, I&apos;m
          </motion.span>
          <AnimatedName text={profile.name} />
        </h1>

        <motion.p
          className="hero__roles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <span className="hero__roles-prefix">I build as a</span> <RotatingText words={profile.roles} />
        </motion.p>

        <motion.p
          className="hero__lead"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease }}
        >
          <Magnetic>
            <a className="btn btn--primary" href="#projects">
              View my work
            </a>
          </Magnetic>
          <Magnetic>
            <a className="btn btn--ghost" href="#contact">
              Get in touch
            </a>
          </Magnetic>
          <div className="hero__socials">
            <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-btn">
              <GitHubIcon />
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-btn">
              <LinkedInIcon />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="icon-btn">
              <MailIcon />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero__scroll"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span>Scroll</span>
        <ArrowDownIcon size={16} />
      </motion.a>
    </section>
  );
}

/** Name revealed letter by letter; each letter lifts when hovered. */
function AnimatedName({ text }: { text: string }) {
  return (
    <span className="hero__name" aria-label={text}>
      {text.split(' ').map((word, wi) => (
        <span className="hero__word" key={wi} aria-hidden>
          {word.split('').map((ch, ci) => (
            <motion.span
              key={ci}
              className="hero__letter"
              initial={{ opacity: 0, y: '0.6em', rotateX: -70 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.2 + (wi * 6 + ci) * 0.04, ease }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

/** Cycles through words with a vertical slide. */
function RotatingText({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
    return () => window.clearInterval(id);
  }, [words.length]);

  return (
    <span className="rotating-text">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="rotating-text__word gradient-text"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
