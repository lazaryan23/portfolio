import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * BASE_PATH controls the public path the site is served from.
 *  - `https://<user>.github.io/`            -> BASE_PATH=/            (default)
 *  - `https://<user>.github.io/<repo-name>/` -> BASE_PATH=/<repo-name>/
 * The GitHub Actions workflow sets it automatically from the repository name.
 */
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
});
