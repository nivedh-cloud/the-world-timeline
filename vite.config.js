import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment with repository 'the-world-timeline'
  base: '/the-world-timeline/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
