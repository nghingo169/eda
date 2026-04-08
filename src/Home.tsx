import React from 'react';
import { motion } from 'motion/react';
import { 
  Music, 
  Globe, 
  BarChart3, 
  ArrowRight, 
  Database, 
  Search, 
  Cpu, 
  Zap, 
  Layers, 
  Table, 
  FileText, 
  Activity,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

interface HomeProps {
  onSelect: (view: 'spotify' | 'hate') => void;
}

export default function Home({ onSelect }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md text-emerald-400">
            <Activity size={12} />
            <span>Data Intelligence Dashboards</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-linear-to-b from-white via-white to-white/20 bg-clip-text text-transparent leading-[0.9]">
            Team <br /> Jollibee.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Explore patterns in real-world datasets, from global music trends to multimodal online hate signals.
          </p>
          {/* Members */}
          <section className="px-2 pt-0 pb-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Group Card */}
            <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/35 backdrop-blur-xl">
              {/* Members */}
              <div className="grid md:grid-cols-2 gap-6">
          
                {/* Member 1 */}
                <div className="p-7 rounded-2xl bg-black/45 border border-white/10 backdrop-blur-md text-center">
                  <div className="hate-eda-title text-lg md:text-xl font-extrabold tracking-tight mb-1">
                    Ngô Tiểu Nghi
                  </div>
                  <div className="text-sm font-medium text-zinc-400 mb-1">
                    Student ID: 2352799
                  </div>
                </div>

                {/* Member 2 */}
                <div className="p-7 rounded-2xl bg-black/45 border border-white/10 backdrop-blur-md text-center">
                  <div className="hate-eda-title text-lg md:text-xl font-extrabold tracking-tight mb-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Spotify Card */}
          <motion.div
            whileHover={{ y: -8 }}
            className="group relative p-8 rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-2xl transition-all hover:border-emerald-500/30 text-left overflow-hidden cursor-pointer"
            onMouseEnter={() => {
              void import('./pages/1_spotify/SpotifyEDA');
            }}
            onClick={() => onSelect('spotify')}
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Music size={200} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                  <Music size={28} />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                  Tabular Data
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4 group-hover:text-emerald-400 transition-colors [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                <span className="block">Most Streamed Spotify</span>
                Songs 2023
              </h3>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                Analyze audio features, track popularity, and artist impact in the Spotify Top Songs dataset.
              </p>
              <ul className="space-y-3 mb-10">
                {['Audio Feature Profiling', 'Genre Popularity Heatmaps', 'Artist Growth Metrics'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-white font-bold text-sm [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                Explore Dashboard <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
              </div>
            </div>
          </motion.div>   

          <motion.div
            whileHover={{ y: -8 }}
            className="group relative p-8 rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-2xl transition-all hover:border-blue-500/30 text-left overflow-hidden cursor-pointer"
            onMouseEnter={() => {
              void import('./pages/2_hate/Hate');
              void import('react-plotly.js');
            }}
            onClick={() => onSelect('hate')}
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <ShieldCheck size={200} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-black transition-all duration-500">
                  <ShieldCheck size={28} />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20 [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                  Multimodal Data
                </span>
              </div>

              <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                Multimodal Hate Speech
              </h3>

              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                Detect and analyze harmful content by combining textual and visual signals from social media posts, enabling deeper understanding of online toxicity patterns.
              </p>

              <ul className="space-y-3 mb-10">
                {[
                  'Text & Image Fusion Analysis',
                  'Hate vs Non-hate Classification',
                  'Toxicity Pattern Exploration'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-white font-bold text-sm [font-family:Montserrat,ui-sans-serif,system-ui,sans-serif]">
                Explore Dashboard <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
              </div>
            </div>
          </motion.div>         
        </div>
      </header>
    </div>
  );
}
