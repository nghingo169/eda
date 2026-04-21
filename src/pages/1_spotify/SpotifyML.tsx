import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  BarChart3,
  Brain,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Database,
  Info,
  LayoutDashboard,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Clock3,
  Activity,
} from 'lucide-react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type PlotFigure = {
  data: Record<string, unknown>[];
  layout?: Record<string, unknown>;
};

type ModelResult = {
  id: string;
  name: string;
  family: string;
  cvRocAuc: number;
  cvF1: number;
  testAccuracy: number;
  testPrecision: number;
  testRecall: number;
  testF1: number;
  testRocAuc: number;
  speed: 'Very Fast' | 'Fast' | 'Medium' | 'Slow';
  interpretability: 'High' | 'Medium' | 'Low';
  strengths: string[];
  weaknesses: string[];
  note: string;
};

type BinaryConfusion = {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
};

const SPOTIFY_PLOT_CONFIG = {
  displayModeBar: false,
  displaylogo: false,
  responsive: true,
} as const;

const COLORS = {
  green: '#1DB954',
  black: '#191414',
  blue: '#3B82F6',
  pink: '#E91E63',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  red: '#EF4444',
  gray: '#6B7280',
  zinc: '#27272a',
};

const MODEL_COLOR_MAP: Record<string, string> = {
  'Dummy Baseline': COLORS.gray,
  LogisticRegression: COLORS.green,
  KNN: COLORS.blue,
  'Decision Tree': COLORS.orange,
  'Random Forest': COLORS.black,
  'Extra Trees': COLORS.pink,
  AdaBoost: COLORS.purple,
  'Gradient Boosting': '#10B981',
  'SVM (RBF)': '#6366F1',
  MLP: '#F43F5E',
};

const MODEL_RESULTS: ModelResult[] = [
  {
    id: 'rf',
    name: 'Random Forest',
    family: 'Ensemble Trees',
    cvRocAuc: 1.0,
    cvF1: 1.0,
    testAccuracy: 0.9895,
    testPrecision: 1.0,
    testRecall: 0.96,
    testF1: 0.9787,
    testRocAuc: 0.9997,
    speed: 'Medium',
    interpretability: 'Medium',
    strengths: [
      'Best overall ranking in the notebook',
      'Excellent balance between recall and precision',
      'Robust on mixed feature types after preprocessing',
    ],
    weaknesses: [
      'Less interpretable than linear models',
      'Heavier than simple baselines',
    ],
    note: 'Chosen as the best model in the notebook because it achieved nearly perfect ROC AUC and the strongest overall held-out performance.',
  },
  {
    id: 'dt',
    name: 'Decision Tree',
    family: 'Tree-Based',
    cvRocAuc: 1.0,
    cvF1: 1.0,
    testAccuracy: 0.9895,
    testPrecision: 0.98,
    testRecall: 1.0,
    testF1: 0.99,
    testRocAuc: 1.0,
    speed: 'Fast',
    interpretability: 'High',
    strengths: ['Easy to explain', 'Perfect recall on the test split', 'Very strong tree-based baseline'],
    weaknesses: ['Can overfit more easily than ensembles'],
    note: 'Very competitive, but the notebook selected Random Forest as the final winner.',
  },
  {
    id: 'ada',
    name: 'AdaBoost',
    family: 'Boosting',
    cvRocAuc: 1.0,
    cvF1: 1.0,
    testAccuracy: 0.9895,
    testPrecision: 0.98,
    testRecall: 1.0,
    testF1: 0.99,
    testRocAuc: 1.0,
    speed: 'Medium',
    interpretability: 'Medium',
    strengths: ['Strong classification boundary', 'Perfect recall on test split'],
    weaknesses: ['Less transparent than simple linear models'],
    note: 'Another top-tier model in the notebook with near-perfect discrimination.',
  },
  {
    id: 'gb',
    name: 'Gradient Boosting',
    family: 'Boosting',
    cvRocAuc: 1.0,
    cvF1: 1.0,
    testAccuracy: 0.9895,
    testPrecision: 0.98,
    testRecall: 1.0,
    testF1: 0.99,
    testRocAuc: 1.0,
    speed: 'Slow',
    interpretability: 'Low',
    strengths: ['Very strong predictive power', 'Excellent across all evaluation metrics'],
    weaknesses: ['More computationally expensive'],
    note: 'One of the strongest performers, but not selected as the notebook’s final model.',
  },
  {
    id: 'lr',
    name: 'LogisticRegression',
    family: 'Linear Model',
    cvRocAuc: 1.0,
    cvF1: 0.94,
    testAccuracy: 0.96,
    testPrecision: 0.95,
    testRecall: 0.88,
    testF1: 0.91,
    testRocAuc: 0.99,
    speed: 'Fast',
    interpretability: 'High',
    strengths: ['Simple and explainable', 'Excellent linear baseline', 'Very competitive ROC AUC'],
    weaknesses: ['Lower recall than top ensemble models'],
    note: 'Useful when interpretability matters more than squeezing out the last bit of performance.',
  },
  {
    id: 'et',
    name: 'Extra Trees',
    family: 'Ensemble Trees',
    cvRocAuc: 0.99,
    cvF1: 0.91,
    testAccuracy: 0.94,
    testPrecision: 0.95,
    testRecall: 0.79,
    testF1: 0.86,
    testRocAuc: 0.99,
    speed: 'Medium',
    interpretability: 'Medium',
    strengths: ['Strong ranking quality', 'Good precision'],
    weaknesses: ['Misses more positive cases'],
    note: 'Strong ROC AUC, but weaker recall than the best models.',
  },
  {
    id: 'mlp',
    name: 'MLP',
    family: 'Neural Network',
    cvRocAuc: 0.99,
    cvF1: 0.94,
    testAccuracy: 0.94,
    testPrecision: 0.93,
    testRecall: 0.81,
    testF1: 0.87,
    testRocAuc: 0.98,
    speed: 'Slow',
    interpretability: 'Low',
    strengths: ['Learns nonlinear interactions', 'Good all-round performance'],
    weaknesses: ['Less interpretable', 'More tuning-sensitive'],
    note: 'A strong nonlinear baseline, but tree ensembles still performed better here.',
  },
  {
    id: 'svm',
    name: 'SVM (RBF)',
    family: 'Kernel Method',
    cvRocAuc: 0.99,
    cvF1: 0.91,
    testAccuracy: 0.93,
    testPrecision: 0.9,
    testRecall: 0.79,
    testF1: 0.84,
    testRocAuc: 0.98,
    speed: 'Medium',
    interpretability: 'Low',
    strengths: ['Strong decision boundary', 'Good ROC AUC'],
    weaknesses: ['Less transparent', 'Recall is weaker than the leaders'],
    note: 'Solid performer, but outperformed by stronger ensembles.',
  },
  {
    id: 'knn',
    name: 'KNN',
    family: 'Instance-Based',
    cvRocAuc: 0.96,
    cvF1: 0.77,
    testAccuracy: 0.89,
    testPrecision: 0.97,
    testRecall: 0.58,
    testF1: 0.73,
    testRocAuc: 0.93,
    speed: 'Fast',
    interpretability: 'Medium',
    strengths: ['Very high precision', 'Conceptually simple'],
    weaknesses: ['Poor recall on hit songs', 'Sensitive to feature geometry'],
    note: 'A conservative model that rarely predicts positive, causing missed hit songs.',
  },
  {
    id: 'dummy',
    name: 'Dummy Baseline',
    family: 'Baseline',
    cvRocAuc: 0.5,
    cvF1: 0.0,
    testAccuracy: 0.75,
    testPrecision: 0.0,
    testRecall: 0.0,
    testF1: 0.0,
    testRocAuc: 0.5,
    speed: 'Very Fast',
    interpretability: 'High',
    strengths: ['Fast sanity check'],
    weaknesses: ['No useful predictive capability'],
    note: 'Included to confirm that learned models genuinely outperform a trivial baseline.',
  },
];

const BEST_MODEL_CONFUSION: BinaryConfusion = {
  tn: 143,
  fp: 0,
  fn: 2,
  tp: 46,
};

const TOTAL_SAMPLES = 952;
const TRAIN_SAMPLES = 761;
const TEST_SAMPLES = 191;
const NEGATIVE_CLASS = 714;
const POSITIVE_CLASS = 238;

function formatPct(v: number) {
  return `${(v * 100).toFixed(2)}%`;
}

function normalizeLayout(rawLayout: Record<string, unknown> | undefined) {
  const layout = rawLayout ? { ...rawLayout } : {};
  const margin =
    layout.margin && typeof layout.margin === 'object'
      ? { ...(layout.margin as Record<string, unknown>) }
      : {};

  layout.margin = {
    l: typeof margin.l === 'number' ? Math.max(margin.l, 56) : 56,
    r: typeof margin.r === 'number' ? Math.max(margin.r, 24) : 24,
    t: typeof margin.t === 'number' ? Math.max(margin.t, 32) : 32,
    b: typeof margin.b === 'number' ? Math.max(margin.b, 64) : 64,
  };

  return layout;
}

function PlotCard({
  title,
  subtitle,
  figure,
  className,
}: {
  title: string;
  subtitle?: string;
  figure: PlotFigure;
  className?: string;
}) {
  const layout = normalizeLayout({
    ...figure.layout,
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
  });

  return (
    <div className={cn('rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm', className)}>
      <h4 className="text-lg font-black tracking-tight text-zinc-900">{title}</h4>
      {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
      <div className="mt-5 rounded-2xl bg-white p-2 ring-1 ring-zinc-200/70 md:p-3">
        <Plot data={figure.data} layout={layout} config={SPOTIFY_PLOT_CONFIG} className="w-full" />
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  icon: Icon,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 border-b-4 border-[#1DB954] pb-2 md:flex-row md:items-center">
      <div className="group flex flex-1 cursor-pointer items-center gap-3" onClick={onToggle}>
        <div className="rounded-lg bg-[#1DB954] p-2 text-black transition-transform group-hover:scale-110">
          <Icon size={24} />
        </div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-900 transition-colors group-hover:text-[#1DB954]">
          {title}
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </h2>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  accent = 'spotify',
}: {
  value: string | number;
  label: string;
  accent?: 'spotify' | 'dark' | 'amber';
}) {
  const accentClasses = {
    spotify: 'border-b-[#1DB954]',
    dark: 'border-b-zinc-400',
    amber: 'border-b-amber-400',
  };

  return (
    <div className={cn('rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center text-white shadow-lg border-b-4', accentClasses[accent])}>
      <div className="mb-1 text-3xl font-black text-[#1DB954]">{value}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">{label}</div>
    </div>
  );
}

function MetricBadge({
  label,
  value,
  color = 'green',
}: {
  label: string;
  value: string;
  color?: 'green' | 'blue' | 'pink' | 'orange';
}) {
  const map = {
    green: 'border-[#1DB954]/20 bg-[#1DB954]/10 text-[#1DB954]',
    blue: 'border-blue-200 bg-blue-50 text-blue-600',
    pink: 'border-pink-200 bg-pink-50 text-pink-600',
    orange: 'border-amber-200 bg-amber-50 text-amber-600',
  };

  return (
    <div className={cn('rounded-2xl border px-4 py-3', map[color])}>
      <div className="text-[10px] font-black uppercase tracking-[0.18em]">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
    </div>
  );
}

export default function SpotifyML({ onBack }: { onBack?: () => void }) {
  const [sections, setSections] = useState({
    methodology: true,
    overview: true,
    pipeline: true,
    modelGallery: true,
    comparison: true,
    bestModel: true,
    detailedInspector: true,
    conclusion: true,
  });

  const [selectedModelId, setSelectedModelId] = useState<string>('rf');

  const selectedModel = MODEL_RESULTS.find((m) => m.id === selectedModelId) ?? MODEL_RESULTS[0];

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const collapseAll = () => {
    setSections({
      methodology: false,
      overview: false,
      pipeline: false,
      modelGallery: false,
      comparison: false,
      bestModel: false,
      detailedInspector: false,
      conclusion: false,
    });
  };

  const expandAll = () => {
    setSections({
      methodology: true,
      overview: true,
      pipeline: true,
      modelGallery: true,
      comparison: true,
      bestModel: true,
      detailedInspector: true,
      conclusion: true,
    });
  };

  const classDistributionFigure = useMemo<PlotFigure>(() => {
    return {
      data: [
        {
          type: 'pie',
          labels: ['Not Hit', 'Hit'],
          values: [NEGATIVE_CLASS, POSITIVE_CLASS],
          marker: { colors: [COLORS.black, COLORS.green] },
          hole: 0.55,
          textinfo: 'label+percent',
          hovertemplate: '<b>%{label}</b><br>Count: %{value}<extra></extra>',
        },
      ],
      layout: {
        title: 'Target Distribution (is_hit)',
        height: 420,
        showlegend: true,
      },
    };
  }, []);

  const modelRankingFigure = useMemo<PlotFigure>(() => {
    const rows = [...MODEL_RESULTS].sort((a, b) => a.testF1 - b.testF1);

    return {
      data: [
        {
          type: 'bar',
          orientation: 'h',
          x: rows.map((row) => row.testF1),
          y: rows.map((row) => row.name),
          text: rows.map((row) => formatPct(row.testF1)),
          textposition: 'inside',
          marker: {
            color: rows.map((row) => MODEL_COLOR_MAP[row.name] ?? COLORS.gray),
          },
          hovertemplate: '<b>%{y}</b><br>Test F1: %{x:.4f}<extra></extra>',
        },
      ],
      layout: {
        title: 'Model Ranking by Test F1-Score',
        height: 560,
        xaxis: { title: 'F1 Score', range: [0, 1.05] },
        yaxis: { title: 'Model' },
        showlegend: false,
      },
    };
  }, []);

  const multiMetricFigure = useMemo<PlotFigure>(() => {
    return {
      data: [
        {
          type: 'bar',
          name: 'Accuracy',
          x: MODEL_RESULTS.map((m) => m.name),
          y: MODEL_RESULTS.map((m) => m.testAccuracy),
          marker: { color: COLORS.green },
        },
        {
          type: 'bar',
          name: 'Precision',
          x: MODEL_RESULTS.map((m) => m.name),
          y: MODEL_RESULTS.map((m) => m.testPrecision),
          marker: { color: COLORS.blue },
        },
        {
          type: 'bar',
          name: 'Recall',
          x: MODEL_RESULTS.map((m) => m.name),
          y: MODEL_RESULTS.map((m) => m.testRecall),
          marker: { color: COLORS.pink },
        },
        {
          type: 'bar',
          name: 'ROC AUC',
          x: MODEL_RESULTS.map((m) => m.name),
          y: MODEL_RESULTS.map((m) => m.testRocAuc),
          marker: { color: COLORS.orange },
        },
      ],
      layout: {
        title: 'Held-Out Test Metrics Across Models',
        height: 580,
        barmode: 'group',
        xaxis: { title: 'Model', tickangle: -25 },
        yaxis: { title: 'Score', range: [0, 1.05] },
        legend: { orientation: 'h', y: -0.2 },
      },
    };
  }, []);

  const bestModelConfusionFigure = useMemo<PlotFigure>(() => {
    return {
      data: [
        {
          type: 'heatmap',
          z: [
            [BEST_MODEL_CONFUSION.tn, BEST_MODEL_CONFUSION.fp],
            [BEST_MODEL_CONFUSION.fn, BEST_MODEL_CONFUSION.tp],
          ],
          x: ['Predicted: Not Hit', 'Predicted: Hit'],
          y: ['Actual: Not Hit', 'Actual: Hit'],
          text: [
            [String(BEST_MODEL_CONFUSION.tn), String(BEST_MODEL_CONFUSION.fp)],
            [String(BEST_MODEL_CONFUSION.fn), String(BEST_MODEL_CONFUSION.tp)],
          ],
          texttemplate: '%{text}',
          textfont: { size: 20, color: 'white' },
          colorscale: 'Greens',
          hovertemplate: '<b>%{y}</b><br>%{x}<br>Count: %{z}<extra></extra>',
        },
      ],
      layout: {
        title: 'Random Forest Confusion Matrix (Derived from notebook metrics)',
        height: 500,
      },
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1DB954] to-zinc-900 p-4 font-sans md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <header className="relative overflow-hidden bg-zinc-950 px-6 py-12 text-center text-white md:px-10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#1DB954] blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#1DB954] blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-2xl bg-[#1DB954] p-3 text-black shadow-lg shadow-[#1DB954]/20">
              <Brain size={40} strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-[#1DB954] md:text-6xl">Spotify Top Songs 2023</h1>
            <p className="mx-auto mt-3 max-w-3xl text-lg text-zinc-400 md:text-xl">
              Assignment 2 machine learning dashboard for hit-song prediction, model comparison, evaluation, and interpretation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-zinc-500">
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">Binary Classification</span>
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">Top 25% Hit Label</span>
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">Best Model: Random Forest</span>
            </div>
          </div>
        </header>

        <div className="sticky top-0 z-40 flex flex-wrap justify-center gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4 shadow-sm">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-full border-2 border-zinc-400 px-5 py-2 text-sm font-bold text-zinc-700 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              <ArrowLeft size={16} /> Home
            </button>
          ) : null}

          <button
            onClick={collapseAll}
            className="flex items-center gap-2 rounded-full border-2 border-[#1DB954] px-5 py-2 text-sm font-bold text-[#1DB954] transition hover:bg-[#1DB954] hover:text-white"
          >
            <Layers size={16} /> Collapse all
          </button>

          <button
            onClick={expandAll}
            className="flex items-center gap-2 rounded-full border-2 border-[#1DB954] px-5 py-2 text-sm font-bold text-[#1DB954] transition hover:bg-[#1DB954] hover:text-white"
          >
            <LayoutDashboard size={16} /> Expand all
          </button>
        </div>

        <main className="space-y-10 p-6 md:p-10">
          <section>
            <SectionHeader
              title="Analysis Methodology"
              icon={Info}
              isOpen={sections.methodology}
              onToggle={() => toggleSection('methodology')}
            />
            <AnimatePresence>
              {sections.methodology && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                      <h4 className="mb-4 flex items-center gap-2 font-bold text-zinc-900">
                        <Search size={18} className="text-[#1DB954]" /> Notebook workflow
                      </h4>
                      <ul className="space-y-3 text-sm text-zinc-600">
                        <li>• Start from the cleaned dataset created in Assignment 1.</li>
                        <li>• Define <code>is_hit</code> using the top 25% of streams.</li>
                        <li>• Remove <code>streams</code> from the feature set to avoid leakage.</li>
                        <li>• Use train/test split with stratification.</li>
                        <li>• Build preprocessing pipelines for numerical and categorical columns.</li>
                        <li>• Compare 10 models using cross-validation and held-out test metrics.</li>
                        <li>• Prioritize ROC AUC because the class distribution is imbalanced.</li>
                      </ul>
                    </div>

                    <div className="flex flex-col justify-center rounded-2xl border border-[#1DB954]/20 bg-[#1DB954]/5 p-6">
                      <div className="mb-2 text-3xl font-black text-[#1DB954]">Main modeling idea</div>
                      <p className="text-lg italic text-zinc-700">
                        A song becomes predictable as a hit not just from sound, but from visibility-related signals such as playlist coverage, chart presence, and platform exposure.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <SectionHeader
              title="Task Overview"
              icon={Database}
              isOpen={sections.overview}
              onToggle={() => toggleSection('overview')}
            />
            <AnimatePresence>
              {sections.overview && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-8"
                >
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <StatCard value={TOTAL_SAMPLES} label="Total samples" />
                    <StatCard value={TRAIN_SAMPLES} label="Train set" accent="dark" />
                    <StatCard value={TEST_SAMPLES} label="Test set" />
                    <StatCard value={NEGATIVE_CLASS} label="Not-hit songs" accent="amber" />
                    <StatCard value={POSITIVE_CLASS} label="Hit songs" />
                  </div>

                  <div className="grid gap-8 lg:grid-cols-2">
                    <PlotCard
                      title="Class Distribution"
                      subtitle="The target is moderately imbalanced, so ROC AUC is a better main ranking metric than accuracy alone."
                      figure={classDistributionFigure}
                    />

                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                      <h4 className="text-lg font-black tracking-tight text-zinc-900">Problem statement</h4>
                      <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-600">
                        <p>
                          The goal is to predict whether a song belongs to the <strong>hit class</strong> using metadata, chart presence, playlist presence, and audio features.
                        </p>
                        <p>
                          Because <code>is_hit</code> is defined from stream counts, the notebook carefully excludes <code>streams</code> from the input features.
                        </p>
                        <p>
                          This turns the task into a more realistic predictive problem: <strong>can we estimate hit potential without directly peeking at the final outcome?</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <SectionHeader
              title="Pipeline Design"
              icon={ShieldCheck}
              isOpen={sections.pipeline}
              onToggle={() => toggleSection('pipeline')}
            />
            <AnimatePresence>
              {sections.pipeline && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                      <div className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#1DB954]">Step 1</div>
                      <h4 className="mb-2 font-bold text-zinc-900">Feature selection</h4>
                      <p className="text-sm text-zinc-600">
                        Use chart, playlist, release, artist, and audio variables while excluding direct leakage from streams.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                      <div className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#1DB954]">Step 2</div>
                      <h4 className="mb-2 font-bold text-zinc-900">Preprocessing</h4>
                      <p className="text-sm text-zinc-600">
                        Numerical columns are imputed and scaled. Categorical columns are imputed and one-hot encoded.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                      <div className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#1DB954]">Step 3</div>
                      <h4 className="mb-2 font-bold text-zinc-900">Model search</h4>
                      <p className="text-sm text-zinc-600">
                        Evaluate a broad set of learners: linear, instance-based, kernel, tree-based, bagging, and boosting approaches.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                      <div className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#1DB954]">Step 4</div>
                      <h4 className="mb-2 font-bold text-zinc-900">Final evaluation</h4>
                      <p className="text-sm text-zinc-600">
                        Compare cross-validation and held-out test metrics, then inspect the strongest model in more detail.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <SectionHeader
              title="Model Gallery"
              icon={Activity}
              isOpen={sections.modelGallery}
              onToggle={() => toggleSection('modelGallery')}
            />
            <AnimatePresence>
              {sections.modelGallery && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {MODEL_RESULTS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModelId(model.id)}
                        className={cn(
                          'rounded-3xl border p-6 text-left shadow-sm transition hover:-translate-y-1',
                          selectedModelId === model.id
                            ? 'border-[#1DB954] bg-[#1DB954]/5 ring-2 ring-[#1DB954]/20'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xl font-black text-zinc-900">{model.name}</h4>
                            <p className="mt-1 text-sm text-zinc-500">{model.family}</p>
                          </div>
                          {model.id === 'rf' ? (
                            <div className="rounded-full bg-[#1DB954] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                              Best
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <MetricBadge label="Accuracy" value={formatPct(model.testAccuracy)} color="green" />
                          <MetricBadge label="F1" value={formatPct(model.testF1)} color="blue" />
                          <MetricBadge label="ROC AUC" value={formatPct(model.testRocAuc)} color="pink" />
                          <MetricBadge label="Speed" value={model.speed} color="orange" />
                        </div>

                        <p className="mt-5 text-sm leading-relaxed text-zinc-600">{model.note}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <SectionHeader
              title="Comparison Results"
              icon={BarChart3}
              isOpen={sections.comparison}
              onToggle={() => toggleSection('comparison')}
            />
            <AnimatePresence>
              {sections.comparison && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-8"
                >
                  <PlotCard
                    title="Model Ranking by Test F1"
                    subtitle="A compact ranking view to see which methods are strongest at balancing precision and recall."
                    figure={modelRankingFigure}
                  />

                  <PlotCard
                    title="Metric Comparison Across All Models"
                    subtitle="Held-out accuracy, precision, recall, and ROC AUC side by side."
                    figure={multiMetricFigure}
                  />

                  <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-100 px-6 py-4">
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-800">Detailed model comparison table</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-240 text-left text-sm">
                        <thead className="bg-zinc-900 text-[11px] uppercase tracking-widest text-zinc-400">
                          <tr>
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3 text-center">CV ROC AUC</th>
                            <th className="px-4 py-3 text-center">CV F1</th>
                            <th className="px-4 py-3 text-center">Test Acc</th>
                            <th className="px-4 py-3 text-center">Test Prec</th>
                            <th className="px-4 py-3 text-center">Test Recall</th>
                            <th className="px-4 py-3 text-center">Test F1</th>
                            <th className="px-4 py-3 text-center">Test ROC AUC</th>
                            <th className="px-4 py-3 text-center">Speed</th>
                            <th className="px-4 py-3 text-center">Interpretability</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                          {MODEL_RESULTS.map((row) => (
                            <tr
                              key={row.id}
                              className={cn('hover:bg-zinc-50', row.id === 'rf' && 'bg-[#1DB954]/5')}
                            >
                              <td className="px-4 py-3 font-semibold text-zinc-900">{row.name}</td>
                              <td className="px-4 py-3 text-center font-mono">{row.cvRocAuc.toFixed(4)}</td>
                              <td className="px-4 py-3 text-center font-mono">{row.cvF1.toFixed(4)}</td>
                              <td className="px-4 py-3 text-center font-mono">{row.testAccuracy.toFixed(4)}</td>
                              <td className="px-4 py-3 text-center font-mono">{row.testPrecision.toFixed(4)}</td>
                              <td className="px-4 py-3 text-center font-mono">{row.testRecall.toFixed(4)}</td>
                              <td className="px-4 py-3 text-center font-mono font-bold text-[#1DB954]">{row.testF1.toFixed(4)}</td>
                              <td className="px-4 py-3 text-center font-mono">{row.testRocAuc.toFixed(4)}</td>
                              <td className="px-4 py-3 text-center">{row.speed}</td>
                              <td className="px-4 py-3 text-center">{row.interpretability}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <SectionHeader
              title="Best Model Analysis"
              icon={Trophy}
              isOpen={sections.bestModel}
              onToggle={() => toggleSection('bestModel')}
            />
            <AnimatePresence>
              {sections.bestModel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-8"
                >
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <StatCard value="1.0000" label="CV ROC AUC" />
                    <StatCard value="0.9895" label="Test accuracy" accent="dark" />
                    <StatCard value="1.0000" label="Precision" />
                    <StatCard value="0.9600" label="Recall" accent="amber" />
                    <StatCard value="0.9787" label="F1 score" />
                  </div>

                  <div className="grid gap-8 lg:grid-cols-2">
                    <PlotCard
                      title="Random Forest Confusion Matrix"
                      subtitle="Derived directly from the reported precision, recall, support, and class counts in the notebook."
                      figure={bestModelConfusionFigure}
                    />

                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                      <h4 className="text-lg font-black tracking-tight text-zinc-900">Why Random Forest wins</h4>
                      <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-600">
                        <p>
                          Random Forest combines <strong>excellent ranking quality</strong> with <strong>very strong classification accuracy</strong>.
                        </p>
                        <p>
                          It correctly classifies almost all non-hit songs and still captures the vast majority of hit songs. In the reported test results:
                        </p>
                        <ul className="space-y-2">
                          <li>• True Negatives: <strong>143</strong></li>
                          <li>• False Positives: <strong>0</strong></li>
                          <li>• False Negatives: <strong>2</strong></li>
                          <li>• True Positives: <strong>46</strong></li>
                        </ul>
                        <p>
                          This makes it especially attractive when false alarms should be minimized while still retaining strong hit detection.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <SectionHeader
              title="Interactive Model Inspector"
              icon={Target}
              isOpen={sections.detailedInspector}
              onToggle={() => toggleSection('detailedInspector')}
            />
            <AnimatePresence>
              {sections.detailedInspector && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-8"
                >
                  <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-3xl font-black text-zinc-900">{selectedModel.name}</h3>
                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                            {selectedModel.family}
                          </span>
                        </div>
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">{selectedModel.note}</p>
                      </div>

                      <button
                        className="rounded-full border-2 border-[#1DB954] px-5 py-2 text-sm font-bold text-[#1DB954] transition hover:bg-[#1DB954] hover:text-white"
                        onClick={() => setSelectedModelId('rf')}
                      >
                        Jump to best model
                      </button>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-5">
                      <MetricBadge label="Accuracy" value={formatPct(selectedModel.testAccuracy)} color="green" />
                      <MetricBadge label="Precision" value={formatPct(selectedModel.testPrecision)} color="blue" />
                      <MetricBadge label="Recall" value={formatPct(selectedModel.testRecall)} color="pink" />
                      <MetricBadge label="F1" value={formatPct(selectedModel.testF1)} color="orange" />
                      <MetricBadge label="ROC AUC" value={formatPct(selectedModel.testRocAuc)} color="green" />
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                      <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                        <div className="mb-4 flex items-center gap-2 font-bold text-zinc-900">
                          <Sparkles size={18} className="text-[#1DB954]" /> Strengths
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-600">
                          {selectedModel.strengths.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                        <div className="mb-4 flex items-center gap-2 font-bold text-zinc-900">
                          <Clock3 size={18} className="text-[#1DB954]" /> Trade-offs
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-600">
                          {selectedModel.weaknesses.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                          <li>• Speed category: <strong>{selectedModel.speed}</strong></li>
                          <li>• Interpretability: <strong>{selectedModel.interpretability}</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-white shadow-xl">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl bg-[#1DB954]/20 p-2 text-[#1DB954]">
                          <Brain size={20} />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tight">Interpretation</h4>
                      </div>
                      <p className="border-l-4 border-[#1DB954] pl-4 text-sm leading-relaxed text-zinc-300">
                        {selectedModel.name === 'Random Forest'
                          ? 'This model is the strongest all-round choice because it preserves extremely high precision while still recovering almost all hit songs.'
                          : selectedModel.name === 'LogisticRegression'
                          ? 'This is the best option when you want a transparent and explainable model, even though it gives up some recall compared with the leading ensembles.'
                          : selectedModel.name === 'Dummy Baseline'
                          ? 'This model is not meant for deployment. It only serves as a sanity-check benchmark to prove that real learning is happening.'
                          : 'This model is a useful comparison point in the notebook. It contributes insight into the trade-off between flexibility, interpretability, and hit-song recovery.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <SectionHeader
              title="Final Conclusion"
              icon={Clipboard}
              isOpen={sections.conclusion}
              onToggle={() => toggleSection('conclusion')}
            />
            <AnimatePresence>
              {sections.conclusion && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-[36px] border-l-[12px] border-[#1DB954] bg-white p-8 shadow-2xl md:p-10">
                    <h3 className="mb-8 flex items-center gap-3 border-b border-zinc-100 pb-4 text-2xl font-black text-zinc-950">
                      <Brain size={24} className="text-[#1DB954]" /> Executive Summary
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border-l-4 border-[#1DB954] bg-zinc-900 p-6 text-white">
                        <h4 className="mb-2 text-lg font-black text-[#1DB954]">1. The task is learnable</h4>
                        <p className="text-sm text-zinc-200">
                          Hit-song prediction is highly feasible using platform exposure, playlist reach, and music metadata.
                        </p>
                      </div>

                      <div className="rounded-2xl border-l-4 border-[#1DB954] bg-zinc-900 p-6 text-white">
                        <h4 className="mb-2 text-lg font-black text-[#1DB954]">2. Exposure matters most</h4>
                        <p className="text-sm text-zinc-200">
                          The strongest signal is not only the song’s audio profile but the distribution ecosystem around it.
                        </p>
                      </div>

                      <div className="rounded-2xl border-l-4 border-[#1DB954] bg-zinc-900 p-6 text-white">
                        <h4 className="mb-2 text-lg font-black text-[#1DB954]">3. Random Forest is the winner</h4>
                        <p className="text-sm text-zinc-200">
                          It combines near-perfect ROC AUC with excellent precision and recall on the held-out test split.
                        </p>
                      </div>

                      <div className="rounded-2xl border-l-4 border-[#1DB954] bg-zinc-900 p-6 text-white">
                        <h4 className="mb-2 text-lg font-black text-[#1DB954]">4. Practical implication</h4>
                        <p className="text-sm text-zinc-200">
                          To forecast future hits, labels and music platforms should track visibility variables as closely as they track sound characteristics.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-zinc-100 pt-6 text-center">
                      <p className="text-lg font-bold italic text-[#1DB954]">
                        “Streaming success is not just about what a song sounds like — it is also about how strongly the ecosystem amplifies it.”
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>

        <footer className="border-t border-zinc-200 bg-zinc-50 p-10 text-center text-sm text-zinc-500">
          <div className="mb-4 flex justify-center gap-6">
            <Brain size={20} />
            <TrendingUp size={20} />
            <BarChart3 size={20} />
          </div>
          <p className="mb-1 font-bold text-zinc-900">Spotify Top Songs 2023 — Assignment 2 ML Demo</p>
          <p>Built with React, Tailwind CSS, Lucide, Motion, and Plotly.</p>
        </footer>
      </div>
    </div>
  );
}