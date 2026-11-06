import { MotionConfig } from 'framer-motion';
import { About } from './components/About/About';
import { Contact } from './components/Contact/Contact';
import { Hero } from './components/Hero/Hero';
import { Background } from './components/Layout/Background';
import { Cursor } from './components/Layout/Cursor';
import { Footer } from './components/Layout/Footer';
import { Navbar } from './components/Layout/Navbar';
import { TechMarquee } from './components/Layout/TechMarquee';
import { Projects } from './components/Projects/Projects';
import { Skills } from './components/Skills/Skills';

export default function App() {
  return (
    // reducedMotion="user" makes every Framer Motion animation respect the OS setting.
    <MotionConfig reducedMotion="user">
      <Background />
      <Cursor />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
