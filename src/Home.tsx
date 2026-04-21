import React from 'react';
import { motion } from 'motion/react';
import {
  Music,
  ArrowRight,
  Activity,
  ShieldCheck,
  Brain,
} from 'lucide-react';
import type { View } from './App';

interface HomeProps {
  onSelect: (view: View) => void;
}

export default function Home({ onSelect }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 backdrop-blur-md">
            <Activity size={12} />
            <span>Data Intelligence Dashboards</span>
          </div>

          <h1 className="mb-8 bg-linear-to-b from-white via-white to-white/20 bg-clip-text text-7xl font-bold leading-[0.9] tracking-tighter text-transparent md:text-9xl">
            Team <br /> Jollibee.
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 md:text-xl">
            Explore patterns in real-world datasets, from global music trends to multimodal online hate signals.
          </p>

          {/* Members */}
          <section className="px-2 pb-8 pt-0">
            <div className="mx-auto max-w-3xl text-center">
              <div className="rounded-3xl border border-white/10 bg-zinc-900/35 p-6 backdrop-blur-xl">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/45 p-7 text-center backdrop-blur-md">
                    <div className="hate-eda-title mb-1 text-lg font-extrabold tracking-tight md:text-xl">
                      Ngô Tiểu Nghi
                    </div>
                    <div className="mb-1 text-sm font-medium text-zinc-400">
                      Student ID: 2352799
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/45 p-7 text-center backdrop-blur-md">
                    <div className="hate-eda-title mb-1 text-lg font-extrabold tracking-tight md:text-xl">
                      Trần Anh Tuấn
                    </div>
                    <div className="text-sm font-medium text-zinc-400">
                      Student ID: 2353276
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Main Selection Cards */}
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Spotify Column */}
          <div className="flex flex-col gap-4">
            {/* Spotify EDA Card */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/30 p-8 text-left backdrop-blur-2xl transition-all hover:border-emerald-500/30"
              onMouseEnter={() => {
                void import('./pages/1_spotify/SpotifyEDA');
              }}
              onClick={() => onSelect('spotify')}
            >
              <div className="absolute right-0 top-0 p-8 opacity-[0.03] transition-opacity group-hover:opacity-[0.07]">
                <Music size={200} />
              </div>
              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 transition-all duration-500 group-hover:bg-emerald-500 group-hover:text-black">
                    <Music size={28} />
                  </div>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                    Tabular Data
                  </span>
                </div>
                <h3 className="mb-4 text-3xl font-bold transition-colors group-hover:text-emerald-400 [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                  <span className="block">Most Streamed Spotify</span>
                  Songs 2023
                </h3>
                <p className="mb-8 text-sm leading-relaxed text-zinc-500">
                  Analyze audio features, track popularity, and artist impact in the Spotify Top Songs dataset.
                </p>
                <ul className="mb-10 space-y-3">
                  {['Audio Feature Profiling', 'Genre Popularity Heatmaps', 'Artist Growth Metrics'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-zinc-400">
                      <div className="h-1 w-1 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-sm font-bold text-white [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                  Explore Dashboard <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-2" />
                </div>
              </div>
            </motion.div>

            {/* Spotify ML Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-500/10 bg-zinc-900/20 p-6 text-left backdrop-blur-2xl transition-all hover:border-emerald-500/30"
              onMouseEnter={() => {
                void import('./pages/1_spotify/SpotifyML');
              }}
              onClick={() => onSelect('spotify-ml')}
            >
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-all duration-500 group-hover:bg-emerald-500 group-hover:text-black">
                  <Brain size={22} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-xl font-bold transition-colors group-hover:text-emerald-400 [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                      Spotify ML
                    </h4>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      ML
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    View machine learning results, model comparison, evaluation metrics, and prediction insights for the Spotify dataset.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-bold text-white">
                    Open ML Page <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hate Column */}
          <div className="flex flex-col gap-4">
            {/* Hate EDA Card */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/30 p-8 text-left backdrop-blur-2xl transition-all hover:border-blue-500/30"
              onMouseEnter={() => {
                void import('./pages/2_hate/Hate');
                void import('react-plotly.js');
              }}
              onClick={() => onSelect('hate')}
            >
              <div className="absolute right-0 top-0 p-8 opacity-[0.03] transition-opacity group-hover:opacity-[0.07]">
                <ShieldCheck size={200} />
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 transition-all duration-500 group-hover:bg-blue-500 group-hover:text-black">
                    <ShieldCheck size={28} />
                  </div>
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                    Multimodal Data
                  </span>
                </div>

                <h3 className="mb-4 text-3xl font-bold transition-colors group-hover:text-blue-400 [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                  Multimodal Hate Speech
                </h3>

                <p className="mb-8 text-sm leading-relaxed text-zinc-500">
                  Detect and analyze harmful content by combining textual and visual signals from social media posts, enabling deeper understanding of online toxicity patterns.
                </p>

                <ul className="mb-10 space-y-3">
                  {[
                    'Text & Image Fusion Analysis',
                    'Hate vs Non-hate Classification',
                    'Toxicity Pattern Exploration',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-zinc-400">
                      <div className="h-1 w-1 rounded-full bg-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-sm font-bold text-white [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                  Explore Dashboard <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-2" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>
    </div>
  );
}