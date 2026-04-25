# FightTimer — Boxing & HIIT Training App

A PWA training timer for boxing rounds and HIIT workouts with workout logging, built with React + Vite.

## Features

- **Boxing Timer** — configurable round / rest durations with real bell sounds
- **HIIT Workout** — interval timer with progress dots
- **Workout Log** — CRUD log with finish checklist, persisted via localStorage
- **PWA** — installable, works offline
- **Responsive** — mobile-first design for Android & iOS

## Tech Stack

- React 18 + Vite
- vite-plugin-pwa (service worker, manifest, offline caching)
- Web Audio API + real MP3 sound files
- CSS (single file, no framework)
- localStorage for data persistence

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## Project Structure

```
src/
├── App.jsx / App.css         ← Main layout, routing, all styles
├── components/
│   ├── Navbar.jsx             ← Logo + sticky tab navigation
│   ├── BoxingView.jsx          ← Boxing round timer
│   ├── HiitView.jsx           ← HIIT interval timer
│   ├── WorkoutLog.jsx          ← Workout log with CRUD + finish check
│   ├── TimerDisplay.jsx        ← MM:SS countdown display
│   ├── Controls.jsx            ← Start / Pause / Resume / Reset
│   └── Settings.jsx           ← Configurable timer settings + Apply button
├── hooks/
│   ├── useTimer.js            ← Boxing timer logic
│   ├── useHiitTimer.js        ← HIIT timer logic
│   └── useLocalStorage.js     ← Persistent state hook
└── utils/
    ├── sounds.js               ← MP3 bell player + Web Audio fallback
    └── storage.js              ← Raw localStorage helpers

public/
├── sound/                     ← Bell sound MP3 files
└── img/                        ← Logo assets
```

## PWA Installation

**Android:** Open in Chrome → Menu → Add to Home Screen

**iOS:** Open in Safari → Share → Add to Home Screen

Offline support is enabled after first load.