import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Transforms JSX and refreshes the page's components while the dev server is running.
export default defineConfig({
  plugins: [react()],
})
