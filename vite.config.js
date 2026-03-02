import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment, set the base to '/' by default
  // To use a subdirectory like '/new-world-timeline-app/', set:
  // base: '/new-world-timeline-app/'
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
