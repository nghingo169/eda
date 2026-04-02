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
  onSelect: (view: 'spotify') => void;
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
            <span>Advanced Data Intelligence Platform</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-linear-to-b from-white via-white to-white/20 bg-clip-text text-transparent leading-[0.9]">
            The Art of <br /> Discovery.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            Uncover hidden narratives within massive datasets. From the rhythmic structures of global music to the infinite expansion of human knowledge.
          </p>

          {/* Main Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Spotify Card */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative p-10 rounded-4xl border border-white/5 bg-zinc-900/30 backdrop-blur-2xl transition-all hover:border-emerald-500/30 text-left overflow-hidden cursor-pointer"
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
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                    Tabular Data
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">Spotify Trends</h3>
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                  Deep analysis of structured audio features, track popularity, and artist performance metrics across millions of records.
                </p>
                <ul className="space-y-3 mb-10">
                  {['Audio Feature Profiling', 'Genre Popularity Heatmaps', 'Artist Growth Metrics'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-zinc-400">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  Explore Dashboard <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>            
          </div>
        </motion.div>
      </header>

      {/* Techniques Grid */}
      <section className="py-32 px-6 border-t border-white/5 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Core EDA Techniques</h2>
              <p className="text-zinc-500 text-lg">Our platform utilizes industry-standard methodologies to extract meaningful insights from raw data.</p>
            </div>
            <div className="flex gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Verified</div>
                  <div className="text-sm font-bold">Data Integrity</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Univariate Analysis', icon: Cpu, desc: 'Detailed examination of single-variable distributions and statistical properties.' },
              { title: 'Bivariate Correlation', icon: Zap, desc: 'Mapping relationships and dependencies between multiple data dimensions.' },
              { title: 'Multivariate Modeling', icon: Layers, desc: 'Complex interaction analysis across high-dimensional feature spaces.' },
              { title: 'Tabular Structuring', icon: Table, desc: 'Optimizing row-column data for rapid statistical computation.' },
              { title: 'NLP Processing', icon: FileText, desc: 'Advanced text mining and semantic analysis for unstructured content.' },
              { title: 'Real-time Monitoring', icon: LayoutDashboard, desc: 'Continuous data stream visualization and anomaly detection.' },
            ].map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/40 transition-colors group"
              >
                <tech.icon className="text-zinc-500 group-hover:text-white transition-colors mb-6" size={32} />
                <h4 className="text-xl font-bold mb-3">{tech.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Total Records', value: '2.4M+', icon: Database },
            { label: 'Data Points', value: '150M+', icon: BarChart3 },
            { label: 'Global Reach', value: '190+', icon: Globe },
            { label: 'Sync Rate', value: '99.9%', icon: Search },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <stat.icon size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <div className="text-4xl font-bold mb-2 tracking-tight">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <BarChart3 className="text-emerald-400" size={24} />
            <span className="text-xl font-bold tracking-tighter">DATA EXPLORER</span>
          </div>
          <p className="text-zinc-600 text-sm max-w-md mx-auto mb-12">
            A specialized platform for deep exploratory data analysis. Built for researchers, data scientists, and curious minds.
          </p>
          <div className="flex justify-center gap-8 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">API Reference</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
          <div className="mt-12 pt-12 border-t border-white/5 text-zinc-700 text-[10px] uppercase tracking-widest">
            &copy; 2026 AI Learning Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
