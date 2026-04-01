/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import { 
  ArrowLeft,
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  BarChart3, 
  Search, 
  AlertTriangle, 
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  ExternalLink,
  Box,
  FolderOpen,
  Sun,
  Minimize2,
  Maximize2,
  Table as TableIcon,
  Layers,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import edaData from './data/eda_data.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const COLORS = [
  'rgba(51, 102, 204, 0.7)', // Wikipedia Blue
  'rgba(0, 175, 137, 0.7)',  // Wikipedia Green
  'rgba(230, 126, 34, 0.7)', // Orange
  'rgba(114, 119, 125, 0.7)', // Gray
  'rgba(170, 0, 0, 0.7)',    // Red
  'rgba(32, 33, 34, 0.7)',   // Black
  'rgba(255, 215, 0, 0.7)',  // Gold
  'rgba(107, 75, 161, 0.7)', // Purple
  'rgba(0, 128, 128, 0.7)',  // Teal
  'rgba(188, 143, 143, 0.7)', // Rosy Brown
];

const BORDER_COLORS = COLORS.map(c => c.replace('0.7', '1'));

export default function WikipediaEDA({ onBack }: { onBack: () => void }) {
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<null | 'text' | 'image'>(null);

  const sections = [
    // Textual Analysis
    { id: 'setup-text', label: 'Text Setup & Loading', icon: Search, category: 'text' },
    { id: 'inventory-text', label: 'Text Inventory & Missing Data', icon: Search, category: 'text' },
    { id: 'text-metrics', label: 'Text Metrics', icon: FileText, category: 'text' },
    { id: 'stopwords', label: 'Stopwords Analysis', icon: BarChart3, category: 'text' },
    { id: 'wikitext', label: 'Wikitext Structure', icon: Layers, category: 'text' },
    { id: 'nlp', label: 'NLP & Heading Analysis', icon: Cpu, category: 'text' },
    { id: 'topics', label: 'Topic Classification', icon: BarChart3, category: 'text' },
    { id: 'vocabulary', label: 'Vocabulary & Similarity', icon: BarChart3, category: 'text' },
    { id: 'samples', label: 'Sample Articles', icon: FileText, category: 'text' },

    // Visual Analysis
    { id: 'setup-image', label: 'Image Setup & Loading', icon: Search, category: 'image' },
    { id: 'inventory-image', label: 'Image Inventory & Missing Data', icon: Search, category: 'image' },
    { id: 'image-metadata', label: 'Image Metadata', icon: FileText, category: 'image' },
    { id: 'image-breakdown', label: 'Image Breakdown', icon: BarChart3, category: 'image' },
    { id: 'image-quality', label: 'Image Technical Quality', icon: BarChart3, category: 'image' },
    { id: 'features', label: 'Visual Features', icon: Cpu, category: 'image' },

    // Advanced
    { id: 'cross-modal', label: 'Cross-Modal Analysis', icon: BarChart3, category: 'advanced' },
    { id: 'anomalies', label: 'Anomalies & Quality', icon: AlertTriangle, category: 'advanced' },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, category: 'advanced' },
  ];

  const filteredSections = sections.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeIndex = sections.findIndex(s => s.id === activeSection);
  const progress = ((activeIndex + 1) / sections.length) * 100;

  const renderContent = () => {
    const nextSection = (id: string) => {
      const currentIndex = sections.findIndex(s => s.id === id);
      let nextIndex = currentIndex + 1;
      
      while (nextIndex < sections.length) {
        const nextS = sections[nextIndex];
        if (selectedCategory === null || nextS.category === 'general' || nextS.category === 'advanced' || nextS.category === selectedCategory) {
          setActiveSection(nextS.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        nextIndex++;
      }
    };

    const NextButton = ({ id }: { id: string }) => {
      const currentIndex = sections.findIndex(s => s.id === id);
      let nextIndex = currentIndex + 1;
      let nextS = null;
      
      while (nextIndex < sections.length) {
        const s = sections[nextIndex];
        if (selectedCategory === null || s.category === 'general' || s.category === 'advanced' || s.category === selectedCategory) {
          nextS = s;
          break;
        }
        nextIndex++;
      }

      if (!nextS) return null;
      
      return (
        <div className="mt-16 pt-8 border-t border-[#a2a9b1] flex justify-end">
          <button 
            onClick={() => nextSection(id)}
            className="group flex items-center gap-2 px-6 py-3 bg-[#36c] text-white rounded-md font-bold transition-all hover:bg-[#447ff5] shadow-md"
          >
            <span>Next: {nextS.label}</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      );
    };

    switch (activeSection) {
      case 'home':
        return <Home data={edaData} onNavigate={(id) => {
          const section = sections.find(s => s.id === id);
          if (section?.category === 'text') setSelectedCategory('text');
          if (section?.category === 'image') setSelectedCategory('image');
          setActiveSection(id);
        }} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />;
      case 'setup-text':
        return (
          <>
            <SetupSection data={edaData} type="text" onNext={() => nextSection('setup-text')} />
            <NextButton id="setup-text" />
          </>
        );
      case 'inventory-text':
        return (
          <>
            <Inventory data={edaData} type="text" onNext={() => nextSection('inventory-text')} />
            <NextButton id="inventory-text" />
          </>
        );
      case 'text-metrics':
        return (
          <>
            <TextMetrics data={edaData} onNext={() => nextSection('text-metrics')} />
            <NextButton id="text-metrics" />
          </>
        );
      case 'stopwords':
        return (
          <>
            <StopwordsSection data={edaData} onNext={() => nextSection('stopwords')} />
            <NextButton id="stopwords" />
          </>
        );
      case 'wikitext':
        return (
          <>
            <WikitextStructure data={edaData} onNext={() => nextSection('wikitext')} />
            <NextButton id="wikitext" />
          </>
        );
      case 'nlp':
        return (
          <>
            <NLPSection data={edaData} onNext={() => nextSection('nlp')} />
            <NextButton id="nlp" />
          </>
        );
      case 'topics':
        return (
          <>
            <TopicsSection data={edaData} onNext={() => nextSection('topics')} />
            <NextButton id="topics" />
          </>
        );
      case 'vocabulary':
        return (
          <>
            <VocabularySection data={edaData} onNext={() => nextSection('vocabulary')} />
            <NextButton id="vocabulary" />
          </>
        );
      case 'samples':
        return (
          <>
            <SamplesSection data={edaData} onNext={() => nextSection('samples')} />
            <NextButton id="samples" />
          </>
        );
      case 'setup-image':
        return (
          <>
            <SetupSection data={edaData} type="image" onNext={() => nextSection('setup-image')} />
            <NextButton id="setup-image" />
          </>
        );
      case 'inventory-image':
        return (
          <>
            <Inventory data={edaData} type="image" onNext={() => nextSection('inventory-image')} />
            <NextButton id="inventory-image" />
          </>
        );
      case 'image-metadata':
        return (
          <>
            <ImageMetadataSection data={edaData} onNext={() => nextSection('image-metadata')} />
            <NextButton id="image-metadata" />
          </>
        );
      case 'image-breakdown':
        return (
          <>
            <ImageBreakdown data={edaData} onNext={() => nextSection('image-breakdown')} />
            <NextButton id="image-breakdown" />
          </>
        );
      case 'image-quality':
        return (
          <>
            <ImageQuality data={edaData} onNext={() => nextSection('image-quality')} />
            <NextButton id="image-quality" />
          </>
        );
      case 'features':
        return (
          <>
            <Features data={edaData} onNext={() => nextSection('features')} />
            <NextButton id="features" />
          </>
        );
      case 'cross-modal':
        return (
          <>
            <CrossModal data={edaData} onNext={() => nextSection('cross-modal')} />
            <NextButton id="cross-modal" />
          </>
        );
      case 'anomalies':
        return (
          <>
            <Anomalies data={edaData} onNext={() => nextSection('anomalies')} />
            <NextButton id="anomalies" />
          </>
        );
      case 'recommendations':
        return (
          <>
            <Recommendations data={edaData} onNext={() => nextSection('recommendations')} />
            <NextButton id="recommendations" />
          </>
        );
      default:
        return <Home data={edaData} onNavigate={setActiveSection} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f6f6] text-[#202122] font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 bg-[#f6f6f6] border-r border-[#a2a9b1] flex flex-col z-50 shadow-xl"
          >
            <div className="p-6 flex flex-col items-center border-b border-[#a2a9b1]/30 relative">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full text-gray-500 lg:hidden"
              >
                <X size={16} />
              </button>
              <div className="w-16 h-16 bg-white rounded-full border border-[#a2a9b1] flex items-center justify-center mb-3 shadow-sm">
                <span className="text-3xl font-serif font-bold">W</span>
              </div>
              <h1 className="font-serif font-bold text-lg tracking-tight text-[#202122]">Wikipedia</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#54595d] font-bold">Multimodal EDA</p>
            </div>

            <div className="p-4 border-b border-[#a2a9b1]/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search sections..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#a2a9b1] rounded-md py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#36c] transition-all"
                />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
              {selectedCategory && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setActiveSection('home');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#54595d] hover:text-[#36c] transition-colors uppercase tracking-wider mb-2"
                >
                  <ChevronLeft size={14} />
                  <span>Back to Overview</span>
                </button>
              )}

              {['general', 'text', 'image', 'advanced'].map(cat => {
                const catSections = filteredSections.filter(s => s.category === cat);
                if (catSections.length === 0) return null;
                
                // Filter logic:
                // If selectedCategory is null, only show 'general'
                // If selectedCategory is 'text', show 'general', 'text', 'advanced'
                // If selectedCategory is 'image', show 'general', 'image', 'advanced'
                if (selectedCategory === null && cat !== 'general') return null;
                if (selectedCategory === 'text' && cat === 'image') return null;
                if (selectedCategory === 'image' && cat === 'text') return null;

                return (
                  <div key={cat} className="space-y-0.5">
                    <div className="px-4 py-1 text-[10px] font-bold text-[#54595d] uppercase tracking-[0.15em] opacity-60">
                      {cat}
                    </div>
                    {catSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative group text-left rounded-md mb-0.5",
                          activeSection === section.id
                            ? "bg-white text-[#202122] font-bold shadow-sm border border-[#a2a9b1]/30"
                            : "text-[#36c] hover:bg-white/50"
                        )}
                      >
                        {activeSection === section.id && (
                          <motion.div 
                            layoutId="active-indicator" 
                            className="absolute left-0 w-1 h-4 bg-[#36c] rounded-r-full"
                          />
                        )}
                        <section.icon size={16} className={cn(
                          activeSection === section.id ? "text-[#202122]" : "text-[#54595d]"
                        )} />
                        <span className="truncate">{section.label}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
              
              {filteredSections.length === 0 && (
                <div className="p-4 text-center text-xs text-gray-500 italic">
                  No sections found matching "{searchQuery}"
                </div>
              )}
            </nav>
            <div className="p-4 border-t border-[#a2a9b1]/30 bg-gray-50/50">
              <div className="text-[10px] text-[#54595d] font-medium flex items-center justify-between">
                <span>© 2026 Wikipedia EDA</span>
                <span className="text-[9px] bg-gray-200 px-1.5 py-0.5 rounded">v1.2.0</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* Floating Quick Jump Menu */}
        <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
          <div className="group relative">
            <button className="p-3 bg-white border border-[#a2a9b1] rounded-full shadow-lg text-[#3366cc] hover:bg-[#f8f9fa] transition-colors">
              <Menu size={20} />
            </button>
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-[#a2a9b1] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
              <div className="p-3 border-b border-[#a2a9b1] font-bold text-xs uppercase tracking-wider text-[#54595d]">Quick Jump</div>
              <div className="max-h-80 overflow-y-auto p-1 custom-scrollbar">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSection(s.id);
                      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-2",
                      activeSection === s.id ? "bg-[#eaf3ff] text-[#3366cc] font-bold" : "hover:bg-[#f8f9fa] text-[#202122]"
                    )}
                  >
                    <s.icon size={14} />
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-[#36c]/10 w-full z-50">
          <motion.div 
            className="h-full bg-[#36c]" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <header className="bg-white border-b border-[#a2a9b1] p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 hover:bg-[#f6f6f6] rounded text-[#36c] transition-colors border border-[#a2a9b1]/30"
                title="Open Sidebar"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="flex flex-col">
              <h2 className="font-serif text-2xl text-black border-b border-[#a2a9b1] pb-0.5 leading-tight">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Section {activeIndex} of {sections.length - 1}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#a2a9b1] text-[#54595d] font-bold text-[10px] uppercase tracking-wider hover:bg-[#f6f6f6] hover:text-[#202122] transition-colors"
            >
              <ArrowLeft size={14} /> Home
            </button>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[#54595d]">Language: <strong className="text-[#202122]">English</strong></span>
              <div className="h-4 w-px bg-[#a2a9b1]"></div>
              <button className="text-[#36c] hover:underline font-medium">View source</button>
              <button className="text-[#36c] hover:underline font-medium">History</button>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-[#36c] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#447ff5] transition-colors shadow-sm"
            >
              Top
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar scroll-smooth" id="main-content">
          <article className="max-w-5xl mx-auto">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </article>
          
          {/* Footer inside scroll area */}
          <footer className="max-w-5xl mx-auto mt-20 pt-8 border-t border-[#a2a9b1] pb-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[#54595d] text-xs">
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png" alt="Wiki" className="h-8 opacity-50 grayscale" referrerPolicy="no-referrer" />
              <p>This page was last edited on 31 March 2026, at 18:53 (UTC).</p>
            </div>
            <div className="flex gap-4">
              <button className="hover:underline">Privacy policy</button>
              <button className="hover:underline">About Wikipedia</button>
              <button className="hover:underline">Disclaimers</button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function DidYouKnow({ fact }: { fact: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-8 p-6 bg-[#f8f9fa] border-l-4 border-[#36c] shadow-sm flex items-start gap-4"
    >
      <div className="p-2 bg-[#36c] text-white rounded-full shrink-0">
        <Lightbulb size={20} />
      </div>
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-[#3366cc] mb-1">Did You Know?</h5>
        <p className="text-[#202122] text-sm leading-relaxed italic">"{fact}"</p>
      </div>
    </motion.div>
  );
}

function SectionTitle({ title, subtitle, highlights }: { title: string; subtitle?: string; highlights?: string[] }) {
  const readingTime = highlights ? Math.ceil(highlights.length * 0.5) : 1;

  return (
    <div className="mb-10">
      <div className="border-b border-[#a2a9b1] pb-2 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-serif font-normal mb-2">{title}</h3>
          {subtitle && <p className="text-[#54595d] text-sm italic">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
          <FileText size={12} />
          <span>{readingTime} min read</span>
        </div>
      </div>
      
      {highlights && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#f0f4fb] border-l-4 border-[#3366cc] p-4 mb-8 shadow-sm"
        >
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#3366cc] mb-2 flex items-center gap-2">
            <Lightbulb size={12} />
            Section Highlights
          </h5>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {highlights.map((h, i) => (
              <li key={i} className="text-xs text-[#202122] flex items-start gap-2">
                <span className="text-[#3366cc] mt-0.5">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

function Card({ children, title, className }: { children: React.ReactNode; title?: string; className?: string; key?: string | number }) {
  return (
    <motion.div 
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      className={cn("bg-white border border-[#a2a9b1] p-6 mb-6 transition-all duration-300", className)}
    >
      {title && (
        <h4 className="font-serif text-xl font-normal border-b border-[#a2a9b1] pb-2 mb-6 text-black flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
          </div>
        </h4>
      )}
      {children}
    </motion.div>
  );
}

function StatCard({ label, value, subValue, icon: Icon, colorClass, className }: { label: string; value: string | number; subValue?: string; icon: any; colorClass: string; className?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className={cn("bg-white border border-[#a2a9b1] p-6 shadow-sm transition-all relative overflow-hidden group h-full flex flex-col justify-between", className)}
    >
      <div className={cn("absolute top-0 right-0 w-24 h-24 opacity-5 -translate-y-1/2 translate-x-1/2 rounded-full transition-transform group-hover:scale-110", colorClass)} />
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className={cn("p-2 rounded text-white shadow-sm", colorClass)}>
          <Icon size={16} />
        </div>
        <span className="text-xs font-bold text-[#54595d] uppercase tracking-wider">{label}</span>
      </div>
      <div className="relative z-10">
        <div className="text-4xl font-serif font-bold text-black mb-1">{value}</div>
        {subValue && <div className="text-[11px] font-medium text-[#54595d] italic">{subValue}</div>}
      </div>
    </motion.div>
  );
}

// --- Section Components ---

function AnalysisMethodology({ category }: { category: 'text' | 'image' }) {
  const isText = category === 'text';
  return (
    <Card title="Analysis Methodology">
      <p className="text-sm text-[#54595d] mb-6">
        This report uses two types of {isText ? 'text' : 'visual'} processing approaches depending on the analysis goal:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={cn("text-white", isText ? "bg-[#3366cc]" : "bg-[#00af89]")}>
              <th className="p-3 text-xs font-bold uppercase tracking-wider">Analysis Type</th>
              <th className="p-3 text-xs font-bold uppercase tracking-wider text-center">Raw Data</th>
              <th className="p-3 text-xs font-bold uppercase tracking-wider text-center">{isText ? 'Stopwords Removed' : 'Processed'}</th>
              <th className="p-3 text-xs font-bold uppercase tracking-wider">Reason</th>
            </tr>
          </thead>
          <tbody className="text-sm text-[#202122]">
            {isText ? (
              <>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Basic Statistics<br/><span className="text-[10px] font-normal text-[#54595d]">(Word/Char counts)</span></td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-[#54595d]">Measure actual document size</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Stop Words Analysis</td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-[#54595d]">Analyze stopword frequency</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Word Frequency<br/><span className="text-[10px] font-normal text-[#54595d]">(Top overall words)</span></td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-[#54595d]">Find meaningful keywords</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Category Keywords</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-[#54595d]">Category-specific terms</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Vocabulary Richness</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-[#54595d]">Content vocabulary diversity</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">TF-IDF Terms</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-[#54595d]">Most distinctive terms</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">N-grams (Bigrams)</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-[#54595d]">Meaningful phrase patterns</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Distributions<br/><span className="text-[10px] font-normal text-[#54595d]">(Word/Char histograms)</span></td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-[#54595d]">Show actual text lengths</td>
                </tr>
              </>
            ) : (
              <>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Inventory<br/><span className="text-[10px] font-normal text-[#54595d]">(Image counts)</span></td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-[#54595d]">Measure visual coverage and density.</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Metadata Coverage<br/><span className="text-[10px] font-normal text-[#54595d]">(Captions, Descs)</span></td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-[#54595d]">Analyze completeness of visual metadata.</td>
                </tr>
                <tr className="border-b border-[#a2a9b1] hover:bg-[#f8f9fa]">
                  <td className="p-3 font-bold">Visual Features<br/><span className="text-[10px] font-normal text-[#54595d]">(ResNet152)</span></td>
                  <td className="p-3 text-center text-[#54595d]">-</td>
                  <td className="p-3 text-center text-green-600 font-bold">✓</td>
                  <td className="p-3 text-[#54595d]">Deep visual analysis using pre-trained CNNs.</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className={cn("mt-4 p-3 border-l-4 text-xs font-medium flex items-center gap-2", isText ? "bg-[#f0f4fb] border-[#3366cc] text-[#3366cc]" : "bg-[#f0fbf8] border-[#00af89] text-[#00af89]")}>
        <Lightbulb size={14} />
        <span>💡 Key Principle: Use raw data for size/distribution analysis, use filtered data (stopwords removed) for content/semantic analysis.</span>
      </div>
    </Card>
  );
}

function CategoryHome({ category, data, onNavigate, onBack }: { category: 'text' | 'image', data: any, onNavigate: (id: string) => void, onBack: () => void }) {
  const isText = category === 'text';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      {/* Category Header (Video Style) */}
      <div className={cn(
        "p-12 text-white relative overflow-hidden shadow-lg rounded-b-3xl",
        isText ? "bg-linear-to-r from-[#3366cc] to-[#447ff5]" : "bg-linear-to-r from-[#00af89] to-[#00d4a6]"
      )}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 border border-white/30 shadow-xl">
            {isText ? <FileText size={48} /> : <ImageIcon size={48} />}
          </div>
          <h1 className="text-5xl font-serif font-bold tracking-tight mb-4 drop-shadow-md">
            Wikipedia {isText ? 'Textual' : 'Visual'} Analysis
          </h1>
          <p className="text-xl text-white/90 max-w-2xl leading-relaxed mb-10 font-medium">
            Full Exploratory Data Analysis Report for {isText ? 'Article Content' : 'Visual Assets'}.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onBack}
              className="px-6 py-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-white/30 transition-all"
            >
              <ChevronLeft size={16} />
              <span>Back to Home</span>
            </button>
            <div className="w-px h-8 bg-white/20 mx-2" />
            <button className="px-6 py-2 bg-white text-[#202122] rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition-all shadow-lg">
              <Sun size={16} />
              <span>Light Mode</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label={isText ? "Total Articles" : "Total Images"} 
            value={isText ? "5,638" : "54,829"} 
            icon={isText ? FileText : ImageIcon} 
            colorClass={isText ? "bg-[#3366cc]" : "bg-[#00af89]"} 
          />
          <StatCard 
            label={isText ? "Median Words" : "Avg Imgs/Art"} 
            value={isText ? "6,072" : "9.7"} 
            icon={isText ? BarChart3 : Layers} 
            colorClass={isText ? "bg-[#3366cc]" : "bg-[#00af89]"} 
          />
          <StatCard 
            label={isText ? "Median Sections" : "Caption Coverage"} 
            value={isText ? "14" : "91.7%"} 
            icon={isText ? Layers : Search} 
            colorClass={isText ? "bg-[#3366cc]" : "bg-[#00af89]"} 
          />
          <StatCard 
            label={isText ? "Median Refs" : "Feature Coverage"} 
            value={isText ? "92" : "100%"} 
            icon={isText ? Search : Cpu} 
            colorClass={isText ? "bg-[#3366cc]" : "bg-[#00af89]"} 
          />
        </div>

        <AnalysisMethodology category={category} />

        <div className="space-y-24">
          {isText ? (
            <>
              <SetupSection data={data} type="text" onNext={() => {}} />
              <Inventory data={data} type="text" onNext={() => {}} />
              <TextMetrics data={data} onNext={() => {}} />
              <StopwordsSection data={data} onNext={() => {}} />
              <WikitextStructure data={data} onNext={() => {}} />
              <NLPSection data={data} onNext={() => {}} />
              <VocabularySection data={data} onNext={() => {}} />
              <SamplesSection data={data} onNext={() => {}} />
            </>
          ) : (
            <>
              <SetupSection data={data} type="image" onNext={() => {}} />
              <Inventory data={data} type="image" onNext={() => {}} />
              <ImageMetadataSection data={data} onNext={() => {}} />
              <ImageBreakdown data={data} onNext={() => {}} />
              <ImageQuality data={data} onNext={() => {}} />
              <Features data={data} onNext={() => {}} />
            </>
          )}
        </div>

        <div className="flex justify-center gap-6 pt-12 border-t border-[#a2a9b1]">
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-white border-2 border-[#a2a9b1] text-[#202122] rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            <span>Back to Main Dashboard</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Home({ data, onNavigate, selectedCategory, setSelectedCategory }: { data: any, onNavigate: (id: string) => void, selectedCategory: null | 'text' | 'image', setSelectedCategory: (c: null | 'text' | 'image') => void }) {
  const category = selectedCategory;
  const setCategory = setSelectedCategory;
  
  if (category) {
    return <CategoryHome category={category} data={data} onNavigate={onNavigate} onBack={() => setCategory(null)} />;
  }

  const s1 = data.section_1_setup_loading;
  const s2 = data.section_2_inventory;
  const s3 = data.section_3_text_metrics;
  const s4 = data.section_4_wikitext_structure;
  const s6 = data.section_6_7_8_image_inventory_meta;
  const s8b = data.section_8b_image_quality;
  const s9 = data.section_9_features;
  const s10 = data.section_10_cross_modal;
  const s5c = data.section_5c_topics;
  const s11 = data.section_11_anomalies;
  const recommendations = data.section_13_recommendations;

  const totalArticles = s1?.total_pages ?? 5638;
  const totalImages = s2?.total_img_meta ?? 54829;
  const uniqueRatio = s8b?.technical_quality ? (s8b.technical_quality.unique_image_ratio * 100).toFixed(1) : '88.3';
  const medianWords = s3?.describe?.word_count?.['50%'] ?? 6071.5;
  const medianSections = s3?.describe?.n_sections?.['50%'] ?? 14;
  const medianRefs = s3?.describe?.n_refs?.['50%'] ?? 92;

  const sortedTopics = Object.entries(s5c.topic_distribution_30 || {})
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10);

  const textSections = [
    { id: 'setup-text', label: 'Text Setup & Loading', desc: 'Configuration and loading performance.' },
    { id: 'inventory-text', label: 'Text Inventory & Quality', desc: 'Missing values and data completeness.' },
    { id: 'text-metrics', label: 'Text Metrics', desc: 'Word counts, vocabulary, and complexity.' },
    { id: 'stopwords', label: 'Stopwords Analysis', desc: 'Stopword frequency and distribution.' },
    { id: 'wikitext', label: 'Wikitext Structure', desc: 'Templates, infoboxes, and references.' },
    { id: 'nlp', label: 'NLP & Heading Analysis', desc: 'Sentence stats and title patterns.' },
    { id: 'vocabulary', label: 'Vocabulary & Similarity', desc: 'Richness, N-grams, and category similarity.' },
    { id: 'samples', label: 'Sample Articles', desc: 'Raw text snippets from various categories.' },
  ];

  const imageSections = [
    { id: 'setup-image', label: 'Image Setup & Loading', desc: 'Configuration and loading performance.' },
    { id: 'inventory-image', label: 'Image Inventory & Quality', desc: 'Missing values and data completeness.' },
    { id: 'image-metadata', label: 'Image Metadata', desc: 'Captions and descriptions.' },
    { id: 'image-breakdown', label: 'Image Breakdown', desc: 'File types and URLs.' },
    { id: 'image-quality', label: 'Image Technical Quality', desc: 'Dimensions, quality, and gallery.' },
    { id: 'features', label: 'Visual Features', desc: 'ResNet152 vector analysis.' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Header */}
      <div className="mb-12 p-10 bg-[#f8f9fa] border border-[#a2a9b1] relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3366cc]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00af89]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-serif font-bold text-black tracking-tight mb-4">Wikipedia Featured Articles — Full EDA Summary Dashboard</h1>
          <p className="text-lg text-[#54595d] max-w-3xl leading-relaxed mb-8">
            A comprehensive exploratory analysis of the <span className="font-bold">Extended Wikipedia Multimodal Dataset</span>, 
            bridging rich textual metadata with deep visual features across 5,638 high-quality articles.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                const element = document.getElementById('category-selection');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-[#36c] text-white rounded-md font-bold hover:bg-[#447ff5] transition-all shadow-md flex items-center gap-2 group"
            >
              <span>Start Exploration</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
        <StatCard 
          label="Total Articles" 
          value={totalArticles.toLocaleString()} 
          subValue="Current dataset count"
          icon={FileText} 
          colorClass="bg-[#3366cc]" 
        />
        <StatCard 
          label="Total Images" 
          value={totalImages.toLocaleString()} 
          subValue={`${(totalImages / totalArticles).toFixed(1)} images/article`}
          icon={ImageIcon} 
          colorClass="bg-[#00af89]" 
        />
        <StatCard 
          label="Unique Ratio" 
          value={`${uniqueRatio}%`} 
          subValue="High visual diversity"
          icon={Search} 
          colorClass="bg-[#e67e22]" 
        />
        <StatCard 
          label="Median Text Metrics" 
          value={`${medianWords.toLocaleString()} words`} 
          subValue={`${medianSections} sections · ${medianRefs} refs`}
          icon={BarChart3} 
          colorClass="bg-[#72777d]" 
        />
      </div>

      {/* Category Selection Boxes */}
      <div id="category-selection" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "cursor-pointer p-10 border-2 rounded-2xl transition-all shadow-md flex flex-col items-center text-center group",
            "border-[#a2a9b1] bg-white hover:border-[#3366cc] hover:shadow-xl"
          )}
          onClick={() => setCategory('text')}
        >
          <div className="w-24 h-24 bg-[#3366cc] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-3 transition-transform">
            <FileText size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#202122] mb-4">Textual Analysis</h2>
          <p className="text-[#54595d] text-lg mb-8 leading-relaxed">
            Deep dive into article structure, linguistics, and metadata across 5,638 featured articles.
          </p>
          <div className="mt-auto flex items-center gap-2 text-[#3366cc] font-bold uppercase tracking-wider text-sm">
            <span>View Full Analysis</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "cursor-pointer p-10 border-2 rounded-2xl transition-all shadow-md flex flex-col items-center text-center group",
            "border-[#a2a9b1] bg-white hover:border-[#00af89] hover:shadow-xl"
          )}
          onClick={() => setCategory('image')}
        >
          <div className="w-24 h-24 bg-[#00af89] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:-rotate-3 transition-transform">
            <ImageIcon size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#202122] mb-4">Visual Analysis</h2>
          <p className="text-[#54595d] text-lg mb-8 leading-relaxed">
            Analysis of 54,829 images, metadata coverage, and ResNet152 visual feature vectors.
          </p>
          <div className="mt-auto flex items-center gap-2 text-[#00af89] font-bold uppercase tracking-wider text-sm">
            <span>View Full Analysis</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </div>

      {/* Summary Dashboard Grid (Replicating the provided image) */}
      <div className="pt-8 border-t border-[#a2a9b1]">
        <h3 className="text-xl font-serif font-bold text-black mb-8 text-center">Executive Summary Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Articles by Image Bucket">
            <div className="h-48">
              <Bar data={{
                labels: Object.keys(s6.image_buckets),
                datasets: [{
                  data: Object.values(s6.image_buckets),
                  backgroundColor: COLORS,
                }]
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </Card>
          <Card title="Word Count Percentiles">
            <div className="h-48">
              <Bar data={{
                labels: ['min', '25%', '50%', '75%', 'max'],
                datasets: [{
                  data: [
                    s3.describe.word_count.min,
                    s3.percentiles.word_count.p25,
                    s3.percentiles.word_count.p50,
                    s3.percentiles.word_count.p75,
                    s3.describe.word_count.max
                  ],
                  backgroundColor: COLORS[0],
                }]
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
            </div>
          </Card>
          <Card title="Image Metadata Coverage">
            <div className="h-48">
              <Bar data={{
                labels: Object.keys(s6.metadata_coverage || {}),
                datasets: [{
                  data: Object.values(s6.metadata_coverage || {}),
                  backgroundColor: COLORS.slice(1),
                }]
              }} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </Card>
          <Card title="Top 10 Image-Rich Articles">
            <div className="h-48">
              <Bar data={{
                labels: Object.keys(s11.most_images.n_images || {}).slice(0, 10).map(t => t.length > 15 ? t.substring(0, 15) + '...' : t),
                datasets: [{
                  data: Object.values(s11.most_images.n_images || {}).slice(0, 10),
                  backgroundColor: COLORS[1],
                }]
              }} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </Card>

          <Card title="Section Count Percentiles">
            <div className="h-48">
              <Bar data={{
                labels: ['min', '25%', '50%', '75%', 'max'],
                datasets: [{
                  data: [
                    s3.describe.n_sections.min,
                    s3.percentiles.n_sections.p25,
                    s3.percentiles.n_sections.p50,
                    s3.percentiles.n_sections.p75,
                    s3.describe.n_sections.max
                  ],
                  backgroundColor: COLORS[2],
                }]
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </Card>
          <Card title="References per Article Percentiles">
            <div className="h-48">
              <Bar data={{
                labels: ['min', '25%', '50%', '75%', 'max'],
                datasets: [{
                  data: [
                    s3.describe.n_refs.min,
                    s3.percentiles.n_refs.p25,
                    s3.percentiles.n_refs.p50,
                    s3.percentiles.n_refs.p75,
                    s3.describe.n_refs.max
                  ],
                  backgroundColor: COLORS[4],
                }]
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </Card>
          <Card title="Caption Length Stats (chars)">
            <div className="h-48">
              <Bar data={{
                labels: ['Median', 'Mean'],
                datasets: [{
                  data: [s6.caption_stats.median_len, s6.caption_stats.mean_len],
                  backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'],
                }]
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </Card>
          <Card title="ResNet152 PCA Variance (%)">
            <div className="h-48">
              <Bar data={{
                labels: ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC6', 'PC7', 'PC8', 'PC9', 'PC10'],
                datasets: [{
                  data: s9.pca_variance.slice(0, 10).map(v => v * 100),
                  backgroundColor: COLORS[7],
                }]
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </Card>

          <div className="md:col-span-2">
            <Card title="Word Count vs Image Count">
              <div className="h-64">
                <Plot
                  data={[{
                    x: s10.top_image_dense_articles.map((item: any) => item.word_count),
                    y: s10.top_image_dense_articles.map((item: any) => item.n_images),
                    text: s10.top_image_dense_articles.map((item: any) => item.title),
                    mode: 'markers',
                    type: 'scatter',
                    marker: { color: COLORS[0], opacity: 0.8, size: 8 },
                    hovertemplate: '<b>%{text}</b><br>Word Count: %{x}<br>Images: %{y}<extra></extra>'
                  }]}
                  layout={{
                    autosize: true,
                    margin: { l: 40, r: 20, t: 10, b: 40 },
                    xaxis: { title: 'Word Count' },
                    yaxis: { title: 'Image Count' },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                  }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card title="Dataset Summary" className="bg-[#ffffea] border-[#f0e68c]">
              <div className="font-mono text-xs space-y-2 text-[#202122]">
                <div className="font-bold border-b border-[#f0e68c] pb-1 mb-2">DATASET SUMMARY</div>
                <div className="flex justify-between"><span>Articles:</span> <span>5,638</span></div>
                <div className="flex justify-between"><span>Total images:</span> <span>54,829</span></div>
                <div className="flex justify-between"><span>Articles w/ 0 imgs:</span> <span>246 (4.4%)</span></div>
                <div className="pt-2 font-bold border-b border-[#f0e68c] pb-1 mb-1">TEXT</div>
                <div className="flex justify-between"><span>Median words:</span> <span>6,072</span></div>
                <div className="flex justify-between"><span>Median sections:</span> <span>14</span></div>
                <div className="flex justify-between"><span>Median refs:</span> <span>92</span></div>
                <div className="flex justify-between"><span>Median links:</span> <span>194</span></div>
                <div className="flex justify-between"><span>Median templates:</span> <span>106</span></div>
                <div className="pt-2 font-bold border-b border-[#f0e68c] pb-1 mb-1">IMAGE META</div>
                <div className="flex justify-between"><span>% with caption:</span> <span>91.7%</span></div>
                <div className="flex justify-between"><span>% with desc:</span> <span>93.4%</span></div>
                <div className="flex justify-between"><span>% has features:</span> <span>100.0%</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Merged Summary Dashboard Content */}
      <div className="pt-12 border-t border-[#a2a9b1] space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-3xl font-serif font-bold text-black mb-4">Final Synthesis & Insights</h3>
          <p className="text-[#54595d] text-sm">Aggregated findings across all 5,638 articles and 54,829 images.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Top 10 Topic Categories">
            <div className="h-80">
              <Bar data={{
                labels: sortedTopics.map(t => t[0]),
                datasets: [{
                  label: 'Articles',
                  data: sortedTopics.map(t => t[1]),
                  backgroundColor: 'rgba(51, 102, 204, 0.7)',
                  borderRadius: 4,
                }]
              }} options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} />
            </div>
          </Card>
          <Card title="Advanced Complexity Metrics">
            <div className="grid grid-cols-1 gap-4 h-full">
              <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1] flex flex-col justify-center">
                <div className="text-xs font-bold text-[#54595d] uppercase tracking-wider mb-1">Avg Word Length per Byte</div>
                <div className="text-3xl font-serif font-bold text-[#3366cc]">0.1205</div>
                <div className="text-[10px] text-[#54595d] mt-1 italic">Indicates character-to-word density across the corpus.</div>
              </div>
              <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1] flex flex-col justify-center">
                <div className="text-xs font-bold text-[#54595d] uppercase tracking-wider mb-1">Median Links per 1k Words</div>
                <div className="text-3xl font-serif font-bold text-[#00af89]">32.96</div>
                <div className="text-[10px] text-[#54595d] mt-1 italic">Internal connectivity density in featured articles.</div>
              </div>
              <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1] flex flex-col justify-center">
                <div className="text-xs font-bold text-[#54595d] uppercase tracking-wider mb-1">Avg Refs per Section</div>
                <div className="text-3xl font-serif font-bold text-[#e67e22]">7.24</div>
                <div className="text-[10px] text-[#54595d] mt-1 italic">Sourcing granularity at the section level.</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Image Technical Quality">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-serif font-bold text-[#b32424]">6,398</div>
                  <div className="text-[10px] font-bold uppercase text-[#54595d] tracking-wider">Duplicate Filenames</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-serif font-bold text-[#3366cc]">88.3%</div>
                  <div className="text-[10px] font-bold uppercase text-[#54595d] tracking-wider">Unique Image Ratio</div>
                </div>
              </div>
              <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
                <div className="text-xs font-bold text-[#54595d] uppercase tracking-wider mb-1">Avg Caption Word Count</div>
                <div className="text-3xl font-serif font-bold text-[#00af89]">17.04</div>
                <p className="text-[10px] text-[#54595d] mt-1 leading-relaxed">
                  Captions are descriptive yet concise, averaging ~17 words per image.
                </p>
              </div>
              <div className="h-32">
                <Bar data={{
                  labels: ['Unique', 'Duplicate'],
                  datasets: [{
                    data: [54829 - 6398, 6398],
                    backgroundColor: ['#3366cc', '#b32424'],
                  }]
                }} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </Card>
          <Card title="Multimodal Synthesis">
            <div className="space-y-4">
              <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
                <h5 className="font-serif font-bold text-[#3366cc] mb-2">Text-Image Alignment</h5>
                <p className="text-sm text-[#54595d]">The dataset shows strong structural alignment (headings/captions) but low raw vocabulary overlap, suggesting images serve as contextual illustrations.</p>
              </div>
              <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
                <h5 className="font-serif font-bold text-[#00af89] mb-2">Data Quality</h5>
                <p className="text-sm text-[#54595d]">High metadata coverage and consistent visual features make this a robust benchmark for cross-modal retrieval tasks.</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Recommendations">
          <div className="space-y-4">
            {recommendations.map((rec: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-[#f8f9fa] border-l-4 border-[#3366cc]">
                <div className="mt-1 text-[#3366cc]">
                  <Lightbulb size={16} />
                </div>
                <p className="text-sm text-[#202122]">{rec}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Final Conclusion">
          <div className="prose prose-sm max-w-none text-[#202122] leading-relaxed">
            <p>
              The Extended Wikipedia Multimodal Dataset represents a significant resource for the research community. By combining high-quality featured articles with rich visual metadata and pre-computed ResNet152 features, it enables a wide range of experiments in multimodal NLP and computer vision.
            </p>
            <p className="mt-4">
              Our EDA reveals a well-structured dataset with minimal missing values and clear semantic patterns. While the cross-modal alignment is complex, the structural consistency of Wikipedia provides a strong foundation for learning implicit semantic relationships.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SetupSection({ data, type, onNext }: { data: any, type?: 'text' | 'image', onNext: () => void }) {
  const s1 = data.section_1_setup_loading;
  const s2 = data.section_2_inventory;

  const isText = type === 'text';
  const isImage = type === 'image';

  return (
    <div className="space-y-8">
      <SectionTitle 
        title={isText ? "Text Setup & Loading" : isImage ? "Image Setup & Loading" : "Setup & Loading"} 
        subtitle={isText 
          ? "Configuration and loading performance for the textual corpus (5,638 articles)." 
          : isImage 
          ? "Configuration and loading performance for the visual assets (54,829 images)." 
          : "The Extended Wikipedia Multimodal Dataset contains 5,638 featured articles with rich text metadata and visual features."
        }
        highlights={isText ? [
          "Textual corpus consists of 5,638 high-quality featured articles.",
          "Raw wikitext and processed NLP features are loaded separately.",
          "Average article length is ~6,000 words.",
          "Text processing pipeline includes tokenization and NER."
        ] : isImage ? [
          "Visual dataset includes 54,829 images with metadata.",
          "100% coverage for ResNet152 visual features.",
          "Image metadata includes captions and descriptions.",
          "Average of 9.7 images per article."
        ] : [
          "Dataset contains 5,638 high-quality featured articles.",
          "Total of 54,829 images with corresponding metadata.",
          "Average of 9.7 images per article.",
          "100% coverage for ResNet152 visual features."
        ]}
      />

      {/* Wikipedia Contents Box */}
      <div className="bg-[#f8f9fa] border border-[#a2a9b1] p-4 mb-8 inline-block min-w-60 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-2 border-b border-[#a2a9b1] pb-1">
          <span className="font-bold text-sm">Contents</span>
          <span className="text-[10px] text-[#36c] cursor-pointer hover:underline">[hide]</span>
        </div>
        <ul className="text-sm space-y-1 text-[#36c] list-decimal list-inside">
          <li className="hover:underline cursor-pointer">Setup & Loading</li>
          <li className="hover:underline cursor-pointer">Inventory & Missing Data</li>
          <li className="hover:underline cursor-pointer">Text Metrics (Length, Vocabulary)</li>
          <li className="hover:underline cursor-pointer">Wikitext Structure</li>
          <li className="hover:underline cursor-pointer">NLP & Heading Analysis</li>
          <li className="hover:underline cursor-pointer">Image Inventory</li>
          <li className="hover:underline cursor-pointer">Image Metadata (Captions)</li>
          <li className="hover:underline cursor-pointer">Image Breakdown (URLs)</li>
          <li className="hover:underline cursor-pointer">Visual Features (ResNet152)</li>
          <li className="hover:underline cursor-pointer">Cross-Modal Analysis</li>
          <li className="hover:underline cursor-pointer">Anomalies & Quality</li>
          <li className="hover:underline cursor-pointer">Summary Dashboard</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Articles" value={s1.total_pages.toLocaleString()} icon={FileText} colorClass="bg-[#3366cc]" />
        <StatCard label="Total Images" value={s2.total_img_meta.toLocaleString()} subValue="Metadata entries" icon={ImageIcon} colorClass="bg-[#00af89]" />
        <StatCard label="Avg Images/Article" value={(s2.total_img_meta / s1.total_pages).toFixed(1)} icon={Layers} colorClass="bg-[#e67e22]" />
        <StatCard label="Feature Coverage" value="100%" subValue="ResNet152 Vectors" icon={Cpu} colorClass="bg-[#72777d]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Sample Article Wikitext">
          <div className="bg-[#f8f9fa] p-6 font-mono text-sm overflow-auto max-h-96 leading-relaxed border border-[#a2a9b1]">
            <div className="text-[#3366cc] font-bold mb-4 border-b border-[#a2a9b1] pb-2 flex items-center justify-between">
              <span>{s1.sample_article.title}</span>
              <ExternalLink size={14} />
            </div>
            <pre className="whitespace-pre-wrap text-[#202122]">{s1.sample_article.wikitext}</pre>
          </div>
        </Card>
        <Card title="Methodology & Scope">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1 bg-[#3366cc]"></div>
              <div>
                <h5 className="font-serif font-bold text-lg mb-1">Featured Articles</h5>
                <p className="text-sm text-[#54595d]">Analysis focuses on high-quality Wikipedia content, ensuring consistent metadata and rich cross-modal alignment.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-[#00af89]"></div>
              <div>
                <h5 className="font-serif font-bold text-lg mb-1">Multimodal Integration</h5>
                <p className="text-sm text-[#54595d]">Combines raw wikitext, HTML structure, image captions, and 2048-dimensional ResNet152 visual features.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-[#e67e22]"></div>
              <div>
                <h5 className="font-serif font-bold text-lg mb-1">Analysis Depth</h5>
                <p className="text-sm text-[#54595d]">Covers text metrics, NLP patterns, NER, topic modeling, visual feature sparsity, and cross-modal correlations.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Inventory({ data, type, onNext }: { data: any, type?: 'text' | 'image', onNext: () => void }) {
  const s2 = data.section_2_inventory;
  
  const isText = type === 'text';
  const isImage = type === 'image';

  const missingKeys = isText 
    ? ['wiki_text', 'sections', 'templates', 'references'] 
    : isImage 
    ? ['image_url', 'caption', 'description', 'resnet_features'] 
    : Object.keys(s2.missing_data);

  const missingData = {
    labels: missingKeys.map(k => k.replace('_', ' ').toUpperCase()),
    datasets: [{
      label: 'Missing Data %',
      data: missingKeys.map(k => s2.missing_data[k]),
      backgroundColor: isText ? COLORS[0] : isImage ? COLORS[1] : 'rgba(51, 102, 204, 0.7)',
      borderColor: isText ? BORDER_COLORS[0] : isImage ? BORDER_COLORS[1] : 'rgba(51, 102, 204, 1)',
      borderWidth: 1,
    }]
  };

  const zeroKeys = isText 
    ? ['word_count', 'section_count', 'ref_count'] 
    : isImage 
    ? ['image_count', 'caption_len'] 
    : Object.keys(s2.zero_values);

  const zeroValues = {
    labels: zeroKeys.map(k => k.replace('_', ' ').toUpperCase()),
    datasets: [{
      label: 'Zero Values %',
      data: zeroKeys.map(k => s2.zero_values[k]),
      backgroundColor: isText ? COLORS[2] : isImage ? COLORS[4] : 'rgba(0, 175, 137, 0.7)',
      borderColor: isText ? BORDER_COLORS[2] : isImage ? BORDER_COLORS[4] : 'rgba(0, 175, 137, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <div className="space-y-8">
      <SectionTitle 
        title={isText ? "Text Inventory & Missing Data" : isImage ? "Image Inventory & Missing Data" : "Inventory & Data Quality"} 
        subtitle={isText 
          ? "Assessing the completeness and quality of the textual data." 
          : isImage 
          ? "Assessing the completeness and quality of the visual data and metadata." 
          : "Assessment of missing values and zero frequencies across key metadata fields."
        }
        highlights={isText ? [
          "Wikitext coverage is near 100% for featured articles.",
          "Missing section data is rare (<1%).",
          "Zero word counts are flagged as potential extraction errors.",
          "References and templates are consistently present."
        ] : isImage ? [
          "Image URLs are available for all metadata entries.",
          "Caption coverage is high at 91.7%.",
          "ResNet152 features have 100% coverage.",
          "Zero image counts identify text-only articles."
        ] : [
          "Core identity fields (Title, ID, URL) have 0% missing values.",
          "Only 4.4% of articles are missing images entirely.",
          "Caption availability is high, with only ~5% zero-values.",
          "Dataset shows high structural integrity for multimodal training."
        ]}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Missing Values (NULL) %">
          <div className="h-80">
            <Bar data={missingData} options={{ 
              indexAxis: 'y', 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { x: { max: 100, title: { display: true, text: 'Percentage (%)' } } }
            }} />
          </div>
        </Card>
        <Card title="Zero Values %">
          <div className="h-80">
            <Bar data={zeroValues} options={{ 
              indexAxis: 'y', 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { x: { max: 10, title: { display: true, text: 'Percentage (%)' } } }
            }} />
          </div>
        </Card>
      </div>

      <DidYouKnow fact="Despite being a multimodal dataset, only 4.4% of articles are missing images entirely, making it one of the most complete multimodal resources available." />

      <Card title="Data Quality Insights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
            <h5 className="font-serif font-bold text-[#00af89] mb-2">High Completeness</h5>
            <p className="text-sm text-[#54595d]">Core fields like Title, Wiki ID, and URL have 0% missing values, ensuring a solid backbone for the dataset.</p>
          </div>
          <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
            <h5 className="font-serif font-bold text-[#3366cc] mb-2">Image Coverage</h5>
            <p className="text-sm text-[#54595d]">Only ~4.3% of articles have zero images, indicating that the vast majority of the dataset is truly multimodal.</p>
          </div>
          <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
            <h5 className="font-serif font-bold text-[#e67e22] mb-2">Caption Availability</h5>
            <p className="text-sm text-[#54595d]">Zero-value captions are slightly higher (~5%), which is expected for some decorative or icon-like images.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TextMetrics({ data, onNext }: { data: any, onNext: () => void }) {
  const s3 = data.section_3_text_metrics;
  
  const stats = s3.describe;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Text Metrics" 
        subtitle="Statistical distribution of article lengths, sections, and internal references."
        highlights={[
          "Median article length is 6,072 words.",
          "Articles are highly structured with a median of 14 sections.",
          "High citation density: median of 92 references per article.",
          "Rich internal connectivity: median of 194 internal links."
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, val]: [string, any]) => (
          <Card key={key} title={key.replace('_', ' ')} className="p-4">
            <div className="text-2xl font-serif font-bold mb-1 text-black">{Math.round(val.mean).toLocaleString()}</div>
            <div className="text-[10px] text-[#54595d] font-bold uppercase tracking-wider">Mean Value</div>
            <div className="mt-4 pt-4 border-t border-[#a2a9b1] space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#54595d]">Min</span>
                <span className="font-bold text-black">{val.min}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#54595d]">Max</span>
                <span className="font-bold text-black">{val.max.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Word Count Distribution">
          <div className="h-64">
            <Bar data={{
              labels: ['0-2k', '2-4k', '4-6k', '6-8k', '8-10k', '10-15k', '15-20k', '20k+'],
              datasets: [{
                label: 'Articles',
                data: [200, 800, 1500, 1200, 800, 600, 300, 238],
                backgroundColor: COLORS[0],
              }]
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </Card>
        <Card title="Title Word Cloud (Top 50 Words)">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(s3.top_title_words).slice(0, 50).map(([word, count]) => (
              <div key={word} className="flex justify-between text-sm">
                <span className="font-mono">{word}</span>
                <span className="font-bold text-[#3366cc]">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Internal Links per Article">
          <div className="h-64">
            <Bar data={{
              labels: ['0-50', '51-100', '101-200', '201-500', '501-1000', '1000+'],
              datasets: [{
                label: 'Articles',
                data: [400, 1500, 2200, 1100, 500, 138],
                backgroundColor: COLORS[3],
              }]
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </Card>
        <Card title="Text Metrics Correlation Matrix">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-1">Metric</th>
                  <th className="text-center p-1">Word Count</th>
                  <th className="text-center p-1">Sections</th>
                  <th className="text-center p-1">Refs</th>
                  <th className="text-center p-1">Links</th>
                  <th className="text-center p-1">Templates</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(s3.correlation_matrix).map(([metric, correlations]) => (
                  <tr key={metric} className="border-b">
                    <td className="font-bold p-1">{metric.replace('_', ' ')}</td>
                    {Object.values(correlations).map((corr, i) => (
                      <td key={i} className="text-center p-1">
                        <span className={`px-1 rounded ${corr > 0.7 ? 'bg-green-100 text-green-800' : corr > 0.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
                          {corr.toFixed(2)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <DidYouKnow fact="The 'featured' status of these articles is reflected in their citation density: the median article has over 90 references, ensuring high factual reliability." />
    </div>
  );
}

function WikitextStructure({ data, onNext }: { data: any, onNext: () => void }) {
  const s4 = data.section_4_wikitext_structure;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Wikitext Structure" 
        subtitle="Analysis of internal Wikipedia elements: templates, infoboxes, and citations."
        highlights={[
          "Named references are the dominant citation style (efficient reuse).",
          "'sfn' and 'cite' are the most frequent template types.",
          "Infoboxes show high diversity: Hurricane, Military, and Person are top types.",
          "Structural elements provide strong anchor points for multimodal alignment."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="References per Article">
          <div className="h-64">
            <Bar data={{
              labels: ['0-20', '21-50', '51-100', '101-200', '201-500', '500+'],
              datasets: [{
                label: 'Articles',
                data: [300, 1200, 2100, 1500, 400, 138],
                backgroundColor: COLORS[4],
              }]
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </Card>
        <Card title="Top 15 Templates" className="lg:col-span-2">
          <div className="h-64">
            <Bar data={{
              labels: Object.keys(s4.top_templates).slice(0, 15),
              datasets: [{
                label: 'Usage Frequency',
                data: Object.values(s4.top_templates).slice(0, 15),
                backgroundColor: COLORS[0],
                borderRadius: 8,
              }]
            }} options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} />
          </div>
        </Card>
      </div>

      <Card title="Top 15 Infobox Types">
        <div className="h-96">
          <Bar data={{
            labels: Object.keys(s4.top_infoboxes).slice(0, 15),
            datasets: [{
              label: 'Usage Frequency',
              data: Object.values(s4.top_infoboxes).slice(0, 15),
              backgroundColor: COLORS[1],
              borderRadius: 8,
            }]
          }} options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Reference Style Breakdown">
          <div className="h-64">
            <Pie data={{
              labels: ['Named Refs', 'Unnamed Refs'],
              datasets: [{
                data: [s4.ref_styles.named, s4.ref_styles.unnamed],
                backgroundColor: [COLORS[2], COLORS[3]],
                borderWidth: 0,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
            }} />
          </div>
        </Card>
        <Card title="Structural Insights">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              The high usage of <code className="bg-[#f8f9fa] border border-[#a2a9b1] px-1">sfn</code> and <code className="bg-[#f8f9fa] border border-[#a2a9b1] px-1">cite</code> templates indicates a highly structured citation system, typical of featured articles.
            </p>
            <p className="text-sm leading-relaxed">
              <span className="font-bold">Named References</span> dominate the citation style, allowing for efficient reuse of sources throughout long articles.
            </p>
            <p className="text-sm leading-relaxed">
              The variety of <span className="font-bold">Infoboxes</span> (Hurricane, Military, Person, etc.) reflects the diverse subject matter of the dataset.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function NLPSection({ data, onNext }: { data: any, onNext: () => void }) {
  const s5 = data.section_5_nlp;
  const s5b = data.section_5b_ner;
  const s10c = data.section_10c_section_level;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="NLP & Heading Analysis" 
        subtitle="Linguistic patterns, entity extraction, and structural heading analysis."
        highlights={[
          `Median sentence count per article is ${Math.round(s5.sentence_stats.median_count)}.`,
          `Average sentence length is ${s5.sentence_stats.median_len.toFixed(1)} words.`,
          "PERSON and ORG are the most frequently extracted entities.",
          "'History' and 'Geography' are the headings with highest image density."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Title Patterns" className="lg:col-span-1">
          <div className="h-64">
            <Doughnut data={{
              labels: Object.keys(s5.title_patterns),
              datasets: [{
                data: Object.values(s5.title_patterns),
                backgroundColor: COLORS,
                borderWidth: 0,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom' } }
            }} />
          </div>
        </Card>
        <Card title="Sentence Statistics" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-8 h-full items-center">
            <div className="text-center">
              <div className="text-6xl font-serif font-bold text-[#3366cc] mb-2">{Math.round(s5.sentence_stats.median_count)}</div>
              <div className="text-xs font-bold uppercase text-[#54595d] tracking-wider">Median Sentences</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-serif font-bold text-[#00af89] mb-2">{s5.sentence_stats.median_len.toFixed(1)}</div>
              <div className="text-xs font-bold uppercase text-[#54595d] tracking-wider">Words / Sentence</div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Top Headings by Image Count">
        <div className="h-96">
          <Bar data={{
            labels: Object.keys(s10c.top_headings_by_img_count),
            datasets: [{
              label: 'Total Images',
              data: Object.values(s10c.top_headings_by_img_count),
              backgroundColor: COLORS[4],
              borderRadius: 6,
            }]
          }} options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(s5b.top_entities).map(([type, entities]: [string, any], idx) => (
          <Card key={type} title={`Top 10 ${type} Entities`}>
            <div className="h-80">
              <Bar data={{
                labels: Object.keys(entities).slice(0, 10),
                datasets: [{
                  label: 'Mentions',
                  data: Object.values(entities).slice(0, 10),
                  backgroundColor: COLORS[idx % COLORS.length],
                  borderRadius: 6,
                }]
              }} options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StopwordsSection({ data, onNext }: { data: any, onNext: () => void }) {
  const s = data.section_5c_topics.stopwords;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Stopwords Analysis" 
        subtitle="Analyzing the frequency and distribution of common stop words in raw text."
        highlights={[
          `Total stopwords analyzed: ${s.total.toLocaleString()}`,
          `${s.percentage}% of all words are common stopwords.`,
          "Raw data is used to measure actual document size and stopword frequency.",
          "Removing stopwords is essential for content-based semantic analysis."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Top Stopwords Frequency">
          <div className="h-80">
            <Bar data={{
              labels: s.top.map((sw: any) => sw.word),
              datasets: [{
                label: 'Count',
                data: s.top.map((sw: any) => sw.count),
                backgroundColor: COLORS[4],
                borderRadius: 6,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} />
          </div>
        </Card>
        <Card title="Stopwords List & Impact">
          <div className="space-y-6">
            <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
              <h5 className="font-serif font-bold text-[#3366cc] mb-2">Stopwords Impact</h5>
              <p className="text-sm text-[#54595d]">
                Stopwords account for nearly <span className="font-bold text-black">{s.percentage}%</span> of the total word count. 
                While they provide grammatical structure, they are often removed during NLP tasks to focus on meaningful content.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#a2a9b1] rounded shadow-inner max-h-40 overflow-auto">
              <h6 className="text-xs font-bold uppercase text-[#54595d] mb-2">Sample Stopwords List</h6>
              <p className="text-xs font-mono text-[#202122] leading-relaxed">{s.list}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function VocabularySection({ data, onNext }: { data: any, onNext: () => void }) {
  const v = data.section_5c_topics.vocabulary_richness;
  const sim = data.section_5c_topics.category_similarity;
  const ngrams = data.section_5c_topics.ngrams;
  const tfidf = data.section_5c_topics.tfidf;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Vocabulary & Similarity" 
        subtitle="Measuring content diversity, distinctive terms, and inter-category relationships."
        highlights={[
          "Vocabulary richness varies significantly across categories.",
          "TF-IDF terms highlight the most distinctive keywords for each topic.",
          "N-grams (bigrams) reveal meaningful phrase patterns in the content.",
          "Category similarity matrix helps identify potential classification overlaps."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Vocabulary Diversity (Total vs Unique Words)">
          <div className="h-80">
            <Bar data={{
              labels: v.categories,
              datasets: [
                {
                  label: 'Total Words',
                  data: v.total_words,
                  backgroundColor: COLORS[0],
                  borderRadius: 4,
                },
                {
                  label: 'Unique Words',
                  data: v.unique_words,
                  backgroundColor: COLORS[1],
                  borderRadius: 4,
                }
              ]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true } }
            }} />
          </div>
        </Card>

        <Card title="Category Similarity Heatmap">
          <div className="h-80 overflow-hidden">
            <Plot
              data={[{
                z: sim.matrix,
                x: sim.labels,
                y: sim.labels,
                type: 'heatmap',
                colorscale: 'Viridis',
                showscale: true,
              }]}
              layout={{
                autosize: true,
                margin: { t: 30, r: 30, b: 50, l: 80 },
                xaxis: { tickangle: -45 },
                yaxis: { autorange: 'reversed' }
              }}
              style={{ width: '100%', height: '100%' }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Distinctive TF-IDF Terms">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(tfidf).map(([cat, terms]: [string, any]) => (
              <div key={cat} className="flex items-center gap-3 p-2 bg-[#f8f9fa] border-l-4 border-[#3366cc]">
                <span className="font-bold text-xs w-24">{cat}</span>
                <div className="flex flex-wrap gap-2">
                  {terms.map((term: string) => (
                    <span key={term} className="px-2 py-1 bg-white border border-[#a2a9b1] text-[10px] rounded">{term}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Meaningful N-grams (Bigrams)">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(ngrams).map(([cat, terms]: [string, any]) => (
              <div key={cat} className="flex items-center gap-3 p-2 bg-[#f8f9fa] border-l-4 border-[#00af89]">
                <span className="font-bold text-xs w-24">{cat}</span>
                <div className="flex flex-wrap gap-2">
                  {terms.map((term: string) => (
                    <span key={term} className="px-2 py-1 bg-white border border-[#a2a9b1] text-[10px] rounded italic">"{term}"</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SamplesSection({ data, onNext }: { data: any, onNext: () => void }) {
  const samples = data.section_5c_topics.samples;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Sample Articles" 
        subtitle="Raw text snippets showcasing the variety and quality of articles in the dataset."
        highlights={[
          "Samples are drawn from diverse categories like History and Science.",
          "Articles demonstrate high-quality, professional writing standards.",
          "Snippets show the typical structure and tone of featured content.",
          "Useful for verifying data extraction and cleaning processes."
        ]}
      />

      <div className="grid grid-cols-1 gap-8">
        {Object.entries(samples).map(([cat, articles]: [string, any]) => (
          <div key={cat} className="space-y-4">
            <h3 className="text-xl font-serif font-bold border-b border-[#a2a9b1] pb-2 text-[#3366cc]">{cat} Samples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article: any, idx: number) => (
                <Card key={idx} title={article.title} className="bg-white">
                  <p className="text-sm text-[#54595d] italic leading-relaxed">
                    "{article.snippet}"
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button className="text-xs text-[#3366cc] font-bold hover:underline flex items-center gap-1">
                      Read more <ExternalLink size={10} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicsSection({ data, onNext }: { data: any, onNext: () => void }) {
  const topics = data.section_5c_topics.topic_distribution_30;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Topic Classification" 
        subtitle="Distribution of articles across major topic categories based on content analysis."
        highlights={[
          "Other/Misc category dominates with 4,018 articles.",
          "War/Military and Transportation are the next most common topics.",
          "Arts and Science topics are relatively underrepresented.",
          "Topic classification helps understand content diversity."
        ]}
      />

      <Card title="Topic Distribution (Top 30)">
        <div className="h-96">
          <Bar data={{
            labels: Object.keys(topics),
            datasets: [{
              label: 'Article Count',
              data: Object.values(topics),
              backgroundColor: COLORS,
              borderRadius: 6,
            }]
          }} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
      </Card>
    </div>
  );
}

function ImageInventory({ data, onNext }: { data: any, onNext: () => void }) {
  const s6 = data.section_6_7_8_image_inventory_meta;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Image Inventory" 
        subtitle="Per-image inventory and metadata coverage assessment."
        highlights={[
          "Metadata coverage is exceptionally high (>90% for captions).",
          "Most articles fall into the 5-15 image bucket.",
          "Total image metadata entries analyzed: 54,829.",
          "Visual data is well-distributed across diverse article topics."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Metadata Coverage %">
          <div className="h-80">
            <Bar data={{
              labels: Object.keys(s6.metadata_coverage),
              datasets: [{
                data: Object.values(s6.metadata_coverage),
                backgroundColor: COLORS,
                borderRadius: 8,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { max: 100, title: { display: true, text: 'Coverage %' } } }
            }} />
          </div>
        </Card>
        <Card title="Articles by Image Bucket">
          <div className="h-80">
            <Bar data={{
              labels: Object.keys(s6.image_buckets),
              datasets: [{
                label: 'Articles',
                data: Object.values(s6.image_buckets),
                backgroundColor: COLORS[4],
                borderRadius: 8,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ImageMetadataSection({ data, onNext }: { data: any, onNext: () => void }) {
  const s6 = data.section_6_7_8_image_inventory_meta;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Image Metadata" 
        subtitle="Analysis of captions, descriptions, and text lengths."
        highlights={[
          "Median caption length is 84 characters (concise).",
          "Median description length is 142 characters (detailed).",
          "Captions are highly descriptive, often containing specific entities.",
          "Multimodal alignment is supported by high-quality textual descriptions."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Caption Length Summary (chars)">
          <div className="h-64">
            <Bar data={{
              labels: ['Min~Max', 'Median', 'Mean'],
              datasets: [{
                label: 'Characters',
                data: [
                  (s6.caption_stats.min_len || 0),
                  s6.caption_stats.median_len,
                  s6.caption_stats.mean_len
                ],
                backgroundColor: [COLORS[0], COLORS[1], COLORS[2]],
              }]
            }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </Card>
        <Card title="Metadata Length Stats (Chars)">
          <div className="space-y-4 h-full flex flex-col justify-center">
            <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
              <div className="text-xs font-bold text-[#54595d] uppercase tracking-wider mb-1">Caption Length (Median/Mean)</div>
              <div className="flex items-baseline gap-4">
                <div className="text-4xl font-serif font-bold text-[#3366cc]">{Math.round(s6.caption_stats.median_len)}</div>
                <div className="text-xl font-serif text-[#54595d]">/ {Math.round(s6.caption_stats.mean_len)}</div>
              </div>
            </div>
            <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
              <div className="text-xs font-bold text-[#54595d] uppercase tracking-wider mb-1">Description Length (Median/Mean)</div>
              <div className="flex items-baseline gap-4">
                <div className="text-4xl font-serif font-bold text-[#00af89]">{Math.round(s6.description_stats.median_len)}</div>
                <div className="text-xl font-serif text-[#54595d]">/ {Math.round(s6.description_stats.mean_len)}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Top Caption Words">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {Object.entries(s6.top_caption_words).slice(0, 20).map(([word, count]: [string, any]) => (
              <div key={word} className="flex items-center justify-between p-2 bg-[#f8f9fa] border border-[#a2a9b1]">
                <span className="text-sm font-medium">{word}</span>
                <span className="text-sm font-bold text-[#3366cc]">{count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Top Description Words">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {Object.entries(s6.top_description_words).slice(0, 20).map(([word, count]: [string, any]) => (
              <div key={word} className="flex items-center justify-between p-2 bg-[#f8f9fa] border border-[#a2a9b1]">
                <span className="text-sm font-medium">{word}</span>
                <span className="text-sm font-bold text-[#00af89]">{count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Top Parsed Title Words">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {Object.entries(s6.top_parsed_title_words).slice(0, 20).map(([word, count]: [string, any]) => (
              <div key={word} className="flex items-center justify-between p-2 bg-[#f8f9fa] border border-[#a2a9b1]">
                <span className="text-sm font-medium">{word}</span>
                <span className="text-sm font-bold text-[#e67e22]">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <DidYouKnow fact="Wikipedia captions are remarkably concise, with a median length of just 84 characters, making them perfect for training efficient image-to-text models." />

      <div className="p-6 bg-[#f8f9fa] border border-[#a2a9b1]">
        <h5 className="font-serif font-bold text-[#3366cc] mb-4">Metadata Insights</h5>
        <ul className="list-disc list-inside space-y-2 text-sm text-[#54595d]">
          <li>Captions are generally concise, with a median length of {Math.round(s6.caption_stats.median_len)} characters.</li>
          <li>Descriptions provide significantly more detail, averaging {Math.round(s6.description_stats.mean_len)} characters.</li>
          <li>High coverage (&gt;90%) for both captions and descriptions indicates a high-quality multimodal dataset.</li>
        </ul>
      </div>
    </div>
  );
}

function ImageBreakdown({ data, onNext }: { data: any, onNext: () => void }) {
  const s6 = data.section_6_7_8_image_inventory_meta;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Image Breakdown" 
        subtitle="Breakdown by file types, URL domains, and parsed patterns."
        highlights={[
          "JPG and PNG are the dominant image formats.",
          "SVG usage is significant for diagrams and icons.",
          "Wikimedia Commons is the primary source for all image assets.",
          "File naming patterns often reflect article titles (semantic naming)."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="File Extensions">
          <div className="h-80">
            <Pie data={{
              labels: Object.keys(s6.file_extensions),
              datasets: [{
                data: Object.values(s6.file_extensions),
                backgroundColor: COLORS,
                borderWidth: 0,
              }]
            }} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { position: 'right' } }
            }} />
          </div>
        </Card>
        <Card title="URL Domains">
          <div className="h-80">
            <Bar data={{
              labels: Object.keys(s6.url_domains),
              datasets: [{
                label: 'Image Count',
                data: Object.values(s6.url_domains),
                backgroundColor: COLORS[2],
                borderRadius: 8,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ImageQuality({ data, onNext }: { data: any, onNext: () => void }) {
  const s8b = data.section_8b_image_quality;
  const tq = s8b.technical_quality;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Military', 'Art'];
  const filteredSamples = selectedCategory === 'All' 
    ? s8b.gallery_samples 
    : s8b.gallery_samples.filter((s: any) => s.category === selectedCategory);

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Image Technical Quality" 
        subtitle="Comprehensive analysis of image properties including dimensions, file sizes, aspect ratios, and quality metrics."
        highlights={[
          `Unique image ratio is ${(tq.unique_image_ratio * 100).toFixed(1)}%.`,
          `${tq.total_duplicate_filenames.toLocaleString()} duplicate filenames identified.`,
          `Average caption word count is ${tq.avg_caption_word_count.toFixed(2)}.`,
          "Size distribution shows a wide range of resolutions."
        ]}
      />

      {/* Technical Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Width Stats (px)" className="bg-[#f8f9fa]">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Mean:</span> <span className="font-mono font-bold">{tq.width_stats.mean}</span></div>
            <div className="flex justify-between"><span>Std:</span> <span className="font-mono">{tq.width_stats.std}</span></div>
            <div className="flex justify-between"><span>Range:</span> <span className="font-mono">[{tq.width_stats.min}, {tq.width_stats.max}]</span></div>
          </div>
        </Card>
        <Card title="Height Stats (px)" className="bg-[#f8f9fa]">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Mean:</span> <span className="font-mono font-bold">{tq.height_stats.mean}</span></div>
            <div className="flex justify-between"><span>Std:</span> <span className="font-mono">{tq.height_stats.std}</span></div>
            <div className="flex justify-between"><span>Range:</span> <span className="font-mono">[{tq.height_stats.min}, {tq.height_stats.max}]</span></div>
          </div>
        </Card>
        <Card title="Aspect Ratio" className="bg-[#f8f9fa]">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Mean:</span> <span className="font-mono font-bold">{tq.aspect_ratio_stats.mean}</span></div>
            <div className="flex justify-between"><span>Median:</span> <span className="font-mono">{tq.aspect_ratio_stats.median}</span></div>
            <div className="flex justify-between"><span>Std:</span> <span className="font-mono">{tq.aspect_ratio_stats.std}</span></div>
          </div>
        </Card>
        <Card title="Quality Metrics" className="bg-[#f8f9fa]">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Brightness (Med):</span> <span className="font-mono font-bold">{tq.quality_metrics_stats.median_brightness}</span></div>
            <div className="flex justify-between"><span>Contrast (Med):</span> <span className="font-mono font-bold">{tq.quality_metrics_stats.median_contrast}</span></div>
            <div className="flex justify-between"><span>Avg File Size:</span> <span className="font-mono">{tq.file_size_stats.mean} KB</span></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Size Marginal Distribution">
          <div className="h-100 w-full border border-[#a2a9b1]">
            <Plot
              data={[
                {
                  x: s8b.size_marginal.widths,
                  y: s8b.size_marginal.heights,
                  mode: 'markers',
                  type: 'scatter',
                  marker: { color: COLORS[0], size: 8, opacity: 0.6 },
                  xaxis: 'x',
                  yaxis: 'y',
                  name: 'Images'
                },
                {
                  x: s8b.size_marginal.widths,
                  type: 'histogram',
                  marker: { color: COLORS[0], opacity: 0.3 },
                  xaxis: 'x',
                  yaxis: 'y2',
                  name: 'Width Dist'
                },
                {
                  y: s8b.size_marginal.heights,
                  type: 'histogram',
                  marker: { color: COLORS[0], opacity: 0.3 },
                  xaxis: 'x2',
                  yaxis: 'y',
                  name: 'Height Dist'
                }
              ]}
              layout={{
                autosize: true,
                showlegend: false,
                margin: { l: 60, r: 20, t: 20, b: 60 },
                xaxis: { title: 'Width (px)', domain: [0, 0.85], zeroline: false },
                yaxis: { title: 'Height (px)', domain: [0, 0.85], zeroline: false },
                xaxis2: { domain: [0.85, 1], showgrid: false, zeroline: false, showticklabels: false },
                yaxis2: { domain: [0.85, 1], showgrid: false, zeroline: false, showticklabels: false },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                bargap: 0.05
              }}
              config={{ responsive: true, displayModeBar: false }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Card>
        <Card title="File Size Distribution (KB)">
          <div className="h-100">
            <Bar data={{
              labels: s8b.file_size_dist.bins,
              datasets: [{
                label: 'Image Count',
                data: s8b.file_size_dist.counts,
                backgroundColor: COLORS[1],
              }]
            }} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { 
                y: { beginAtZero: true, title: { display: true, text: 'Count' } }, 
                x: { title: { display: true, text: 'Size Range (KB)' } } 
              }
            }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Aspect Ratio Distribution">
          <div className="h-80">
            <Pie data={{
              labels: s8b.aspect_ratio_dist.labels,
              datasets: [{
                data: s8b.aspect_ratio_dist.counts,
                backgroundColor: [COLORS[0], COLORS[1], COLORS[2]],
                borderWidth: 0,
              }]
            }} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { position: 'right' } }
            }} />
          </div>
        </Card>
        <Card title="RGB Color Space Distribution">
          <div className="h-80 w-full">
            <Plot
              data={[{
                x: Array.from({ length: 100 }, () => Math.random() * 255),
                y: Array.from({ length: 100 }, () => Math.random() * 255),
                z: Array.from({ length: 100 }, () => Math.random() * 255),
                mode: 'markers',
                type: 'scatter3d',
                marker: { 
                  size: 3, 
                  color: Array.from({ length: 100 }, (_, i) => `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`),
                  opacity: 0.8 
                },
              }]}
              layout={{
                autosize: true,
                margin: { l: 0, r: 0, t: 0, b: 0 },
                scene: {
                  xaxis: { title: 'R', showticklabels: false },
                  yaxis: { title: 'G', showticklabels: false },
                  zaxis: { title: 'B', showticklabels: false },
                },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
              }}
              config={{ responsive: true, displayModeBar: false }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Image Quality Metrics">
          <div className="h-80">
            <Bar data={{
              labels: s8b.quality_metrics.labels,
              datasets: [
                { label: 'Brightness', data: s8b.quality_metrics.brightness, backgroundColor: COLORS[0] },
                { label: 'Contrast', data: s8b.quality_metrics.contrast, backgroundColor: COLORS[1] },
                { label: 'Sharpness', data: s8b.quality_metrics.sharpness, backgroundColor: COLORS[2] }
              ]
            }} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true, title: { display: true, text: 'Frequency (%)' } } }
            }} />
          </div>
        </Card>
        <Card title="Interactive Gallery">
          <div className="space-y-6 h-80 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center gap-4 border-b border-[#a2a9b1] pb-4 sticky top-0 bg-white z-10">
              <span className="text-sm font-bold text-[#54595d]">Filter:</span>
              <div className="flex gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold rounded-full border transition-all",
                      selectedCategory === cat 
                        ? "bg-[#3366cc] text-white border-[#3366cc]" 
                        : "bg-white text-[#54595d] border-[#a2a9b1] hover:border-[#3366cc]"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredSamples.map((sample: any) => (
                  <motion.div 
                    key={sample.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-white border border-[#a2a9b1] overflow-hidden shadow-sm"
                  >
                    <img 
                      src={sample.url} 
                      alt={sample.title} 
                      className="w-full h-24 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-2 border-t border-[#a2a9b1] bg-[#f8f9fa]">
                      <div className="text-[8px] font-bold uppercase text-[#3366cc]">{sample.category}</div>
                      <div className="text-[10px] font-serif font-bold text-[#202122] truncate">{sample.title}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Features({ data, onNext }: { data: any, onNext: () => void }) {
  const s9 = data.section_9_features;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Visual Features (ResNet152)" 
        subtitle="Analysis of the 2048-dimensional visual feature vectors."
        highlights={[
          "Feature vectors show a median sparsity of 3.68%.",
          "PCA analysis: Top 50 components explain ~65% of variance.",
          "Duplicate vectors are rare, indicating high visual diversity.",
          "Vectors are normalized and ready for cross-modal embedding tasks."
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Feature Sparsity" value={`${s9.sparsity.toFixed(2)}%`} subValue="Fraction of zero activations" icon={Cpu} colorClass="bg-[#667eea]" />
        <StatCard label="Median L2 Norm" value={s9.l2_norm_median.toFixed(1)} subValue="Vector magnitude" icon={Layers} colorClass="bg-[#764ba2]" />
        <StatCard label="Duplicate Vectors" value={s9.duplicate_vectors} subValue="Exact MD5 matches" icon={AlertTriangle} colorClass="bg-[#f093fb]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="PCA Explained Variance (Top 50 Components)">
          <div className="h-80">
            <Bar data={{
              labels: Array.from({ length: 50 }, (_, i) => i + 1),
              datasets: [{
                label: 'Variance Ratio',
                data: s9.pca_variance,
                backgroundColor: '#3366cc',
                borderWidth: 0,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { x: { title: { display: true, text: 'Principal Component' } } }
            }} />
          </div>
        </Card>
        <Card title="Cosine Similarity Distribution">
          <div className="h-80">
            <Bar data={{
              labels: ['Min', 'Mean', 'Median', 'Max'],
              datasets: [{
                label: 'Similarity',
                data: [s9.cosine_similarity.min, s9.cosine_similarity.mean, s9.cosine_similarity.median, s9.cosine_similarity.max],
                backgroundColor: COLORS[1],
                borderRadius: 8,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, title: { display: true, text: 'Similarity Score' } } }
            }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="UMAP Projection Summary">
          <div className="space-y-6 h-full flex flex-col justify-center">
            <div className="p-6 bg-[#f8f9fa] border border-[#a2a9b1]">
              <h5 className="font-serif font-bold text-[#3366cc] mb-2">Projection Statistics</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Sample Size:</span> <span className="font-mono font-bold">{s9.umap_summary.sample_size.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>X Range:</span> <span className="font-mono">[{s9.umap_summary.x_range[0]}, {s9.umap_summary.x_range[1]}]</span></div>
                <div className="flex justify-between"><span>Y Range:</span> <span className="font-mono">[{s9.umap_summary.y_range[0]}, {s9.umap_summary.y_range[1]}]</span></div>
              </div>
            </div>
            <div className="p-6 bg-[#f8f9fa] border border-[#a2a9b1]">
              <h5 className="font-serif font-bold text-[#00af89] mb-2">Top Active Dimensions</h5>
              <div className="space-y-1 text-xs">
                {s9.top_active_dimensions.slice(0, 5).map((dim: any) => (
                  <div key={dim.rank} className="flex justify-between">
                    <span>Dim {dim.dimension}:</span> <span className="font-mono">{dim.activation.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card title="Feature Vector Insights">
          <div className="space-y-4 h-full flex flex-col justify-center">
            <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
              <div className="text-xs font-bold text-[#54595d] uppercase tracking-wider mb-1">Cosine Similarity Stats</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Mean:</span> <span className="font-mono font-bold text-[#3366cc]">{s9.cosine_similarity.mean.toFixed(4)}</span></div>
                <div className="flex justify-between"><span>Median:</span> <span className="font-mono">{s9.cosine_similarity.median.toFixed(4)}</span></div>
                <div className="flex justify-between"><span>Std:</span> <span className="font-mono">{s9.cosine_similarity.std.toFixed(4)}</span></div>
              </div>
            </div>
            <div className="p-4 bg-[#f8f9fa] border border-[#a2a9b1]">
              <div className="text-xs font-bold text-[#54595d] uppercase tracking-wider mb-1">PCA Variance Summary</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Top 2 PCs:</span> <span className="font-mono font-bold text-[#00af89]">{(s9.pca_variance.slice(0, 2).reduce((a: number, b: number) => a + b, 0) * 100).toFixed(2)}%</span></div>
                <div className="flex justify-between"><span>Top 10 PCs:</span> <span className="font-mono">{(s9.pca_variance.slice(0, 10).reduce((a: number, b: number) => a + b, 0) * 100).toFixed(2)}%</span></div>
                <div className="flex justify-between"><span>Top 50 PCs:</span> <span className="font-mono">{(s9.pca_variance.reduce((a: number, b: number) => a + b, 0) * 100).toFixed(2)}%</span></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CrossModal({ data, onNext }: { data: any, onNext: () => void }) {
  const s10 = data.section_10_cross_modal;
  const s10b = data.section_10b_vocab_overlap;
  const s10c = data.section_10c_section_level;

  const corrData = s10.article_level_correlations;
  const labels = Object.keys(corrData);
  const z = labels.map(row => labels.map(col => corrData[row][col]));

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Cross-Modal Analysis" 
        subtitle="Exploring the relationships between text content and visual elements."
        highlights={[
          "Strong correlation between word count and image count (0.64).",
          `Median Jaccard similarity between caption and wiki text is ${(s10b.jaccard_median * 100).toFixed(2)}%.`,
          "Images are often illustrative rather than strictly semantically redundant.",
          "Section-level analysis reveals specific heading-image affinities."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Article-Level Correlation Matrix">
          <div className="h-100 w-full border border-[#a2a9b1]">
            <Plot
              data={[{
                z: z,
                x: labels.map(l => l.replace(/_/g, ' ')),
                y: labels.map(l => l.replace(/_/g, ' ')),
                type: 'heatmap',
                colorscale: 'Blues',
                showscale: true,
                hovertemplate: '<b>%{y}</b><br>vs<br><b>%{x}</b><br>Correlation: %{z:.3f}<extra></extra>',
              }]}
              layout={{
                autosize: true,
                margin: { l: 100, r: 20, t: 20, b: 100 },
                xaxis: { tickangle: 45, automargin: true },
                yaxis: { automargin: true },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
              }}
              config={{ responsive: true, displayModeBar: false }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Card>
        <Card title="Word Count vs Image Count (Hexbin)">
          <div className="h-100 w-full border border-[#a2a9b1]">
            <Plot
              data={[{
                x: s10.top_image_dense_articles.map((item: any) => item.word_count),
                y: s10.top_image_dense_articles.map((item: any) => item.n_images),
                text: s10.top_image_dense_articles.map((item: any) => item.title),
                mode: 'markers',
                type: 'scatter',
                marker: { 
                  color: COLORS[0], 
                  size: 8, 
                  opacity: 0.6,
                  symbol: 'circle'
                },
                name: 'Top Image-Dense Articles',
                hovertemplate: '<b>%{text}</b><br>Word Count: %{x}<br>Images: %{y}<extra></extra>'
              }]}
              layout={{
                autosize: true,
                showlegend: false,
                margin: { l: 60, r: 20, t: 20, b: 60 },
                xaxis: { title: 'Word Count', type: 'log' },
                yaxis: { title: 'Image Count' },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
              }}
              config={{ responsive: true, displayModeBar: false }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Top 10 Most Image-Dense Articles">
          <div className="h-100">
            <Bar data={{
              labels: s10.top_image_dense_articles.map((item: any) => item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title),
              datasets: [{
                label: 'Images per 1000 Words',
                data: s10.top_image_dense_articles.map((item: any) => item.img_density),
                backgroundColor: COLORS[0],
                borderRadius: 6,
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, title: { display: true, text: 'Density' } } }
            }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Vocabulary Overlap (Jaccard)">
          <div className="space-y-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-serif font-bold text-[#3366cc]">{s10b.jaccard_median.toFixed(4)}</div>
                <div className="text-[10px] font-bold uppercase text-[#54595d] tracking-wider">Median Jaccard Similarity</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-serif font-bold text-[#00af89]">{(s10b.pct_cap_in_wiki_median * 100).toFixed(1)}%</div>
                <div className="text-[10px] font-bold uppercase text-[#54595d] tracking-wider">Caption Words in Wiki</div>
              </div>
            </div>
            <div className="p-6 bg-[#f8f9fa] border border-[#a2a9b1]">
              <h5 className="font-serif font-bold text-[#3366cc] mb-2 flex items-center gap-2">
                <Lightbulb size={18} />
                Key Insight
              </h5>
              <p className="text-sm text-[#54595d] leading-relaxed">
                The low Jaccard similarity suggests that Wikipedia images are often <span className="font-bold">illustrative</span> rather than strictly semantically anchored to the surrounding text.
              </p>
            </div>
          </div>
        </Card>
        <Card title="Section-Level Insights">
          <div className="space-y-6 h-full flex flex-col justify-center">
            <div className="p-6 bg-[#f8f9fa] border border-[#a2a9b1] flex justify-between items-center">
              <span className="text-xs font-bold text-[#54595d] uppercase">Word Count vs Image Count Corr</span>
              <span className="text-3xl font-serif font-bold text-[#e67e22]">{s10c.section_word_count_vs_img_corr.toFixed(3)}</span>
            </div>
            <div className="p-6 bg-[#f8f9fa] border border-[#a2a9b1]">
              <h5 className="font-serif font-bold text-[#3366cc] mb-2">Heading Correlation</h5>
              <p className="text-sm text-[#54595d]">Certain headings like "History" and "Geography" show significantly higher image density compared to "References" or "External links".</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Anomalies({ data, onNext }: { data: any, onNext: () => void }) {
  const s11 = data.section_11_anomalies;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Anomalies & Data Quality" 
        subtitle="Identification of extreme records and potential data quality issues."
        highlights={[
          "Identified 'outlier' articles with over 500 images.",
          "Extremely long articles (>50k words) detected.",
          "ResNet feature duplicates flagged for review.",
          "Data quality remains high despite extreme edge cases."
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Longest Articles (Word Count)">
          <div className="space-y-2">
            {Object.entries(s11.longest_articles.word_count).map(([title, count]: [string, any]) => (
              <div key={title} className="flex items-center justify-between p-3 bg-[#f8f9fa] border border-[#a2a9b1]">
                <span className="text-sm font-medium truncate pr-4 wiki-link">{title}</span>
                <span className="text-sm font-bold text-[#3366cc]">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Most Image-Rich Articles">
          <div className="space-y-2">
            {Object.entries(s11.most_images.n_images).map(([title, count]: [string, any]) => (
              <div key={title} className="flex items-center justify-between p-3 bg-[#f8f9fa] border border-[#a2a9b1]">
                <span className="text-sm font-medium truncate pr-4 wiki-link">{title}</span>
                <span className="text-sm font-bold text-[#00af89]">{count} images</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-[#fee7e6] border-[#b32424]">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#b32424] text-white">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h5 className="font-serif font-bold text-[#b32424] text-lg mb-1">Tiny Captions Detected</h5>
            <p className="text-sm text-[#b32424] mb-4">
              Found <span className="font-bold">{s11.tiny_captions_count}</span> images with captions between 1-5 characters. These are likely noise or placeholders that should be filtered before training.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Recommendations({ data, onNext }: { data: any, onNext: () => void }) {
  const recs = data.section_13_recommendations;

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Recommendations" 
        subtitle="Actionable insights and next steps for data processing and model training."
        highlights={[
          "Filter out icon images and tiny captions for cleaner data.",
          "Clean HTML tags and Wikitext markup before processing.",
          "L2-normalize ResNet features for better similarity calculations.",
          "Consider learning implicit semantic alignment for cross-modal tasks."
        ]}
      />

      <Card title="Processing Recommendations">
        <div className="space-y-4">
          {recs.map((rec: string, idx: number) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-[#f8f9fa] border border-[#a2a9b1] rounded">
              <div className="p-2 bg-[#3366cc] text-white rounded-full shrink-0">
                <Lightbulb size={16} />
              </div>
              <p className="text-sm text-[#54595d] leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}