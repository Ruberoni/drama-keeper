import { defineConfig } from '@playwright/test'

// Runs the built client (vite preview, :3000) against the real API (:4000).
// The API needs MONGO_URI (and tokenKey) in the environment; see .github/workflows/ci.yml.
// Build the client with VITE_API_URL=http://localhost:4000 before running.
export default defineConfig({
  testDir: './e2e',
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    launchOptions: {
      // Lets a machine with a preinstalled Chromium skip `playwright install`.
      executablePath: process.env.PW_CHROMIUM_PATH || undefined,
    },
  },
  webServer: [
    {
      command: 'pnpm --dir .. build && pnpm --dir .. start',
      url: 'http://localhost:4000',
      // Several specs run in parallel against one API; the default 20 requests/min would return 429s.
      env: { PORT: '4000', RATE_LIMIT_PER_MINUTE: '1000' },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm preview --port 3000 --strictPort',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
  ],
})
