import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/museum-of-bad-design/',  // <-- important
  plugins: [react()],
})
