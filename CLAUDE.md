# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spotify.toJSON() is a Next.js web application that exports Spotify data (playlists, saved songs, top tracks) to JSON format. Users authenticate via Spotify OAuth and can download their data for safekeeping, analysis, or sharing.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

> **Build tooling:** `dev` and `build` use **Turbopack** (Next.js 16 default). This is only safe because the UI library (HeroUI) is imported exclusively in Client Components — see the "HeroUI + Turbopack" note under Key Design Decisions. `lint` runs ESLint directly (`eslint src ...`) because `next lint` was removed in Next.js 16.

## Docker

```bash
# Build Docker image
docker build -t spotify-tojson .

# Run container (requires env vars at runtime)
docker run -p 3000:3000 \
  -e SPOTIFY_CLIENT_ID=your_id \
  -e SPOTIFY_CLIENT_SECRET=your_secret \
  -e AUTH_SECRET=your_auth_secret \
  spotify-tojson
```

Note: The Dockerfile builds on `node:22-alpine` (Next.js 16 requires Node ≥20.9.0) and uses dummy env vars during build time to satisfy Next.js build requirements. Real credentials must be provided at runtime.

## Environment Variables

Required variables in `.env` (see `.env.sample`):
- `SPOTIFY_CLIENT_ID` - Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify app client secret
- `AUTH_SECRET` - NextAuth secret for session encryption

## Architecture

### Authentication Flow
- Uses NextAuth v5 (Auth.js) with Spotify provider configured in `src/auth.ts`
- OAuth scopes: `user-read-email`, `user-top-read`, `user-library-read`, `playlist-read-private`
- Token refresh logic is implemented in the JWT callback to handle expired access tokens
- Middleware in `src/middleware.ts` protects routes: `/top`, `/saved`, `/playlists` (Next.js 16 deprecates the `middleware` file convention in favor of `proxy` — still functional, not yet migrated)

### Data Fetching Pattern
Two approaches are used:

1. **Server Actions** (`src/actions/spotify.ts`):
   - `fetchFromSpotify()` - Base authenticated fetch function
   - `fetchPaginatedFromSpotify()` - Recursively fetches all pages
   - `fetchSavedTracks()`, `fetchTopTracks()`, `fetchUserPlaylists()` - Specific data fetchers
   - Used for initial page loads and UI display

2. **Streaming Export** (`SpotifyTask` class):
   - Located in `src/actions/SpotifyTask.ts`
   - Uses EventEmitter pattern for progress tracking
   - API routes at `/api/export/playlists` and `/api/export/saved` use Server-Sent Events (SSE)
   - Streams progress updates to client during long-running exports
   - Rate limiting: 200ms delay between playlist track fetches

### Route Structure
- `/` - Landing page with sign-in
- `/(auth)/playlists` - View and export playlists
- `/(auth)/saved` - View and export saved tracks
- `/(auth)/top` - View top tracks by time range (short/medium/long term)
- `/api/auth/[...nextauth]` - NextAuth handlers
- `/api/export/*` - SSE endpoints for streaming data exports

### Key Design Decisions
- Next.js App Router with server actions for data fetching
- Standalone output mode (`next.config.mjs`) for Docker deployment
- HeroUI component library (the maintained successor to NextUI) with Tailwind CSS v4, configured CSS-first in `src/app/globals.css` (`@import "tailwindcss"`, `@plugin "../../hero.ts"`, `@source`, `@theme`) — there is no `tailwind.config.ts`; PostCSS uses `@tailwindcss/postcss`
- **HeroUI + Turbopack:** HeroUI components must only be imported in **Client Components**. Importing them into a Server Component breaks the Turbopack build (`createContext is not a function` during page-data collection). This is why `src/app/page.tsx` (a Server Component that calls `auth()`) delegates its UI to `src/components/Landing.tsx` (`"use client"`), and why `Header`/`TrackLoading` are client components
- Dark/light theme switching via next-themes
- Client-side download via blob URLs generated from JSON data

## Important Patterns

### Adding a New Export Type
1. Create server action in `src/actions/spotify.ts` for UI display
2. Add method to `SpotifyTask` class for streaming export
3. Create SSE API route in `src/app/api/export/[name]/route.ts`
4. Add UI page in `src/app/(auth)/[name]/page.tsx`
5. Update middleware matcher if route needs protection

### Working with Spotify API
- All Spotify API calls go through `fetchFromSpotify()` wrapper
- Automatically handles 401 (signs out) and 429 (rate limit) errors
- Access token stored in NextAuth session and auto-refreshed when expired
- Use `fetchPaginatedFromSpotify()` for endpoints that return paginated results

## Tech Stack
- Next.js 16.2.10 (App Router) - Upgraded from 14.x July 2026 (14.x reached security EOL); builds use Turbopack
- React 18.3.1 (stable) - intentionally kept on 18; Next 16 supports React 18 or 19
- NextAuth v5.0.0-beta.30 (Auth.js) - Still in beta, no stable release yet
- TypeScript 5.9.3
- Tailwind CSS 4.3.2 (CSS-first config) + HeroUI 2.8.10 components (migrated from NextUI July 2026)
- Framer Motion 11.18.2 for animations
- next-themes 0.4.6 for theming
- ESLint 8 + eslint-config-next 15.5.20
- Spotify Web API

### Dependency Strategy
This project uses a **conservative upgrade approach** to maintain stability:
- Currently on Next.js 16 + React 18 + Tailwind 4 + HeroUI 2.8. The Next.js 14→16 jump (July 2026) was forced by security — 14.2.35 was the last 14.x release and stayed vulnerable, so there was no patched 14.x to remain on.
- React is intentionally held at 18 (Next 16 supports both 18 and 19) to keep the component/animation stack on proven versions.
- Prefer security patches and in-major (minor/patch) updates; avoid unnecessary major jumps.

**History:** July 2026 — migrated NextUI → HeroUI and Tailwind 3 → 4 to unblock Turbopack (NextUI was not Turbopack-compatible). React deliberately stayed on 18 by using HeroUI 2.x, the last line that supports React 18 (HeroUI 3.x requires React 19 + Tailwind ≥4).

**When to Revisit Major Upgrades:**
- **React 19 + HeroUI 3.x:** HeroUI 3.x requires React 19 (and Tailwind ≥4). Revisit once React 19 is proven across the stack.
- **NextAuth v5 stable:** currently still on beta.30.
- **`middleware` → `proxy`:** Next 16 deprecated the middleware file convention.
- Whenever security vulnerabilities require it (as with the Next 16 jump).

Last updated: July 2026
