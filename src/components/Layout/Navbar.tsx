import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { profile } from '../../data/profile';
import { useActiveSection } from '../../hooks/useActiveSection';
import './Navbar.css';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];
const sectionIds = ['home', ...navItems.map((n) => n.id)];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  // Thin gradient bar at the very top that tracks scroll progress.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden />
      <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="container navbar__inner" aria-label="Primary">
          <a href="#home" className="navbar__logo" aria-label={`${profile.name} — home`}>
            <span className="navbar__logo-mark">{profile.initials}</span>
            <span className="navbar__logo-text">
              {profile.name.split(' ')[0]}
              <span className="gradient-text">.dev</span>
            </span>
          </a>

          <ul className="navbar__links">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={active === item.id ? 'is-active' : ''}>
                  <span className="navbar__num">0{i + 1}</span>
                  {item.label}
                  {active === item.id && <motion.span layoutId="nav-underline" className="navbar__underline" />}
                </a>
              </li>
            ))}
          </ul>

          <a className="btn btn--small btn--ghost navbar__cta" href={`mailto:${profile.email}`}>
            Say hello
          </a>

          <button
            className={`navbar__burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul>
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={`#${item.id}`} onClick={() => setOpen(false)}>
                    <span className="navbar__num">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
