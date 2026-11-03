# Drama Keeper client

React 17 + Material-UI v4 app built with [Vite](https://vite.dev/).

## Scripts

Run these in this folder (or with `pnpm --dir client <script>` from the repo root).

- `pnpm dev` starts the dev server at http://localhost:3000 (the API is expected at `VITE_API_URL`, http://localhost:4000 by default).
- `pnpm build` type-checks and builds to `dist/`.
- `pnpm preview` serves the build.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` (Vitest).
- `pnpm e2e` runs the Playwright smoke test (register, log in, add and delete a film). It needs a built client, MongoDB and the API's env vars; CI runs it for you.

## Environment

Copy `.env.example` to `.env`. Variables must start with `VITE_`:

- `VITE_API_URL`
- `VITE_SERVER_AUTH_TOKEN`
- `VITE_GOOGLE_CLIENT_ID`
