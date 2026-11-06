# Levon Lazaryan — Developer Portfolio

A personal portfolio for a Frontend & Web Developer, with a dark theme, lots of motion and plenty of interaction. It's built with **React**, **TypeScript**, **Three.js** and **Vite**, and deploys to **GitHub Pages** automatically.

## ✨ Features

- **Interactive Three.js hero:** a GLSL noise-shaded "morphing core" surrounded by a moving node network. Nodes push away from the cursor and draw lines to it. The scene loads lazily in its own chunk and stops rendering when it scrolls out of view.
- **Custom cursor:** a dot plus a trailing ring that grows over links and can show a label (`data-cursor-label="Open"`). It's only enabled on mouse/trackpad devices.
- **Magnetic buttons, 3D tilt cards with cursor spotlights**, and a cursor-following page glow
- **Skills constellation:** floating tech chips that drift on their own and scatter away from the cursor
- **Animated project cards:** each illustration is a generated SVG with its own animation (no image files). You can filter them by category.
- **Scroll-triggered reveals**, letter-by-letter name animation, rotating role text, count-up stats and a scroll progress bar
- **Responsive** from small phones to wide desktops, with a mobile menu
- **Accessible:** respects `prefers-reduced-motion`, has visible focus styles, a skip link and semantic markup

## 🧱 Tech stack

| Area      | Tools                                                    |
| --------- | -------------------------------------------------------- |
| Framework | React 18, TypeScript, Vite                               |
| 3D        | Three.js via `@react-three/fiber`, custom GLSL shaders   |
| Motion    | Framer Motion, CSS animations, `requestAnimationFrame`   |
| Styling   | Plain CSS with design tokens (no CSS framework)          |
| Hosting   | GitHub Pages (`gh-pages` branch, via the `gh-pages` npm package) |

## 📁 Project structure

```
.
├── public/                        # Static assets copied as-is (favicon, profile.jpg)
├── src/
│   ├── data/                      # ✏️  ALL CONTENT LIVES HERE
│   │   ├── profile.ts             #     name, bio, experience, links
│   │   ├── skills.ts              #     skill groups & colours
│   │   └── projects.ts            #     project cards
│   ├── components/
│   │   ├── Hero/                  # Hero section + Three.js scene + GLSL shaders
│   │   ├── About/                 # Bio, code card, stats, experience timeline
│   │   ├── Skills/                # Skill cards + interactive constellation
│   │   ├── Projects/              # Filterable project grid + generated SVG art
│   │   ├── Contact/               # Email CTA (copy to clipboard) + social links
│   │   ├── Layout/                # Navbar, Footer, Cursor, Background, Marquee
│   │   └── ui/                    # Reusable primitives: Reveal, Magnetic, TiltCard…
│   ├── hooks/                     # useMediaQuery, useActiveSection
│   ├── styles/global.css          # Design tokens, base styles, shared components
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── vite.config.ts
```

## 🚀 Getting started

Requires **Node.js 18+** (20 LTS recommended).

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check and build to /dist
npm run preview   # serve the production build locally
```

## ✏️ Customising content

You don't need to touch any component code to update the content. Edit the files in [`src/data`](src/data):

- **`profile.ts`**: name, role, tagline, rotating hero roles, About text, experience timeline, email and social links
- **`skills.ts`**: skill groups. Each skill has a short badge label and an accent colour.
- **`projects.ts`**: project cards. `art` picks one of the generated illustrations: `nodes`, `viewport`, `cad`, `platform`, `portfolio` or `github`.

The colours, fonts and spacing are CSS custom properties at the top of [`src/styles/global.css`](src/styles/global.css).

## 🌐 Deploying to GitHub Pages

The site is live at **https://lazaryan23.github.io/portfolio/** and is published from the `gh-pages` branch of [`lazaryan23/portfolio`](https://github.com/lazaryan23/portfolio).

To publish a new version:

```bash
npm run deploy
```

`predeploy` builds the site with `BASE_PATH=/portfolio/`, so asset URLs match the repository sub-path. Then `gh-pages` pushes `dist/` to the `gh-pages` branch. GitHub Pages usually picks up the change within a minute.

Remember to commit and push your source changes to `main` as well, because `npm run deploy` only publishes the built files.

**Using a different repository name?** Change `homepage` and the `BASE_PATH` in the `predeploy` script in `package.json` to match. If the repository is named `lazaryan23.github.io`, use `BASE_PATH=/` and the site is served from the root.

The first time you deploy to a new repository, go to **Settings → Pages** and set **Source** to "Deploy from a branch", choosing `gh-pages` and `/ (root)`.

## ⚡ Performance notes

- Three.js is code-split and loaded after the page shell renders. If WebGL isn't available, the hero still works without it.
- The WebGL render loop pauses (`frameloop="never"`) when the hero is off-screen, and the constellation's animation loop stops when it isn't visible.
- Mouse-driven effects write CSS variables or `transform`s directly, so React doesn't re-render on mouse movement.
- Device pixel ratio is capped at 1.75 to keep high-DPI screens smooth.

## 📄 License

MIT. You're welcome to use this as a starting point for your own portfolio.
