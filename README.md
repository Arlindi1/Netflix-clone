# Netflix Clone+ (Recruiter Showcase)

A redesigned React-based Netflix clone focused on product thinking, visual polish, and interactive depth.

## What Was Upgraded

- Full UI redesign with cinematic hero, motion, responsive layout, and modern typography.
- Centralized catalog architecture (TMDB categories loaded once and normalized).
- Smart discovery features:
  - Live search across title + overview.
  - Genre filtering chips.
  - My List only mode.
- User curation features:
  - Favorite / My List actions.
  - Add custom titles.
  - Edit title details.
  - Hide and restore titles.
- Rich interaction surfaces:
  - Detail modal with metadata and actions.
  - Horizontal rails with smooth scroll controls.
  - Dashboard metrics (catalog count, rating, favorites, list size).
- Persistent local state via `localStorage` so curation survives page refreshes.

## Tech Stack

- React 18
- Create React App
- Axios (TMDB API)
- Font Awesome
- CSS (custom design system with variables and responsive breakpoints)

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

3. Create production build:

```bash
npm run build
```

4. Run tests:

```bash
npm test -- --watchAll=false
```

## Environment Variables (Optional)

You can set your own TMDB key with:

```bash
REACT_APP_TMDB_API_KEY=your_api_key_here
```

If omitted, the app falls back to the key currently stored in source.

## Recruiter Notes

This project now demonstrates:

- Frontend architecture and state modeling.
- UX and visual design improvement capability.
- Feature implementation beyond clone-level parity.
- Production readiness checks (build + tests).
