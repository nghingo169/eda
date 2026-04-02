import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  BarChart3,
  Image as ImageIcon,
  Type,
  ShieldAlert,
  Eye,
  Database,
  Info,
  ChevronDown,
  ChevronRight,
  FileCode,
  ExternalLink,
  MessageSquare,
  Repeat2,
  Heart,
  Share,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import PlotlyEmbed from './PlotlyEmbed';

// --- Components ---

const SidebarItem = ({ icon: Icon, active, onClick, label }: { icon: any; active: boolean; onClick: () => void; label: string }) => (
  <button 
    onClick={onClick}
    title={`Navigate to ${label}`}
    aria-label={`Navigate to ${label} section`}
    className={cn(
      "flex items-center justify-center p-3 rounded-full transition-colors w-12 h-12 mx-auto",
      active ? "bg-zinc-900" : "hover:bg-zinc-900"
    )}
  >
    <Icon size={26} className={active ? "text-blue-400" : "text-white"} />
  </button>
);

const TweetCard = ({ 
  title, 
  subtitle, 
  children, 
  sectionId, 
  onViewCode 
}: { 
  title: string, 
  subtitle?: string, 
  children: React.ReactNode, 
  sectionId?: string,
  onViewCode?: (id: string) => void
}) => {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 1000) + 100);
  const [retweets, setRetweets] = useState(Math.floor(Math.random() * 500) + 50);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);

  return (
    <div className="border-b border-zinc-800 p-4 hover:bg-zinc-950/50 transition-colors">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
          <Zap size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-bold text-white hover:underline cursor-pointer flex items-center gap-1">
                MMHS150K Analyzer
                <Zap size={14} className="text-blue-400 fill-blue-400" />
              </span>
              <span className="text-zinc-500 text-sm">@mmhs_eda · 2h</span>
            </div>
            <MoreHorizontal size={18} className="text-zinc-500 cursor-pointer" />
          </div>
          <div className="mt-1">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>}
          </div>
          <div className="mt-3 rounded-2xl border border-zinc-800 overflow-hidden bg-black">
            {children}
          </div>
          <div className="mt-3 flex items-center justify-between max-w-md text-zinc-500">
            <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <MessageSquare size={18} />
              </div>
              <span className="text-xs">{Math.floor(Math.random() * 50) + 5}</span>
            </div>
            <div 
              onClick={() => {
                setIsRetweeted(!isRetweeted);
                setRetweets(prev => isRetweeted ? prev - 1 : prev + 1);
              }}
              className={cn(
                "flex items-center gap-2 cursor-pointer transition-colors group",
                isRetweeted ? "text-green-400" : "hover:text-green-400"
              )}
            >
              <div className={cn("p-2 rounded-full", isRetweeted ? "bg-green-400/10" : "group-hover:bg-green-400/10")}>
                <Repeat2 size={18} />
              </div>
              <span className="text-xs">{retweets}</span>
            </div>
            <div 
              onClick={() => {
                setIsLiked(!isLiked);
                setLikes(prev => isLiked ? prev - 1 : prev + 1);
              }}
              className={cn(
                "flex items-center gap-2 cursor-pointer transition-colors group",
                isLiked ? "text-pink-400" : "hover:text-pink-400"
              )}
            >
              <div className={cn("p-2 rounded-full", isLiked ? "bg-pink-400/10" : "group-hover:bg-pink-400/10")}>
                <Heart size={18} className={isLiked ? "fill-pink-400" : ""} />
              </div>
              <span className="text-xs">{likes}</span>
            </div>
            {sectionId && onViewCode && (
              <div 
                onClick={() => onViewCode(sectionId)}
                className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                  <FileCode size={18} />
                </div>
                <span className="text-xs">Code</span>
              </div>
            )}
            <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <Share size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CodeModal = ({ isOpen, onClose, code, title }: { isOpen: boolean, onClose: () => void, code: string, title: string }) => {
  useEffect(() => {
    if (isOpen) Prism.highlightAll();
  }, [isOpen, code]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-xl text-white">{title} - Python Implementation</h3>
          <button onClick={onClose} title="Close code viewer" aria-label="Close code viewer" className="p-2 hover:bg-zinc-900 rounded-full text-white">
            <ChevronDown size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <pre className="rounded-xl overflow-hidden">
            <code className="language-python">{code}</code>
          </pre>
        </div>
      </motion.div>
    </div>
  );
};

// --- Constants ---

const DATASET_STATS = [
  { label: "Total Samples", value: "149,823" },
  { label: "Total Classes", value: "6" },
  { label: "Avg Words / Tweet", value: "12" },
  { label: "Avg Chars / Tweet", value: "85" },
  { label: "Min Words", value: "2" },
  { label: "Max Words", value: "38" },
  { label: "Median Words", value: "11" },
  { label: "Word Range", value: "2 - 38" },
];

const CLASS_DISTRIBUTION = [
  { name: "NotHate", count: 124005, percent: 82.77, avgWords: 11.6, avgChars: 85, color: "bg-emerald-500" },
  { name: "Racist", count: 12287, percent: 8.20, avgWords: 11.2, avgChars: 83, color: "bg-red-500" },
  { name: "OtherHate", count: 5811, percent: 3.88, avgWords: 11.2, avgChars: 88, color: "bg-orange-500" },
  { name: "Homophobe", count: 3886, percent: 2.59, avgWords: 10.9, avgChars: 80, color: "bg-purple-500" },
  { name: "Sexist", count: 3671, percent: 2.45, avgWords: 12.0, avgChars: 90, color: "bg-pink-500" },
  { name: "Religion", count: 163, percent: 0.11, avgWords: 12.6, avgChars: 105, color: "bg-yellow-500" },
];

const VOCAB_RICHNESS_DATA = [
  { name: "Religion", total: "1,856", unique: "1,079", richness: 58.14, color: "bg-yellow-500" },
  { name: "Sexist", total: "39,598", unique: "7,064", richness: 17.84, color: "bg-pink-500" },
  { name: "OtherHate", total: "59,379", unique: "10,243", richness: 17.25, color: "bg-orange-500" },
  { name: "Homophobe", total: "39,396", unique: "5,493", richness: 13.94, color: "bg-purple-500" },
  { name: "Racist", total: "125,178", unique: "14,817", richness: 11.84, color: "bg-red-500" },
  { name: "NotHate", total: "1,318,288", unique: "59,570", richness: 4.52, color: "bg-emerald-500" },
]; 

const FEATURE_DICTIONARY = [
  { name: 'id', type: 'Numerical', desc: 'Unique identifier for the tweet' },
  { name: 'img_url', type: 'Categorical', desc: 'URL to the image associated with the tweet' },
  { name: 'text', type: 'Categorical', desc: 'Text content of the tweet' },
  { name: 'labels', type: 'Numerical', desc: 'List of 3 integer labels (0-5)' },
  { name: 'labels_str', type: 'Categorical', desc: 'List of 3 string labels' },
  { name: 'tweet_url', type: 'Categorical', desc: 'Direct link to the original tweet' },
];

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'core', label: 'Core EDA', icon: Database },
  { id: 'text', label: 'Text EDA', icon: Type },
  { id: 'image', label: 'Image EDA', icon: ImageIcon },
  { id: 'classification', label: 'Classification', icon: BarChart3 },
  { id: 'ocr', label: 'OCR Analysis', icon: Search },
  { id: 'explainability', label: 'Explainability', icon: Eye },
  { id: 'insights', label: 'Key Insights', icon: Zap },
];

const CODE_SNIPPETS: Record<string, string> = {
  overview: `# Class Distribution Analysis
import pandas as pd
import plotly.express as px

# Load dataset
df = pd.read_csv('MMHS150K.csv')

# Class Distribution
class_counts = df['majority_name'].value_counts().reset_index()
fig = px.bar(class_counts, x='majority_name', y='count', 
             color='majority_name', title='Class Distribution',
             color_discrete_sequence=px.colors.qualitative.Safe)
fig.update_layout(template='plotly_dark')
fig.show()

# Class Summary Table
summary = df.groupby('majority_name').agg({
    'tweet_text': ['count', lambda x: x.str.len().mean()]
}).reset_index()
# ... table generation logic`,
  core: `# Dataset Scale & Missing Data
import plotly.graph_objects as go

# Split Distribution
split_counts = df['split'].value_counts()
fig = go.Figure(data=[go.Pie(labels=split_counts.index, values=split_counts.values)])
fig.update_layout(title='Dataset Split Distribution', template='plotly_dark')

# Missing Data
missing = df.isnull().sum() / len(df) * 100
fig_missing = px.bar(x=missing.index, y=missing.values, title='Missing Data %')

# Tweet Flags (Hashtags, Mentions, URLs)
df['has_hashtag'] = df['tweet_text'].str.contains('#')
df['has_mention'] = df['tweet_text'].str.contains('@')
df['has_url'] = df['tweet_text'].str.contains('http')`,
  text: `# Text Analysis: N-grams & TF-IDF
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
import plotly.express as px

# Top Words per Class
def get_top_words(text_col, n=20):
    vec = TfidfVectorizer(stop_words='english').fit(text_col)
    bag_of_words = vec.transform(text_col)
    sum_words = bag_of_words.sum(axis=0) 
    words_freq = [(word, sum_words[0, idx]) for word, idx in vec.vocabulary_.items()]
    return sorted(words_freq, key=lambda x: x[1], reverse=True)[:n]

# Vocabulary Jaccard Similarity
def jaccard_similarity(list1, list2):
    intersection = len(list(set(list1).intersection(list2)))
    union = (len(list1) + len(list2)) - intersection
    return float(intersection) / union`,
  image: `# Image Property Analysis
from PIL import Image
import numpy as np

# Extracting RGB distributions
def get_color_stats(img_path):
    img = Image.open(img_path).convert('RGB')
    data = np.array(img)
    return [np.mean(data[:,:,i]) for i in range(3)]

# Person Detection with YOLOv8
from ultralytics import YOLO
model = YOLO('yolov8n.pt')
results = model.predict(source='images/', classes=[0]) # Class 0 is 'person'`,
  classification: `# Feature Clustering with t-SNE & UMAP
from sklearn.manifold import TSNE
import umap
import plotly.express as px

# ResNet50 Feature Projection
# features = model.predict(images)
tsne = TSNE(n_components=2, perplexity=30)
projections = tsne.fit_transform(features)

fig = px.scatter(projections, x=0, y=1, color=labels,
                 title='t-SNE of ResNet50 Features')
fig.update_layout(template='plotly_dark')`,
  ocr: `# OCR Analysis with EasyOCR
import easyocr
reader = easyocr.Reader(['en'])

def process_ocr(img_path):
    results = reader.readtext(img_path)
    text = " ".join([res[1] for res in results])
    return text, len(text.split())

# Meme Ratio: Images containing text vs not
df['has_text'] = df['ocr_text'].apply(lambda x: len(str(x)) > 0)
meme_stats = df.groupby('majority_name')['has_text'].mean()`,
  explainability: `# Explainability: Grad-CAM & Text Positioning
import torch
from pytorch_grad_cam import GradCAM

# Grad-CAM for ResNet50
target_layers = [model.layer4[-1]]
cam = GradCAM(model=model, target_layers=target_layers)
grayscale_cam = cam(input_tensor=input_tensor)

# Text Position (Y-coordinate of OCR boxes)
def get_text_y_pos(ocr_results):
    # Extract average Y position of bounding boxes
    return [np.mean([p[1] for p in res[0]]) for res in ocr_results]`,
  insights: `# Key Insights Summary
# 1. Class Imbalance: 'Not Hate' dominates (80%+)
# 2. Multimodal Synergy: Hate often relies on image context
# 3. OCR Importance: 30% of hate tweets have embedded text
# 4. Model Bias: Attention often fixates on specific demographics`,
};

const InsightCard = ({ insights }: { insights: string[] }) => (
  <div className="mx-4 mb-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4 text-blue-400">
      <Zap size={20} fill="currentColor" />
      <h3 className="font-bold uppercase tracking-widest text-sm">Key Section Insights</h3>
    </div>
    <ul className="space-y-3">
      {insights.map((insight, i) => (
        <li key={i} className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
          <span className="text-blue-500 font-bold">•</span>
          {insight}
        </li>
      ))}
    </ul>
  </div>
);

export default function MMHS150K_EDA() {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCode, setSelectedCode] = useState<{ id: string, title: string } | null>(null);

  const handleViewCode = (id: string, title: string) => {
    setSelectedCode({ id, title });
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    SECTIONS.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-[1000px] mx-auto flex">
        
        {/* Left Sidebar */}
        <aside className="w-[72px] h-screen sticky top-0 flex flex-col p-2 border-r border-zinc-800 shrink-0">
          <div className="p-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <ShieldAlert size={24} className="text-white" />
            </div>
          </div>
          <nav className="flex-1 space-y-4">
            {SECTIONS.map((s) => (
              <SidebarItem 
                key={s.id} 
                icon={s.icon} 
                label={s.label}
                active={activeSection === s.id} 
                onClick={() => scrollToSection(s.id)}
              />
            ))}
          </nav>
          <div className="mt-auto p-3 flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center hover:bg-zinc-600 cursor-pointer transition-colors">
              <User size={20} />
            </div>
            <button title="Create new post" aria-label="Create new post" className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-full transition-colors">
              <Zap size={24} />
            </button>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-zinc-800 p-4">
            <h2 className="text-xl font-bold">MMHS150K EDA</h2>
          </header>
          
          <div className="pb-20">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-20">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <TweetCard 
                  title="Multimodal Hate Speech Dataset (MMHS150K)" 
                  subtitle="Dataset Overview & Description"
                  sectionId="overview"
                  onViewCode={(id) => handleViewCode(id, "Dataset Overview")}
                >
                  <div className="p-6 space-y-8">
                    
                    <p className="text-zinc-300 leading-relaxed">
                      MMHS150K is a manually annotated multimodal hate speech dataset formed by 150,000 tweets, each containing text and an image.
                    </p>

                    {/* General Statistics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {DATASET_STATS.map((s, i) => (
                        <div key={i} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                          <div className="text-zinc-500 text-xs uppercase font-bold">{s.label}</div>
                          <div className="text-2xl font-black text-blue-400">{s.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Class Distribution Chart (Replaces the raw table) */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                        Class Distribution & Metrics
                      </h4>
                      <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 space-y-4">
                        {CLASS_DISTRIBUTION.map((cls, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-end text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-zinc-200">{cls.name}</span>
                                <span className="text-zinc-500 text-xs">({cls.count.toLocaleString()} samples)</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-zinc-300">{cls.percent}%</span>
                              </div>
                            </div>
                            {/* Visual Bar */}
                            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${cls.color} rounded-full`} 
                                style={{ "--bar-w": `${Math.max(cls.percent, 0.5)}%`, width: "var(--bar-w)" } as React.CSSProperties}
                              />
                            </div>
                            {/* Extra Metrics (Words/Chars) */}
                            <div className="flex gap-4 text-[10px] text-zinc-500 font-mono pt-1">
                              <span>Avg Words: {cls.avgWords}</span>
                              <span>Avg Chars: {cls.avgChars}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feature Dictionary */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                        Feature Dictionary
                      </h4>
                      <div className="overflow-hidden rounded-xl border border-zinc-800 overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-zinc-900 text-zinc-500 uppercase font-bold">
                            <tr>
                              <th className="p-3">Feature</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                            {FEATURE_DICTIONARY.map((f, i) => (
                              <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                                <td className="p-3 font-bold text-blue-400">{f.name}</td>
                                <td className="p-3 text-zinc-400">{f.type}</td>
                                <td className="p-3 text-zinc-500">{f.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                      <Info className="text-blue-400 shrink-0" size={20} />
                      <p className="text-sm text-blue-100">
                        Annotated using Amazon Mechanical Turk with 6 categories. Each tweet labeled by 3 different workers.
                      </p>
                    </div>
                  </div>
                </TweetCard>

                <TweetCard 
                  title="Class Distribution - 6-Category Label Breakdown" 
                  subtitle="Severe imbalance: NotHate dominates at 82.77%, while Religion accounts for just 0.11% of all samples"
                  sectionId="overview"
                  onViewCode={(id) => handleViewCode(id, "Class Distribution")}
                >
                  <PlotlyEmbed src="/hate/51_class_distribution.html" height={400} />
                </TweetCard>

                <TweetCard 
                  title="Annotator Confusion Matrix - Inter-Rater Disagreement" 
                  subtitle="Where 3 MTurk workers diverge most: 'OtherHate' and 'Racist' show the highest labeling ambiguity"
                  sectionId="overview"
                  onViewCode={(id) => handleViewCode(id, "Annotator Analysis")}
                >
                  <PlotlyEmbed src="/hate/53_annotator_confusion.html" height={500} />
                </TweetCard>

                <InsightCard 
                  insights={[
                    "Extreme class imbalance: ~86% of the dataset is labeled as 'Not Hate', making it a challenging task for model training.",
                    "Annotator disagreement is highest in 'Other Hate' and 'Racist' categories, suggesting subjective boundaries in hate speech definition.",
                    "The 'Not Hate' class has the highest confidence among annotators, while multimodal hate often requires more context for consensus."
                  ]}
                />
              </motion.div>
            </section>

            {/* Core EDA Section */}
            <section id="core" className="scroll-mt-20">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <TweetCard 
                  title="Dataset Scale - Train / Val / Test Split Sizes" 
                  subtitle="149,823 total tweets partitioned across 3 splits; verifying no data leakage between splits"
                  sectionId="core"
                  onViewCode={(id) => handleViewCode(id, "Dataset Scale")}
                >
                  <PlotlyEmbed src="/hate/21_dataset_scale.html" height={400} />
                </TweetCard>

                <TweetCard 
                  title="Missing Data Analysis - Field Completeness Check" 
                  subtitle="Percentage of null/empty values per column; critical for deciding imputation vs. dropping strategies"
                  sectionId="core"
                  onViewCode={(id) => handleViewCode(id, "Missing Data")}
                >
                  <PlotlyEmbed src="/hate/8_missing_data.html" height={400} />
                </TweetCard>

                { 
                <TweetCard 
                  title="Word Count Distribution - Tokens per Tweet" 
                  subtitle="Histogram of word counts across all classes; avg ≈ 12 words, range 2–38 words per tweet"
                  sectionId="core"
                  onViewCode={(id) => handleViewCode(id, "Word Counts")}
                >
                  <PlotlyEmbed src="/hate/11_word_count_hist.html" height={400} />
                </TweetCard>
                }

                <TweetCard 
                  title="Character Count Distribution - Tweet Length in Raw Characters" 
                  subtitle="Avg ≈ 85 chars; 'Sexist' class is wordiest (avg 90 chars), 'Homophobe' is shortest (avg 80 chars)"
                  sectionId="core"
                  onViewCode={(id) => handleViewCode(id, "Character Counts")}
                >
                  <PlotlyEmbed src="/hate/33a_char_count_hist.html" height={400} />
                </TweetCard>

                <TweetCard 
                  title="Tweet Flags - Hashtags, Mentions & URL Presence by Class" 
                  subtitle="Binary feature breakdown showing how hate speech classes differ in their use of @mentions, #tags and embedded links"
                  sectionId="core"
                  onViewCode={(id) => handleViewCode(id, "Tweet Flags")}
                >
                  <PlotlyEmbed src="/hate/33b_tweet_flags.html" height={400} />
                </TweetCard>

                <InsightCard 
                  insights={[
                    "Data integrity is high: Missing values are negligible across core text and image fields.",
                    "Tweet length distribution peaks around 100-150 characters, consistent with standard Twitter usage patterns.",
                    "High frequency of mentions and hashtags across all classes indicates the highly social and topical nature of the content."
                  ]}
                />
              </motion.div>
            </section>

            {/* Text EDA Section */}
            <section id="text" className="scroll-mt-20">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <TweetCard 
                  title="Overall Frequent Words" 
                  subtitle="Top words across the entire dataset"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Frequent Words")}
                >
                  <PlotlyEmbed src="/hate/35_overall_frequent_words.html" height={450} />
                </TweetCard>

                <TweetCard 
                  title="Top Words per Class" 
                  subtitle="Most common terms by category"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Words per Class")}
                >
                  <PlotlyEmbed src="/hate/36_top_words_per_class.html" height={600} />
                </TweetCard>

                { 
                <TweetCard 
                  title="Vocabulary Richness - Lexical Diversity per Class (Type-Token Ratio)" 
                  subtitle="Religion class leads with 58% richness despite tiny size; NotHate has the lowest diversity at 4.52% due to volume"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Vocab Richness")}
                >
                  <div className="overflow-x-auto rounded-b-2xl">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="bg-zinc-900 text-zinc-500 uppercase text-xs font-bold border-b border-zinc-800">
                        <tr>
                          <th className="px-6 py-4">Class</th>
                          <th className="px-6 py-4 text-right">Total Words</th>
                          <th className="px-6 py-4 text-right">Unique Words</th>
                          <th className="px-6 py-4 text-right">Lexical Richness</th>
                          <th className="px-6 py-4 w-1/3">Percentage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 bg-black">
                        {VOCAB_RICHNESS_DATA.map((cls, i) => (
                          <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-zinc-200">{cls.name}</td>
                            <td className="px-6 py-4 text-right text-zinc-400 font-mono">{cls.total}</td>
                            <td className="px-6 py-4 text-right text-zinc-400 font-mono">{cls.unique}</td>
                            <td className="px-6 py-4 text-right font-bold text-zinc-300">{cls.richness}%</td>
                            <td className="px-6 py-4">
                              <div className="w-full min-w-[150px] flex items-center">
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${cls.color} rounded-full`} 
                                    style={{ "--bar-w": `${cls.richness}%`, width: "var(--bar-w)" } as React.CSSProperties}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TweetCard>
                }

                <TweetCard 
                  title="Unique Vocabulary per Class" 
                  subtitle="Distinct terms exclusive to each class"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Unique Vocab")}
                >
                  <PlotlyEmbed src="/hate/37_unique_vocab_per_class.html" height={450} />
                </TweetCard>

                <TweetCard 
                  title="TF-IDF Analysis - Class-Discriminative Terms per Category" 
                  subtitle="Top statistically weighted tokens that uniquely identify each hate class vs. the rest of the corpus"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "TF-IDF Analysis")}
                >
                  <PlotlyEmbed src="/hate/38_tfidf_per_class.html" height={600} stackSubplots={true}/>
                </TweetCard>

                <TweetCard 
                  title="Bigrams Analysis (Stopwords Removed)" 
                  subtitle="Top word pairs by category"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Bigrams Set 1")}
                >
                  <PlotlyEmbed src="/hate/16_bigrams_per_class.html" height={750} stackSubplots={true} />
                </TweetCard>

                <TweetCard 
                  title="Trigrams Analysis (Stopwords Removed)" 
                  subtitle="Top word triplets by category"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Trigrams Analysis")}
                >
                  <PlotlyEmbed src="/hate/39_trigrams_per_class.html" height={750} stackSubplots={true}/>
                </TweetCard>

                <TweetCard 
                  title="Stopword Rate per Class" 
                  subtitle="Proportion of stopwords in tweets"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Stopword Analysis")}
                >
                  <PlotlyEmbed src="/hate/34_stopword_rate_per_class.html" height={400} />
                </TweetCard>

                <TweetCard 
                  title="Word Clouds" 
                  subtitle="Font size ∝ word frequency; reveals dominant slurs and themes that define each class's vocabulary"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Word Clouds")}
                >
                  <div className="p-4 bg-white">
                    <img src="/hate/wordclouds.png" alt="Word Clouds" className="w-full h-auto rounded-xl" referrerPolicy="no-referrer" />
                  </div>
                </TweetCard>

                <TweetCard 
                  title="Vocabulary Jaccard Similarity" 
                  subtitle="Top-500 words overlap"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Jaccard Similarity")}
                >
                  <PlotlyEmbed src="/hate/17_vocab_jaccard.html" height={500} />
                </TweetCard>

                <TweetCard 
                  title="Class Cosine Similarity - TF-IDF Vector Space Proximity" 
                  subtitle="Pairwise similarity of class-level document vectors; high score = overlapping vocabulary between two hate categories"
                  sectionId="text"
                  onViewCode={(id) => handleViewCode(id, "Cosine Similarity Alt")}
                >
                  <PlotlyEmbed src="/hate/312_class_cosine_similarity.html" height={500} />
                </TweetCard>

                <InsightCard 
                  insights={[
                    "Vocabulary overlap: 'Racist' and 'Sexist' classes share significant aggressive terminology, while 'Not Hate' uses more neutral, common English.",
                    "Bigram analysis reveals that hate speech often relies on specific derogatory pairings rather than isolated words.",
                    "TF-IDF weighting successfully isolates class-specific slurs that are highly predictive of hate speech categories."
                  ]}
                />
              </motion.div>
            </section>

            {/* Image EDA Section */}
            <section id="image" className="scroll-mt-20">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <TweetCard 
                  title="Image Dimensions & Aspect Ratio Dashboard" 
                  subtitle="Analysis of width vs height, top resolutions and aspect ratio distributions"
                  sectionId="image"
                  onViewCode={(id) => handleViewCode(id, "Image Dimensions Dashboard")}
                >
                  {/* Đã tăng height lên 800 để hiển thị đủ 2 hàng biểu đồ của dashboard */}
                  <PlotlyEmbed src="/hate/41_image_dimensions_dashboard.html" height={800} />
                </TweetCard>

                <TweetCard 
                  title="Image Quality & Color Dashboard" 
                  subtitle="Analysis of brightness, contrast, sharpness and RGB channels"
                  sectionId="image"
                  onViewCode={(id) => handleViewCode(id, "Color Quality Dashboard")}
                >
                  {/* Đã tăng height lên 800 để hiển thị đủ không gian cho 4 biểu đồ (2x2 grid) */}
                  <PlotlyEmbed src="/hate/42_color_quality_dashboard.html" height={800} />
                </TweetCard>

                <TweetCard 
                  title="Person Detection Rate" 
                  subtitle="Proportion of images containing people (YOLO)"
                  sectionId="image"
                  onViewCode={(id) => handleViewCode(id, "Person Detection")}
                >
                  <PlotlyEmbed src="/hate/23_person_detection_rate.html" height={400} stackSubplots={true} />
                </TweetCard>

                <InsightCard 
                  insights={[
                    "Image-Text correlation: Hate speech tweets are significantly more likely to contain images of people compared to neutral tweets, often targeting specific individuals or groups.",
                    "Color distribution is relatively uniform across classes, suggesting that low-level visual features (like brightness or saturation) alone are insufficient for hate speech detection.",
                    "Aspect ratios are predominantly 1:1 (square) or 4:3, which are typical for social media mobile uploads and memes.",
                    "The scatter plot of dimensions shows a high density of images at standard web resolutions (e.g., 500x500, 1024x768), indicating that most content is native to social platforms rather than professional photography.",
                    "Outliers in image dimensions often correspond to long screenshots or banners, which sometimes contain multi-panel memes or long text-based hate content."
                  ]}
                />
              </motion.div>
            </section>

            {/* Classification EDA Section */}
            <section id="classification" className="scroll-mt-20">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <TweetCard 
                  title="t-SNE Projection - ResNet50 Visual Embeddings in 2D" 
                  subtitle="Non-linear dimensionality reduction (perplexity=30) revealing local cluster structure; overlapping regions = visually ambiguous hate content"
                  sectionId="classification"
                  onViewCode={(id) => handleViewCode(id, "t-SNE Analysis")}
                >
                  <PlotlyEmbed src="/hate/54_tsne_resnet50.html" height={600} />
                </TweetCard>

                <TweetCard 
                  title="UMAP Projection - ResNet50 Visual Embeddings in 2D" 
                  subtitle="Global topology-preserving reduction; compared to t-SNE, UMAP better preserves inter-cluster distances across hate categories"
                  sectionId="classification"
                  onViewCode={(id) => handleViewCode(id, "UMAP Analysis")}
                >
                  <PlotlyEmbed src="/hate/55_umap_resnet50.html" height={600} />
                </TweetCard>

                <InsightCard 
                  insights={[
                    "Visual embeddings (ResNet50) show that 'Sexist' and 'Racist' images often cluster together, indicating similar visual motifs (e.g., memes, specific person types).",
                    "The large overlap in t-SNE/UMAP space between 'Not Hate' and other classes confirms that visual features alone are often ambiguous.",
                    "Multimodal fusion is likely required as visual clusters don't perfectly align with text-based hate labels."
                  ]}
                />
              </motion.div>
            </section>

            {/* OCR Analysis Section */}
            <section id="ocr" className="scroll-mt-20">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>

                <TweetCard 
                  title="OCR Coverage" 
                  subtitle="Proportion of samples with OCR text per class"
                  sectionId="ocr"
                  onViewCode={(id) => handleViewCode(id, "OCR Coverage")}
                >
                  <PlotlyEmbed src="/hate/18_ocr_coverage.html" height={400} />
                </TweetCard>

                <TweetCard 
                  title="OCR Word Count" 
                  subtitle="Number of words detected in images"
                  sectionId="ocr"
                  onViewCode={(id) => handleViewCode(id, "OCR Word Count")}
                >
                  <PlotlyEmbed src="/hate/61_ocr_word_count.html" height={400} />
                </TweetCard>

                <InsightCard 
                  insights={[
                    "Meme prevalence: Over 40% of hate speech images contain embedded text (OCR), compared to less than 20% in the 'Not Hate' category. This confirms that memes are a primary vehicle for hate speech on Twitter.",
                    "OCR coverage is a strong indicator of multimodal hate, where the offensive content is often contained within the image text rather than the tweet body. Models that ignore image text will likely fail on these samples.",
                    "OCR word counts are typically low (3-10 words), suggesting punchy, high-impact text used in memes to maximize emotional response and shareability.",
                    "Class-specific OCR: 'Racist' and 'Sexist' classes show significantly higher OCR coverage, indicating a heavy reliance on visual propaganda and stereotyped memes.",
                    "The overlap between tweet text and OCR text is often low, meaning the image text provides unique, complementary information that isn't present in the metadata."
                  ]}
                />
              </motion.div>
            </section>

            {/* Explainability Section */}
            <section id="explainability" className="scroll-mt-20">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <TweetCard 
                  title="OCR Text Position Analysis - Vertical Placement of Embedded Text" 
                  subtitle="Violin plot of normalized Y-coordinates; peaks near 0.1 & 0.9 confirm classic top/bottom meme text format"
                  sectionId="explainability"
                  onViewCode={(id) => handleViewCode(id, "Text Positioning")}
                >
                  <PlotlyEmbed src="/hate/71_text_position_violin.html" height={500} />
                </TweetCard>

                <TweetCard 
                  title="Grad-CAM Visualization - Where the Model Looks to Classify Hate" 
                  subtitle="Heatmaps overlaid on input images show that the model prioritizes embedded text regions and faces as primary decision signals"
                  sectionId="explainability"
                  onViewCode={(id) => handleViewCode(id, "Grad-CAM")}
                >
                  <div className="p-4 bg-white">
                    <img src="/hate/gradcam.png" alt="Grad-CAM" className="w-full h-auto rounded-xl" referrerPolicy="no-referrer" />
                  </div>
                </TweetCard>

                <InsightCard 
                  insights={[
                    "Model focus: Grad-CAM reveals that the model heavily prioritizes text regions within images when they are present, confirming the importance of OCR features.",
                    "Text Positioning: OCR text in memes is often concentrated at the top or bottom of the image (standard meme format). The violin plot shows distinct peaks at these vertical positions (0.1 and 0.9 normalized height).",
                    "YOLO Objects: The presence of specific objects like 'person' varies by class. 'Sexist' content often features 'person' detections more frequently, often targeting individuals.",
                    "In images without text, the model often focuses on facial features or specific symbolic objects identified by YOLO, which can be 'triggers' for hate speech labels.",
                    "Explainability analysis suggests that the model is learning to associate specific visual motifs (like certain flags, symbols, or facial expressions) with hate speech categories.",
                    "The distribution of objects across classes helps identify potential dataset biases, such as certain objects being over-represented in specific hate categories."
                  ]}
                />
              </motion.div>
            </section>

{/* Key Insights Section */}
            <section id="insights" className="scroll-mt-20">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
 
                {/* ── Pillar 1: Dataset Characteristics ── */}
                <TweetCard
                  title="Dataset Characteristics - What the Data Tells Us"
                  subtitle="Structural properties uncovered across all 5 EDA dimensions: scale, balance, text, image, and annotations"
                  sectionId="insights"
                  onViewCode={(id) => handleViewCode(id, "Dataset Characteristics")}
                >
                  <div className="p-6 space-y-5">
                    {/* Scale & Structure */}
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Database size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Scale &amp; Structure</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          149,823 multimodal tweets across 6 hate categories. Each sample carries <span className="text-zinc-200 font-semibold">3 independent labels</span> from Amazon MTurk workers, enabling majority-vote aggregation and inter-annotator agreement analysis. Features span numerical IDs, categorical text/URLs, and raw image data - requiring a heterogeneous preprocessing pipeline.
                        </p>
                      </div>
                    </div>
 
                    <div className="border-t border-zinc-800/60" />
 
                    {/* Class Imbalance */}
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                        <BarChart3 size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Severe Class Imbalance</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          <span className="text-zinc-200 font-semibold">NotHate = 82.77%</span> of all samples; the smallest class (Religion) holds only <span className="text-zinc-200 font-semibold">0.11% (163 samples)</span> - a 760× ratio. This imbalance directly mirrors real-world social media distributions but poses a critical threat to model recall on minority hate classes.
                        </p>
                      </div>
                    </div>
 
                    <div className="border-t border-zinc-800/60" />
 
                    {/* Text Characteristics */}
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Type size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Text Characteristics</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Tweets are uniformly short (avg 12 words, 85 chars), leaving little lexical context per sample. Despite this, TF-IDF and n-gram analysis reveal <span className="text-zinc-200 font-semibold">class-specific vocabulary signatures</span>: Racist class clusters around racial slurs; Sexist class around gendered derogatory terms. Vocabulary richness (Type-Token Ratio) is inversely correlated with class size - Religion (58%) vs NotHate (4.52%).
                        </p>
                      </div>
                    </div>
 
                    <div className="border-t border-zinc-800/60" />
 
                    {/* Visual Characteristics */}
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ImageIcon size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Visual Characteristics</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Images are predominantly square (1:1) or 4:3, native to mobile social media. Low-level features (brightness, RGB) are <span className="text-zinc-200 font-semibold">not discriminative</span> across classes. However, <span className="text-zinc-200 font-semibold">OCR coverage (&gt;40% in hate classes vs &lt;20% in NotHate)</span> and person-detection rate (YOLO) are strong structural signals. t-SNE/UMAP projections of ResNet50 embeddings reveal significant overlap, confirming that visual features alone are insufficient.
                        </p>
                      </div>
                    </div>
 
                    <div className="border-t border-zinc-800/60" />
 
                    {/* Annotation Quality */}
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                        <ShieldAlert size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Annotation Quality &amp; Subjectivity</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Annotator confusion is highest in <span className="text-zinc-200 font-semibold">OtherHate and Racist</span> categories - the semantic boundaries of these classes are inherently subjective. NotHate achieves the highest consensus, reinforcing that "absence of hate" is easier to agree on than its nuanced presence. This subjectivity limits the achievable ceiling accuracy for any model.
                        </p>
                      </div>
                    </div>
                  </div>
                </TweetCard>
 
                {/* ── Pillar 2: Recommendations ── */}
                <TweetCard
                  title="Recommendations - From EDA to Modeling Strategy"
                  subtitle="Concrete actions derived from data evidence: what to fix, what to engineer, and what algorithm choices EDA justifies"
                  sectionId="insights"
                  onViewCode={(id) => handleViewCode(id, "Recommendations")}
                >
                  <div className="p-6 space-y-4">
                    {[
                      {
                        num: "01",
                        color: "border-blue-500",
                        bg: "bg-blue-500/10",
                        label: "Handle Class Imbalance",
                        icon: <BarChart3 size={15} />,
                        iconColor: "text-blue-400",
                        body: "Apply class-weighted cross-entropy loss (weight ∝ 1/class_freq) as the primary strategy. Supplement with SMOTE oversampling on text embeddings for minority classes (Religion, Homophobe). Avoid pure undersampling - it would discard 100k+ NotHate samples that carry useful negative-class signal."
                      },
                      {
                        num: "02",
                        color: "border-purple-500",
                        bg: "bg-purple-500/10",
                        label: "Prioritize Multimodal Fusion",
                        icon: <Zap size={15} />,
                        iconColor: "text-purple-400",
                        body: "Neither text nor image alone is sufficient (confirmed by t-SNE overlap + low OCR-to-tweet-text correlation). Adopt a late-fusion or cross-attention architecture that jointly encodes tweet text (BERT/RoBERTa) and image features (ResNet50/ViT). OCR text should be treated as a third input modality, not discarded."
                      },
                      {
                        num: "03",
                        color: "border-emerald-500",
                        bg: "bg-emerald-500/10",
                        label: "Feature Engineering Priorities",
                        icon: <Database size={15} />,
                        iconColor: "text-emerald-400",
                        body: "High-value engineered features identified by EDA: (1) has_ocr_text (binary), (2) ocr_word_count, (3) ocr_y_position (top/bottom/center), (4) has_person_yolo (binary), (5) tweet_flag composite (hashtag + mention + url booleans). These low-cost features showed strong class separation without deep learning."
                      },
                      {
                        num: "04",
                        color: "border-orange-500",
                        bg: "bg-orange-500/10",
                        label: "Text Preprocessing Pipeline",
                        icon: <Type size={15} />,
                        iconColor: "text-orange-400",
                        body: "EDA confirms stopword rate is high and uniform across classes - stopwords add noise, not signal. Pipeline: (1) lowercase → (2) remove URLs/mentions → (3) remove stopwords → (4) TF-IDF or subword tokenization. For deep models, keep raw text but mask @mentions/URLs with special tokens ([USER], [URL]) to reduce vocabulary noise."
                      },
                      {
                        num: "05",
                        color: "border-red-500",
                        bg: "bg-red-500/10",
                        label: "Evaluation Strategy",
                        icon: <ShieldAlert size={15} />,
                        iconColor: "text-red-400",
                        body: "Do NOT use accuracy as the primary metric - the 82.77% NotHate baseline makes it misleading. Use macro-averaged F1 to treat all 6 classes equally, plus per-class Precision/Recall to track minority class performance. Set a minimum Recall threshold (e.g., ≥0.50) on all hate classes as a non-negotiable safety criterion."
                      },
                    ].map((item) => (
                      <div key={item.num} className={`${item.bg} border-l-4 ${item.color} rounded-r-xl p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-black font-mono ${item.iconColor}`}>{item.num}</span>
                          <span className={item.iconColor}>{item.icon}</span>
                          <h4 className="text-sm font-black text-white uppercase tracking-wide">{item.label}</h4>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </TweetCard>
 
                {/* ── Pillar 3: Interesting Insights ── */}
                <TweetCard
                  title="Interesting Insights - Unexpected Findings from EDA"
                  subtitle="Counter-intuitive patterns, surprising correlations, and data storytelling moments that go beyond surface statistics"
                  sectionId="insights"
                  onViewCode={(id) => handleViewCode(id, "Interesting Insights")}
                >
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          emoji: "🔬",
                          title: "Short text ≠ simple classification",
                          body: "With only 12 words on average, MMHS150K tweets are extremely short - yet the classification task is harder than longer documents. Bigram/trigram analysis shows hate is encoded in dense, context-dependent phrase pairs rather than single slurs, making bag-of-words approaches particularly fragile."
                        },
                        {
                          emoji: "🎭",
                          title: "The Meme Effect: OCR as a hate signal",
                          body: "Over 40% of hate images contain embedded text (OCR), vs <20% in NotHate. This means memes - not raw offensive language - are the dominant vehicle for hate on Twitter. A model blind to image text will miss the majority of the most virulent content."
                        },
                        {
                          emoji: "🧬",
                          title: "Religion class: tiny size, rich vocabulary",
                          body: "Despite having only 163 samples (0.11%), the Religion class has a Type-Token Ratio of 58% - the highest of all classes. This suggests extreme lexical diversity within the class, making it both the hardest to model (data scarcity) and the most linguistically unique (no vocabulary repetition)."
                        },
                        {
                          emoji: "🎯",
                          title: "Visual features cluster hate - but not cleanly",
                          body: "t-SNE and UMAP of ResNet50 embeddings show that Sexist and Racist images cluster together, sharing visual motifs (meme templates, person-centric compositions). Yet both clusters heavily overlap with NotHate, proving that hate is a semantic property of content, not a visual style."
                        },
                        {
                          emoji: "📐",
                          title: "Meme anatomy confirmed: text at top & bottom",
                          body: "OCR bounding box Y-coordinates form a bimodal distribution with peaks at 0.1 and 0.9 (normalized image height). This statistically confirms the classic 'Impact font top + bottom' meme layout is the dominant text positioning pattern in hateful images."
                        },
                        {
                          emoji: "⚖️",
                          title: "Human annotators disagree most where it matters most",
                          body: "OtherHate and Racist show the highest inter-annotator disagreement - precisely the classes where false negatives (missed hate) are most socially harmful. This creates a fundamental annotation ceiling: if humans disagree, any model label derived from majority vote is inherently noisy for the hardest cases."
                        },
                      ].map((item, i) => (
                        <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-colors">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl leading-none mt-0.5">{item.emoji}</span>
                            <div>
                              <h4 className="text-sm font-black text-white mb-1 leading-snug">{item.title}</h4>
                              <p className="text-xs text-zinc-400 leading-relaxed">{item.body}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
 
                    <div className="border-t border-zinc-800 pt-6 text-center">
                      <p className="text-blue-400 italic font-bold text-base leading-relaxed max-w-xl mx-auto">
                        "Effective hate speech detection requires understanding not just what words are used, but how text, image, and cultural context combine - a challenge that EDA alone can illuminate, but only multimodal models can solve."
                      </p>
                    </div>
                  </div>
                </TweetCard>
 
                <InsightCard
                  insights={[
                    "EDA Objective: Structure confirmed - 149,823 multimodal samples, 6 heterogeneous feature types, 3-annotator labeling scheme requiring majority-vote resolution.",
                    "EDA Objective: Data cleaning is low-cost - missing values are negligible; the real quality issue is annotation subjectivity, not raw data corruption.",
                    "EDA Objective: Patterns found - OCR coverage, person detection rate, and class-specific n-grams are the three strongest univariate predictors of hate class.",
                    "EDA Objective: Algorithm direction set - multimodal late-fusion with weighted loss is the evidence-backed choice; linear separability is ruled out by t-SNE/UMAP overlap.",
                    "EDA Objective: Story told - the dataset reveals that online hate in 2020s Twitter is primarily meme-driven, visually generic but textually targeted, and semantically context-dependent."
                  ]}
                />
              </motion.div>
            </section>
          </div>
 
        </main>
      </div>
 
      {/* Code Modal */}
      <CodeModal 
        isOpen={!!selectedCode} 
        onClose={() => setSelectedCode(null)} 
        code={selectedCode ? CODE_SNIPPETS[selectedCode.id] || '# No snippet available' : ''} 
        title={selectedCode?.title || ''}
      />
    </div>
  );
}
 