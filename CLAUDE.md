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

Note: The Dockerfile uses dummy env vars during build time to satisfy Next.js build requirements. Real credentials must be provided at runtime.

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
- Middleware in `src/middleware.ts` protects routes: `/top`, `/saved`, `/playlists`

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
- NextUI component library with Tailwind CSS
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
- Next.js 14.2.35 (App Router) - Updated Feb 2026 with security patches
- React 18.3.1 (stable)
- NextAuth v5.0.0-beta.30 (Auth.js) - Still in beta, no stable release yet
- TypeScript 5.9.3
- Tailwind CSS 3.4.19 + NextUI 2.4.2 components
- Framer Motion 11.2.12 for animations
- Spotify Web API

### Dependency Strategy
This project uses a **conservative upgrade approach** to maintain stability:
- Stays on Next.js 14 and React 18 (proven, stable stack)
- Updates security patches and minor versions
- Avoids major version upgrades (Next.js 15, React 19) until ecosystem matures

**When to Revisit Major Upgrades:**
- When NextAuth v5 stable is released (currently in beta)
- When Next.js 15 + React 19 ecosystem is mature (NextUI fully compatible, 6+ months adoption)
- If security vulnerabilities require newer versions
- If specific features from newer versions are needed

Last updated: February 2026
