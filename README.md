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
├── package.json
└── README.md
```

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📊 Key Features

## 🔧 Tech Stack
- **React + Vite** (frontend)
- **Plotly.js** (interactive charts)  
- **Tailwind CSS** (styling)
- **Python/Jupyter** (data source)

**Built for data exploration & visualization! 🎧**
