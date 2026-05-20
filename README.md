# F1 Analytics — Frontend

Next.js web dashboard for the F1 Analytics platform. Displays live race data, standings, telemetry comparisons, and qualifying results — all sourced from the FastAPI backend.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Lucide React](https://lucide.dev) — icons
- Tailwind CSS

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — next race countdown, last race results |
| `/results` | Race results lookup by year + location |
| `/standings` | Driver and constructor championship standings |
| `/telemetry` | Fastest lap telemetry comparison between two drivers |

## Setup

```bash
npm install
npm run dev
```

Dashboard runs at `http://localhost:3000`.

**The backend must be running** at `http://localhost:8000` before opening the dashboard. See `../backend/README.md`.

## Available Scripts

```bash
npm run dev      # Development server with hot reload
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
