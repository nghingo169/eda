# 🌌 Advanced Data Intelligence Platform (EDA)

An interactive, high-performance web platform dedicated to deep Exploratory Data Analysis (EDA). This project bridges the gap between raw data and actionable Machine Learning strategies by visualizing complex patterns through a highly engaging, responsive user interface.

Currently, the platform hosts two distinct, comprehensive data analysis dashboards:
1. **Spotify Top Songs 2023** (Tabular Audio Features)
2. **MMHS150K Hate Speech Analyzer** (Multimodal: Text, Image & OCR)

---

## ✨ Key Features

* **Dual-Theme Dashboards:** Tailored user interfaces for different data types. A sleek, vibrant aesthetic for Spotify data, and a familiar, feed-based "Twitter" layout for social media hate speech analysis.
* **Interactive Visualizations:** Powered by `Plotly.js`, featuring interactive histograms, t-SNE/UMAP projections, correlation matrices, and radar charts.
* **Integrated Code Viewer:** Dedicated modals displaying the underlying Python implementation (using `PrismJS` syntax highlighting) for every chart and analysis step.
* **Insight Synthesis:** "Key Insight" cards summarize the statistical findings into actionable intelligence for downstream Machine Learning pipelines.
* **Smooth Animations:** Page transitions and component reveal animations powered by `Framer Motion`.

---

## 📊 The Dashboards

### 1. Spotify Trends (Tabular Data)
Explores the "Top Spotify Songs 2023" dataset, focusing on audio characteristics, platform presence, and factors that contribute to a track becoming a "Mega Hit".
* **Dataset:** 952 cleaned tracks, 24 features (Numerical & Categorical).
* **Key Finding:** Playlist presence (Spotify & Apple) is the ultimate gatekeeper, boasting a ~0.79 correlation with total streams—dwarfing individual audio features.
* **Sonic Mood:** 2023 hits lean towards high-energy and high-danceability, with acousticness at an all-time low. 

### 2. MMHS150K Analyzer (Multimodal Data)
A deep dive into a manually annotated multimodal hate speech dataset of 150,000 tweets (text + images).
* **Dataset:** 149,823 samples across 6 hate categories (NotHate, Racist, Sexist, Homophobe, Religion, OtherHate).
* **Key Finding (The Meme Effect):** Over 40% of hate speech images contain embedded text (OCR), compared to <20% for neutral tweets. OCR is a primary vehicle for hate speech on Twitter.
* **Structural Challenge:** Severe class imbalance (NotHate dominates at 82.77%) and high inter-annotator disagreement in minority classes highlight the subjective nature of hate speech detection.

---

## 🛠️ Tech Stack

* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite 6
* **Styling:** Tailwind CSS v4 + `clsx` / `tailwind-merge`
* **Data Visualization:** Plotly.js (`react-plotly.js`)
* **Animations:** Framer Motion
* **Icons & Typography:** Lucide React, PrismJS, Google Fonts (Inter & Libre Baskerville)

---

## 📂 Project Structure

P4AIDS-FULL_PAGE/
├── public/                    # Static assets and Plotly HTML exports
├── src/                       
│   ├── lib/                   
│   │   └── utils.ts           # Tailwind class merging utility (cn)
│   ├── pages/                 
│   │   ├── 1_spotify/         # Spotify Analysis Module
│   │   │   ├── data/          # Spotify JSON datasets
│   │   │   └── SpotifyEDA.tsx # Spotify Dashboard Component
│   │   └── 2_hate/            # MMHS150K Analysis Module
│   │       ├── Hate.tsx       # Twitter-themed Dashboard Component
│   │       └── PlotlyEmbed.tsx# Wrapper for Plotly HTML embeds
│   ├── App.tsx                # Main router and view controller
│   ├── Home.tsx               # Landing page component
│   ├── index.css              # Global styles & PrismJS themes
│   └── main.tsx               # React entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration

---

## 💻 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm, yarn, or pnpm

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/advanced-eda-platform.git
   cd advanced-eda-platform
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and navigate to the local host address provided in your terminal (usually `http://localhost:3000` or `http://localhost:5173`).

---

## 📝 Future Work (Machine Learning Phase)
Based on the concrete recommendations derived from this EDA, the next phase of this project will focus on:
* **Multimodal Fusion:** Developing a Late-Fusion architecture combining BERT (text) and ResNet50 (image) for the MMHS150K dataset.
* **Handling Imbalance:** Implementing Class-Weighted Cross-Entropy loss.
* **Feature Engineering:** Integrating EasyOCR to extract text-in-image features directly into the modeling pipeline.

---
*Designed and built for advanced exploratory data analysis and research.*