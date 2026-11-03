import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, strictPort: true },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // e2e specs live in ../e2e and run with Playwright
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
