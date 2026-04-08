# Advanced Data Intelligence Platform (EDA)

Interactive React dashboards for exploratory data analysis on:
- Spotify Top Songs 2023 (tabular/audio features)
- MMHS150K multimodal hate speech (tweet text + image/OCR)

## Highlights

- Dual dashboards with different UX styles and storytelling flow
- Plotly-based interactive charts (distribution, correlation, similarity, profile)
- Section-level insights and interpretation notes for presentation use
- Responsive UI with animated expand/collapse sections
- Data-backed hard-coded summaries where notebook outputs are required

## Live Web View

- Public landing page (GitHub Pages): https://nghingo169.github.io/eda/
- Start from the landing page, then choose either Spotify EDA or MMHS150K Hate EDA dashboard.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4 + `clsx` + `tailwind-merge`
- Plotly.js via `react-plotly.js`
- Framer Motion
- Lucide React
- Google Fonts: Inter + Montserrat

## Project Structure

```text
P4AIDS-full_page/
├── src/
│   ├── App.tsx
│   ├── Home.tsx
│   ├── index.css
│   ├── lib/
│   │   └── utils.ts
│   └── pages/
│       ├── 1_spotify/
│       │   └── SpotifyEDA.tsx
│       └── 2_hate/
│           ├── Hate.tsx
│           ├── englishStopwords.ts
│           └── data/                 # JSON inputs consumed by Hate.tsx
├── public/
├── package.json
└── vite.config.ts
```

## Data Notes

- `Hate.tsx` now resolves chart JSON from `src/pages/2_hate/data` using:
  - `new URL('./data/<file>.json', import.meta.url).href`
- Keep only runtime JSON assets in that folder.
- Avoid storing large notebooks (`.ipynb`) under `src/` in production, because Vite can bundle them as assets.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and Run

```bash
npm install
npm run dev
```

Open the local URL shown in terminal (typically `http://localhost:3000`).

### Production Build

```bash
npm run build
npm run preview
```

## Dashboard Scope

### Spotify EDA
- Distribution and outlier analysis
- Correlation and platform-presence effects
- Artist impact and collaboration patterns
- Audio profile comparison and release-year trend views

### MMHS150K Hate EDA
- Dataset imbalance and quality checks
- Text behavior, lexical richness, and class signals
- Image characteristics and OCR-related patterns
- Multimodal mismatch analysis (tweet clean vs image toxic cases)

---
Built for end-to-end EDA presentation and model-planning readiness.