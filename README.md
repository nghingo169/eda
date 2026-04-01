# Data EDA Dashboard - Spotify & Wikipedia Analysis

Interactive Exploratory Data Analysis visualizations for Spotify Top Songs 2023 and Wikipedia datasets.

## 📁 Project Structure

```
data-eda/
├── src/
│   ├── pages/
│   │   ├── 1_spotify/           # Spotify Top Songs 2023 EDA
│   │   │   ├── SpotifyEDA.tsx   # Interactive React + Plotly dashboard
│   │   │   └── data/
│   │   │       ├── eda_spotify (4) (1).ipynb  # Source of truth (Python)
│   │   │       ├── eda_spotify_tracks.json    # EDA metadata
│   │   │       └── full_report_2023.txt       # Exported analysis
│   │   └── 2_wikipedia/         # Wikipedia EDA 
│   │       ├── WikipediaEDA.tsx
│   │       └── data/eda_data.json
│   ├── App.tsx
│   └── Home.tsx
├── TODO.md                      # Fix tracking (completed)
├── package.json
└── README.md
```

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📊 Key Features Fixed

✅ **Spotify Data Perfect Sync** (ipynb → TSX):
- Hit Predictors: `[0.00,-0.03,-0.06,-0.02,+0.61,+0.68]`
- 952 tracks, 24 features exact
- Correlation heatmaps corrected

## 🔧 Tech Stack
- **React + Vite** (frontend)
- **Plotly.js** (interactive charts)  
- **Tailwind CSS** (styling)
- **Python/Jupyter** (data source)

## 📈 Analysis Highlights
- **Playlist Power**: r=0.79 correlation with streams
- **Friday Phenomenon**: 526/952 tracks (55%)
- **Superstar Effect**: Top 10 artists = 19.2% streams

**Built for data exploration & visualization! 🎧**
