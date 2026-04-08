import React, { Suspense, lazy, memo, useEffect, useMemo, useState } from 'react';

/**
 * MMHS150K exploratory dashboard: overview → preprocessing → text / image / multimodal analyses → takeaways.
 * Inline statistics supplement pre-exported Plotly figures from `public/hate/*.json` where noted.
 */

/** Plotly is code-split (~3 MB); warm the async chunk when this route loads. */
const PlotlyChart = lazy(() => import('react-plotly.js').then((m) => ({ default: m.default })));
if (typeof window !== 'undefined') {
  void import('react-plotly.js');
}

function LazyPlot({
  data,
  layout,
  config,
  className,
  useResizeHandler,
  style,
}: {
  data: any;
  layout?: any;
  config?: any;
  className?: string;
  useResizeHandler?: boolean;
  style?: React.CSSProperties;
}) {
  const rawH = layout && typeof layout === 'object' && layout !== null && 'height' in layout ? (layout as { height?: unknown }).height : undefined;
  const height = typeof rawH === 'number' ? Math.max(rawH, 280) : 520;
  const shellPadY = 20;
  return (
    <div
      className={cn('w-full overflow-hidden rounded-xl bg-white/80 px-2 pt-3 pb-2 md:px-3 md:pt-4 md:pb-3 ring-1 ring-slate-200/60', className)}
      style={{ minHeight: height + shellPadY }}
    >
      <Suspense
        fallback={
          <div className="w-full animate-pulse rounded-lg bg-slate-100/80" style={{ height, minHeight: height }} aria-hidden />
        }
      >
        <PlotlyChart
          data={data}
          layout={layout}
          config={config}
          useResizeHandler={useResizeHandler}
          style={{ width: '100%', minHeight: height, ...style }}
          className="w-full rounded-lg"
        />
      </Suspense>
    </div>
  );
}
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  BarChart3,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  Image as ImageIcon,
  Info,
  Layers,
  LayoutDashboard,
  Lightbulb,
  LucideIcon,
  Maximize2,
  Search,
  ShieldAlert,
  Sparkles,
  Type,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ENGLISH_STOPWORD_COUNT, englishStopwordsCommaSeparated } from './englishStopwords';

type SectionId =
  | 'overview'
  | 'preprocessing'
  | 'text'
  | 'image'
  | 'multimodal'
  | 'insights';

type SectionMeta = {
  id: SectionId;
  title: string;
  icon: LucideIcon;
};

const SECTION_META: SectionMeta[] = [
  {
    id: 'overview',
    title: 'Dataset Overview',
    icon: Database,
  },
  {
    id: 'preprocessing',
    title: 'Data Preprocessing & Noise',
    icon: ShieldAlert,
  },
  {
    id: 'text',
    title: 'Text EDA',
    icon: Type,
  },
  {
    id: 'image',
    title: 'Image EDA',
    icon: ImageIcon,
  },
  {
    id: 'multimodal',
    title: 'Multimodal EDA',
    icon: Search,
  },
  {
    id: 'insights',
    title: 'Key Insights',
    icon: Zap,
  },
];

const CLASS_BALANCE_SERIES = [
  { name: 'NotHate', count: 124005, color: '#16a34a' },
  { name: 'Racist', count: 12287, color: '#dc2626' },
  { name: 'Sexist', count: 3671, color: '#db2777' },
  { name: 'Homophobe', count: 3886, color: '#7c3aed' },
  { name: 'Religion', count: 163, color: '#f59e0b' },
  { name: 'OtherHate', count: 5811, color: '#475569' },
] as const;

const SPLIT_BALANCE_SERIES = [
  { name: 'Train', count: 134823, color: '#0ea5e9' },
  { name: 'Validation', count: 5000, color: '#22d3ee' },
  { name: 'Test', count: 10000, color: '#0369a1' },
] as const;

const CLASS_PROFILE_BUBBLES = [
  { name: 'NotHate', count: 124005, ocrCoverage: 39.07, agreement: 79.24, avgWords: 10.49, avgChars: 59.01, color: '#16a34a' },
  { name: 'Racist', count: 12287, ocrCoverage: 38.51, agreement: 70.32, avgWords: 10.18, avgChars: 57.76, color: '#dc2626' },
  { name: 'Sexist', count: 3671, ocrCoverage: 41.41, agreement: 68.76, avgWords: 10.84, avgChars: 61.42, color: '#db2777' },
  { name: 'Homophobe', count: 3886, ocrCoverage: 36.88, agreement: 74.14, avgWords: 9.85, avgChars: 54.38, color: '#7c3aed' },
  { name: 'Religion', count: 163, ocrCoverage: 61.96, agreement: 71.37, avgWords: 11.34, avgChars: 75.39, color: '#f59e0b' },
  { name: 'OtherHate', count: 5811, ocrCoverage: 51.97, agreement: 72.78, avgWords: 10.18, avgChars: 62.15, color: '#475569' },
] as const;

const CLASS_ORDER = CLASS_BALANCE_SERIES.map((item) => item.name);
const CLASS_COLOR_MAP = Object.fromEntries(CLASS_BALANCE_SERIES.map((item) => [item.name, item.color])) as Record<string, string>;

/** Structural QA tallies (notebook run, hardcoded). `notebookKey` matches `13_data_quality_issues.json` field names. */
const DATA_QUALITY_ISSUES = [
  { notebookKey: 'empty_tweet_text', label: 'Empty tweet text', count: 0, color: '#94a3b8' },
  { notebookKey: 'empty_img_text', label: 'Empty OCR text', count: 90571, color: '#475569' },
  { notebookKey: 'duplicate_id', label: 'Duplicate ids', count: 0, color: '#94a3b8' },
  { notebookKey: 'duplicate_tweet_text', label: 'Duplicate tweets', count: 197, color: '#64748b' },
  { notebookKey: 'missing_image_file', label: 'Missing image file', count: 0, color: '#94a3b8' },
  { notebookKey: 'corrupt_images_in_sample', label: 'Corrupt sampled image', count: 0, color: '#94a3b8' },
] as const;

const LANGUAGE_DISTRIBUTION = [
  { label: 'langdetect_not_installed', count: 149823 },
] as const;

const TEXT_LENGTH_SUMMARY = [
  { name: 'NotHate', avgWords: 10.49, avgChars: 59.01, emojiRate: 21.76, hashtagRate: 10.21, hateLexiconRate: 68.5 },
  { name: 'Racist', avgWords: 10.18, avgChars: 57.76, emojiRate: 19.45, hashtagRate: 7.58, hateLexiconRate: 80.0 },
  { name: 'Sexist', avgWords: 10.84, avgChars: 61.42, emojiRate: 15.83, hashtagRate: 13.62, hateLexiconRate: 25.31 },
  { name: 'Homophobe', avgWords: 9.85, avgChars: 54.38, emojiRate: 10.19, hashtagRate: 12.04, hateLexiconRate: 97.68 },
  { name: 'Religion', avgWords: 11.34, avgChars: 75.39, emojiRate: 11.66, hashtagRate: 43.56, hateLexiconRate: 12.27 },
  { name: 'OtherHate', avgWords: 10.18, avgChars: 62.15, emojiRate: 10.62, hashtagRate: 10.72, hateLexiconRate: 30.72 },
] as const;

const CLASS_SIGNAL_SNAPSHOT = [
  {
    name: 'NotHate',
    samples: 124005,
    avgWords: 10.492,
    avgChars: 59.013,
    avgSentiment: -0.136,
    emojiRate: 0.218,
    urlPct: 1.0,
    mentionPct: 0.378,
    hashtagPct: 0.102,
    punctRatio: 0.045,
    allCapsRatio: 0.165,
    hateLexiconRate: 0.685,
    ocrCoverage: 0.391,
    annotatorAgreement: 0.792,
  },
  {
    name: 'Racist',
    samples: 12287,
    avgWords: 10.182,
    avgChars: 57.757,
    avgSentiment: -0.172,
    emojiRate: 0.195,
    urlPct: 1.0,
    mentionPct: 0.428,
    hashtagPct: 0.076,
    punctRatio: 0.045,
    allCapsRatio: 0.191,
    hateLexiconRate: 0.8,
    ocrCoverage: 0.385,
    annotatorAgreement: 0.703,
  },
  {
    name: 'Sexist',
    samples: 3671,
    avgWords: 10.843,
    avgChars: 61.425,
    avgSentiment: -0.355,
    emojiRate: 0.158,
    urlPct: 1.0,
    mentionPct: 0.288,
    hashtagPct: 0.136,
    punctRatio: 0.046,
    allCapsRatio: 0.153,
    hateLexiconRate: 0.253,
    ocrCoverage: 0.414,
    annotatorAgreement: 0.688,
  },
  {
    name: 'Homophobe',
    samples: 3886,
    avgWords: 9.845,
    avgChars: 54.376,
    avgSentiment: -0.325,
    emojiRate: 0.102,
    urlPct: 1.0,
    mentionPct: 0.265,
    hashtagPct: 0.12,
    punctRatio: 0.045,
    allCapsRatio: 0.154,
    hateLexiconRate: 0.977,
    ocrCoverage: 0.369,
    annotatorAgreement: 0.741,
  },
  {
    name: 'Religion',
    samples: 163,
    avgWords: 11.337,
    avgChars: 75.387,
    avgSentiment: -0.257,
    emojiRate: 0.117,
    urlPct: 1.0,
    mentionPct: 0.479,
    hashtagPct: 0.436,
    punctRatio: 0.043,
    allCapsRatio: 0.176,
    hateLexiconRate: 0.123,
    ocrCoverage: 0.62,
    annotatorAgreement: 0.714,
  },
  {
    name: 'OtherHate',
    samples: 5811,
    avgWords: 10.178,
    avgChars: 62.155,
    avgSentiment: -0.375,
    emojiRate: 0.106,
    urlPct: 1.0,
    mentionPct: 0.496,
    hashtagPct: 0.107,
    punctRatio: 0.045,
    allCapsRatio: 0.152,
    hateLexiconRate: 0.307,
    ocrCoverage: 0.52,
    annotatorAgreement: 0.728,
  },
] as const;

const TOP_KEYWORDS = [
  { label: 'said', value: 4092 },
  { label: 'retard', value: 3855 },
  { label: 'look', value: 3704 },
  { label: 'real', value: 3555 },
  { label: 'white', value: 3476 },
  { label: 'bitch', value: 3379 },
  { label: 'fucking', value: 3362 },
  { label: 'know', value: 3270 },
  { label: 'really', value: 3168 },
  { label: 'redneck', value: 3166 },
  { label: 'one', value: 3116 },
  { label: 'trash', value: 2951 },
] as const;

const TOP_WORDS_BY_CLASS: Record<string, { label: string; value: number }[]> = {
  NotHate: [
    { label: 'nigga', value: 72922 },
    { label: 'cunt', value: 12076 },
    { label: 'like', value: 9608 },
    { label: 'twat', value: 7152 },
    { label: 'dyke', value: 5541 },
    { label: 'ass', value: 5419 },
    { label: 'got', value: 4982 },
    { label: 'bitch', value: 4710 },
    { label: 'know', value: 4520 },
    { label: 'fuck', value: 4312 },
  ],
  Racist: [
    { label: 'nigga', value: 7165 },
    { label: 'nigger', value: 2637 },
    { label: 'white', value: 1029 },
    { label: 'like', value: 882 },
    { label: 'trash', value: 804 },
    { label: 'ass', value: 552 },
    { label: 'redneck', value: 498 },
    { label: 'people', value: 421 },
    { label: 'know', value: 388 },
    { label: 'black', value: 355 },
  ],
  Sexist: [
    { label: 'cunt', value: 1966 },
    { label: 'twat', value: 675 },
    { label: 'nigga', value: 470 },
    { label: 'faggot', value: 260 },
    { label: 'full', value: 220 },
    { label: 'like', value: 217 },
    { label: 'bitch', value: 205 },
    { label: 'women', value: 192 },
    { label: 'look', value: 178 },
    { label: 'hoe', value: 156 },
  ],
  Homophobe: [
    { label: 'faggot', value: 2519 },
    { label: 'dyke', value: 1272 },
    { label: 'like', value: 320 },
    { label: 'see', value: 169 },
    { label: 'look', value: 165 },
    { label: 'gay', value: 159 },
    { label: 'fucking', value: 148 },
    { label: 'bitch', value: 132 },
    { label: 'know', value: 118 },
    { label: 'queer', value: 101 },
  ],
  Religion: [
    { label: 'islam', value: 37 },
    { label: 'banislam', value: 30 },
    { label: 'bansharia', value: 25 },
    { label: 'terrorism', value: 17 },
    { label: 'cunt', value: 15 },
    { label: 'religion', value: 15 },
    { label: 'muslim', value: 14 },
    { label: 'sharia', value: 12 },
    { label: 'ban', value: 11 },
    { label: 'hate', value: 10 },
  ],
  OtherHate: [
    { label: 'retarded', value: 2249 },
    { label: 'retard', value: 1571 },
    { label: 'cunt', value: 385 },
    { label: 'twat', value: 378 },
    { label: 'fucking', value: 373 },
    { label: 'like', value: 355 },
    { label: 'know', value: 340 },
    { label: 'ass', value: 312 },
    { label: 'bitch', value: 298 },
    { label: 'people', value: 265 },
  ],
};

const TFIDF_TERMS_BY_CLASS: Record<string, { label: string; value: number }[]> = {
  NotHate: [
    { label: 'nigga', value: 0.9234 },
    { label: 'cunt', value: 0.1529 },
    { label: 'like', value: 0.1217 },
    { label: 'twat', value: 0.0906 },
    { label: 'dyke', value: 0.081 },
    { label: 'ass', value: 0.0686 },
    { label: 'bitch', value: 0.0624 },
    { label: 'fuck', value: 0.0581 },
    { label: 'got', value: 0.0543 },
    { label: 'know', value: 0.0498 },
  ],
  Racist: [
    { label: 'nigga', value: 0.8749 },
    { label: 'nigger', value: 0.322 },
    { label: 'white', value: 0.1256 },
    { label: 'like', value: 0.1077 },
    { label: 'trash', value: 0.0982 },
    { label: 'white trash', value: 0.0727 },
    { label: 'redneck', value: 0.0689 },
    { label: 'black', value: 0.0612 },
    { label: 'people', value: 0.0554 },
    { label: 'race', value: 0.0488 },
  ],
  Sexist: [
    { label: 'cunt', value: 0.8294 },
    { label: 'twat', value: 0.2847 },
    { label: 'nigga', value: 0.1983 },
    { label: 'faggot', value: 0.1097 },
    { label: 'full', value: 0.0928 },
    { label: 'like', value: 0.0915 },
    { label: 'bitch', value: 0.0862 },
    { label: 'hoe', value: 0.0721 },
    { label: 'women', value: 0.0655 },
    { label: 'slut', value: 0.0589 },
  ],
  Homophobe: [
    { label: 'faggot', value: 0.8236 },
    { label: 'dyke', value: 0.48 },
    { label: 'like', value: 0.1046 },
    { label: 'gay', value: 0.06 },
    { label: 'faggot faggot', value: 0.0568 },
    { label: 'see', value: 0.0553 },
    { label: 'queer', value: 0.0492 },
    { label: 'look', value: 0.0455 },
    { label: 'homo', value: 0.0418 },
    { label: 'fucking', value: 0.0386 },
  ],
  Religion: [
    { label: 'islam', value: 0.5413 },
    { label: 'banislam', value: 0.3284 },
    { label: 'bansharia', value: 0.3159 },
    { label: 'terrorism', value: 0.2487 },
    { label: 'religion', value: 0.2195 },
    { label: 'cunt', value: 0.1642 },
    { label: 'muslim', value: 0.1528 },
    { label: 'sharia', value: 0.1411 },
    { label: 'ban', value: 0.1284 },
    { label: 'jihad', value: 0.1126 },
  ],
  OtherHate: [
    { label: 'retarded', value: 0.7303 },
    { label: 'retard', value: 0.5102 },
    { label: 'cunt', value: 0.125 },
    { label: 'twat', value: 0.1228 },
    { label: 'fucking', value: 0.1211 },
    { label: 'like', value: 0.1153 },
    { label: 'stupid', value: 0.0987 },
    { label: 'idiot', value: 0.0874 },
    { label: 'moron', value: 0.0762 },
    { label: 'dumb', value: 0.0695 },
  ],
};

/** YOLO top counts per class (frozen from `16_yolo_objects_by_class.json`; Religion omitted in source export → empty). */
const YOLO_OBJECTS_BY_CLASS: Record<string, { label: string; value: number }[]> = {
  NotHate: [
    { label: 'person', value: 640 },
    { label: 'tie', value: 34 },
    { label: 'car', value: 31 },
    { label: 'chair', value: 20 },
    { label: 'boat', value: 15 },
    { label: 'bottle', value: 13 },
    { label: 'cup', value: 13 },
    { label: 'cell phone', value: 12 },
  ],
  Racist: [
    { label: 'person', value: 75 },
    { label: 'tie', value: 6 },
    { label: 'car', value: 4 },
    { label: 'bottle', value: 3 },
    { label: 'cell phone', value: 2 },
    { label: 'couch', value: 2 },
    { label: 'dog', value: 2 },
    { label: 'teddy bear', value: 2 },
  ],
  Sexist: [
    { label: 'person', value: 19 },
    { label: 'wine glass', value: 3 },
    { label: 'cell phone', value: 2 },
    { label: 'chair', value: 2 },
    { label: 'dining table', value: 2 },
    { label: 'tie', value: 2 },
    { label: 'bird', value: 1 },
    { label: 'couch', value: 1 },
  ],
  Homophobe: [
    { label: 'person', value: 12 },
    { label: 'remote', value: 1 },
  ],
  Religion: [],
  OtherHate: [
    { label: 'person', value: 33 },
    { label: 'book', value: 5 },
    { label: 'tie', value: 5 },
    { label: 'keyboard', value: 4 },
    { label: 'laptop', value: 3 },
    { label: 'car', value: 2 },
    { label: 'truck', value: 2 },
    { label: 'bottle', value: 1 },
  ],
};

const BIGRAMS_BY_CLASS: Record<string, { label: string; value: number }[]> = {
  NotHate: [
    { label: 'ass nigga', value: 2164 },
    { label: 'nigga said', value: 1833 },
    { label: 'van dyke', value: 1512 },
    { label: 'real nigga', value: 1465 },
    { label: 'nigga got', value: 1228 },
    { label: 'look like', value: 1215 },
    { label: 'know like', value: 1102 },
    { label: 'said nigga', value: 1044 },
    { label: 'bitch ass', value: 988 },
    { label: 'gotta nigga', value: 921 },
  ],
  Racist: [
    { label: 'white trash', value: 595 },
    { label: 'race card', value: 287 },
    { label: 'ass nigga', value: 252 },
    { label: 'nigga said', value: 159 },
    { label: 'nigga got', value: 133 },
    { label: 'real nigga', value: 115 },
    { label: 'lazy nigger', value: 102 },
    { label: 'black people', value: 94 },
    { label: 'playing victim', value: 87 },
    { label: 'white people', value: 79 },
  ],
  Sexist: [
    { label: 'full gallery', value: 95 },
    { label: 'full movie', value: 65 },
    { label: 'big tits', value: 54 },
    { label: 'full video', value: 50 },
    { label: 'hairy cunt', value: 50 },
    { label: 'fucking cunt', value: 48 },
    { label: 'ugly bitch', value: 44 },
    { label: 'stupid bitch', value: 41 },
    { label: 'dumb hoe', value: 38 },
    { label: 'women like', value: 35 },
  ],
  Homophobe: [
    { label: 'dyke energy', value: 97 },
    { label: 'big dyke', value: 83 },
    { label: 'sissy faggot', value: 75 },
    { label: 'called faggot', value: 75 },
    { label: 'look like', value: 64 },
    { label: 'like dyke', value: 64 },
    { label: 'fucking faggot', value: 58 },
    { label: 'little faggot', value: 52 },
    { label: 'gay shit', value: 47 },
    { label: 'anti gay', value: 42 },
  ],
  Religion: [
    { label: 'bansharia stopislam', value: 10 },
    { label: 'terrorism islam', value: 5 },
    { label: 'islam religion', value: 5 },
    { label: 'arab spring', value: 5 },
    { label: 'spring legacy', value: 5 },
    { label: 'legacy islamist', value: 5 },
    { label: 'ban sharia', value: 5 },
    { label: 'stop islam', value: 4 },
    { label: 'radical islam', value: 4 },
    { label: 'muslim ban', value: 4 },
  ],
  OtherHate: [
    { label: 'full retard', value: 217 },
    { label: 'fucking retarded', value: 120 },
    { label: 'white trash', value: 112 },
    { label: 'fucking retard', value: 110 },
    { label: 'mentally retarded', value: 107 },
    { label: 'never full', value: 65 },
    { label: 'so retarded', value: 58 },
    { label: 'complete idiot', value: 51 },
    { label: 'fucking stupid', value: 46 },
    { label: 'dumb ass', value: 42 },
  ],
};

const TRIGRAMS_BY_CLASS: Record<string, { label: string; value: number }[]> = {
  NotHate: [
    { label: 'real ass bitch', value: 537 },
    { label: 'ass bitch give', value: 481 },
    { label: 'dick van dyke', value: 475 },
    { label: 'bitch give fuck', value: 417 },
    { label: 'nigga look like', value: 386 },
    { label: 'jason van dyke', value: 384 },
    { label: 'van dyke show', value: 352 },
    { label: 'look like nigga', value: 328 },
    { label: 'nigga dont know', value: 301 },
    { label: 'shit ass nigga', value: 288 },
  ],
  Racist: [
    { label: 'nigga look like', value: 38 },
    { label: 'playing race card', value: 35 },
    { label: 'die nigger die', value: 31 },
    { label: 'real ass bitch', value: 29 },
    { label: 'play race card', value: 28 },
    { label: 'bitch ass nigga', value: 25 },
    { label: 'lazy black people', value: 22 },
    { label: 'white trash nigger', value: 20 },
    { label: 'race baiting bullshit', value: 18 },
    { label: 'black lives matter', value: 16 },
  ],
  Sexist: [
    { label: 'babecock cock sissy', value: 24 },
    { label: 'cock sissy faggot', value: 24 },
    { label: 'sissy faggot batecock', value: 24 },
    { label: 'babe cock babecock', value: 19 },
    { label: 'cock babecock cock', value: 19 },
    { label: 'real ass bitch', value: 18 },
    { label: 'stupid ass bitch', value: 16 },
    { label: 'fat ugly bitch', value: 15 },
    { label: 'hoe ass bitch', value: 14 },
    { label: 'women need shut', value: 13 },
  ],
  Homophobe: [
    { label: 'big dyke energy', value: 72 },
    { label: 'straight men use', value: 44 },
    { label: 'men use faggot', value: 44 },
    { label: 'use faggot amusement', value: 43 },
    { label: 'faggot amusement see', value: 43 },
    { label: 'faggot look see', value: 24 },
    { label: 'call someone faggot', value: 22 },
    { label: 'fucking dyke ass', value: 20 },
    { label: 'gay people suck', value: 18 },
    { label: 'no homo bro', value: 16 },
  ],
  Religion: [
    { label: 'arab spring legacy', value: 5 },
    { label: 'spring legacy islamist', value: 5 },
    { label: 'legacy islamist gang', value: 5 },
    { label: 'islamist gang terror', value: 5 },
    { label: 'gang terror blumenthal', value: 5 },
    { label: 'terror blumenthal lordofwar', value: 5 },
    { label: 'ban islam now', value: 4 },
    { label: 'radical muslim threat', value: 4 },
    { label: 'sharia law ban', value: 4 },
    { label: 'islam terrorism rant', value: 4 },
  ],
  OtherHate: [
    { label: 'never full retard', value: 62 },
    { label: 'went full retard', value: 59 },
    { label: 'must retarded think', value: 42 },
    { label: 'gone full retard', value: 34 },
    { label: 'sessions mentally retarded', value: 28 },
    { label: 'going full retard', value: 19 },
    { label: 'act like retard', value: 17 },
    { label: 'so fucking stupid', value: 15 },
    { label: 'dumbest shit ever', value: 14 },
    { label: 'intellectual disability slur', value: 12 },
  ],
};

/** Top-15 English stopword counts per class (frozen from the notebook export; path was `public/hate/25_top_stop_words_by_class.json`). */
const STOP_WORDS_BY_CLASS: Record<string, { label: string; value: number }[]> = {
  NotHate: [
    { label: 'a', value: 38215 },
    { label: 'i', value: 30999 },
    { label: 'the', value: 28700 },
    { label: 'this', value: 25438 },
    { label: 'you', value: 22505 },
    { label: 'to', value: 19268 },
    { label: 'my', value: 19144 },
    { label: 'me', value: 14593 },
    { label: 'and', value: 13883 },
    { label: 'that', value: 13761 },
    { label: 'is', value: 11666 },
    { label: 'in', value: 11482 },
    { label: 's', value: 10659 },
    { label: 't', value: 10465 },
    { label: 'on', value: 9710 },
  ],
  Racist: [
    { label: 'a', value: 3704 },
    { label: 'i', value: 2994 },
    { label: 'the', value: 2932 },
    { label: 'this', value: 2464 },
    { label: 'you', value: 2238 },
    { label: 'my', value: 1800 },
    { label: 'to', value: 1698 },
    { label: 'me', value: 1533 },
    { label: 'that', value: 1415 },
    { label: 'and', value: 1245 },
    { label: 'is', value: 1092 },
    { label: 'in', value: 1064 },
    { label: 't', value: 1039 },
    { label: 's', value: 963 },
    { label: 'on', value: 917 },
  ],
  Sexist: [
    { label: 'a', value: 1261 },
    { label: 'the', value: 773 },
    { label: 'you', value: 755 },
    { label: 'i', value: 661 },
    { label: 'and', value: 612 },
    { label: 'her', value: 609 },
    { label: 'to', value: 558 },
    { label: 'this', value: 546 },
    { label: 'is', value: 410 },
    { label: 'my', value: 409 },
    { label: 'in', value: 394 },
    { label: 'me', value: 341 },
    { label: 'that', value: 336 },
    { label: 's', value: 323 },
    { label: 'with', value: 304 },
  ],
  Homophobe: [
    { label: 'a', value: 1711 },
    { label: 'i', value: 1057 },
    { label: 'you', value: 742 },
    { label: 'the', value: 726 },
    { label: 'me', value: 626 },
    { label: 'this', value: 615 },
    { label: 'to', value: 545 },
    { label: 'and', value: 489 },
    { label: 'my', value: 483 },
    { label: 'is', value: 364 },
    { label: 'for', value: 326 },
    { label: 'in', value: 305 },
    { label: 's', value: 301 },
    { label: 'that', value: 287 },
    { label: 'it', value: 282 },
  ],
  Religion: [
    { label: 'is', value: 45 },
    { label: 'the', value: 45 },
    { label: 'to', value: 35 },
    { label: 'a', value: 32 },
    { label: 'and', value: 28 },
    { label: 'of', value: 26 },
    { label: 'you', value: 23 },
    { label: 'this', value: 21 },
    { label: 's', value: 20 },
    { label: 'in', value: 18 },
    { label: 'that', value: 16 },
    { label: 'it', value: 16 },
    { label: 'for', value: 14 },
    { label: 'be', value: 14 },
    { label: 'i', value: 13 },
  ],
  OtherHate: [
    { label: 'you', value: 1677 },
    { label: 'a', value: 1479 },
    { label: 'the', value: 1339 },
    { label: 'i', value: 1253 },
    { label: 'this', value: 911 },
    { label: 'is', value: 886 },
    { label: 'to', value: 793 },
    { label: 'and', value: 655 },
    { label: 's', value: 621 },
    { label: 'of', value: 541 },
    { label: 'are', value: 501 },
    { label: 'me', value: 487 },
    { label: 'that', value: 452 },
    { label: 'my', value: 439 },
    { label: 'it', value: 427 },
  ],
};

const IMAGE_SUMMARY = [
  { name: 'NotHate', sampleN: 4134, aspectMean: 1.174, fileSizeMean: 42.147, widthMean: 649.243, heightMean: 604.447, brightness: 103.697, sharpness: 8.785, saturation: 86.92, contrast: 63.09, edgeDensity: 0.05, corruptPct: 0.0, personRate: 68.82, rgb: [113.4, 101.1, 96.7] as const, palette: 'rgb(113, 101, 96)' },
  { name: 'Racist', sampleN: 400, aspectMean: 1.147, fileSizeMean: 41.502, widthMean: 629.502, heightMean: 592.985, brightness: 104.004, sharpness: 9.091, saturation: 86.806, contrast: 63.864, edgeDensity: 0.052, corruptPct: 0.0, personRate: 70.09, rgb: [112.9, 101.9, 97.2] as const, palette: 'rgb(112, 101, 97)' },
  { name: 'Sexist', sampleN: 124, aspectMean: 1.125, fileSizeMean: 43.544, widthMean: 648.048, heightMean: 638.347, brightness: 106.028, sharpness: 8.289, saturation: 89.11, contrast: 62.298, edgeDensity: 0.044, corruptPct: 0.0, personRate: 54.29, rgb: [118.5, 102.8, 96.8] as const, palette: 'rgb(118, 102, 96)' },
  { name: 'Homophobe', sampleN: 127, aspectMean: 1.109, fileSizeMean: 39.487, widthMean: 626.882, heightMean: 620.724, brightness: 111.714, sharpness: 7.547, saturation: 88.282, contrast: 64.807, edgeDensity: 0.043, corruptPct: 0.0, personRate: 92.31, rgb: [124.2, 106.2, 104.8] as const, palette: 'rgb(124, 106, 104)' },
  { name: 'Religion', sampleN: 8, aspectMean: 1.448, fileSizeMean: 48.364, widthMean: 724.125, heightMean: 500.125, brightness: 111.18, sharpness: 14.28, saturation: 85.869, contrast: 72.105, edgeDensity: 0.072, corruptPct: 0.0, personRate: 0, rgb: [111.2, 110.4, 111.9] as const, palette: 'rgb(111, 110, 111)' },
  { name: 'OtherHate', sampleN: 207, aspectMean: 1.174, fileSizeMean: 43.407, widthMean: 643.768, heightMean: 594.536, brightness: 103.61, sharpness: 9.843, saturation: 84.247, contrast: 64.251, edgeDensity: 0.055, corruptPct: 0.0, personRate: 55, rgb: [113.0, 101.6, 96.2] as const, palette: 'rgb(113, 101, 96)' },
] as const;

const MULTIMODAL_SUMMARY = [
  { name: 'NotHate', ocrCoverage: 39.07, textHeavyRatio: 21.97, cosineMean: 5.22, jaccardMean: 2.74, tweetWords: 10.43, ocrWords: 13.57 },
  { name: 'Racist', ocrCoverage: 38.51, textHeavyRatio: 21.97, cosineMean: 5.57, jaccardMean: 3.03, tweetWords: 10.19, ocrWords: 13.39 },
  { name: 'Sexist', ocrCoverage: 41.41, textHeavyRatio: 19.2, cosineMean: 3.8, jaccardMean: 2.07, tweetWords: 10.79, ocrWords: 12.71 },
  { name: 'Homophobe', ocrCoverage: 36.88, textHeavyRatio: 20.43, cosineMean: 4.31, jaccardMean: 2.58, tweetWords: 9.73, ocrWords: 12.71 },
  { name: 'Religion', ocrCoverage: 61.96, textHeavyRatio: 49.69, cosineMean: 0.0, jaccardMean: 0.0, tweetWords: 11.46, ocrWords: 16.52 },
  { name: 'OtherHate', ocrCoverage: 51.97, textHeavyRatio: 34.14, cosineMean: 7.49, jaccardMean: 4.66, tweetWords: 10.09, ocrWords: 18.39 },
] as const;

const TOTAL_SAMPLE_COUNT = 149823;

const CORPUS_AVG_WORDS =
  CLASS_PROFILE_BUBBLES.reduce((sum, row) => sum + row.count * row.avgWords, 0) / TOTAL_SAMPLE_COUNT;
const CORPUS_AVG_CHARS =
  CLASS_PROFILE_BUBBLES.reduce((sum, row) => sum + row.count * row.avgChars, 0) / TOTAL_SAMPLE_COUNT;
const CORPUS_MEAN_FILE_KB =
  CLASS_BALANCE_SERIES.reduce((sum, row) => {
    const img = IMAGE_SUMMARY.find((i) => i.name === row.name)!;
    return sum + row.count * img.fileSizeMean;
  }, 0) / TOTAL_SAMPLE_COUNT;
const CORPUS_MEAN_OCR_COVERAGE_PCT =
  MULTIMODAL_SUMMARY.reduce((sum, row) => {
    const count = CLASS_BALANCE_SERIES.find((c) => c.name === row.name)!.count;
    return sum + count * row.ocrCoverage;
  }, 0) / TOTAL_SAMPLE_COUNT;

/** High-level corpus descriptors; modality-specific metrics appear in each section header. */
const OVERVIEW_CORE_STATS = [
  { value: TOTAL_SAMPLE_COUNT.toLocaleString(), label: 'Tweet–image pairs' },
  { value: '6', label: 'Target classes' },
  { value: '3', label: 'Annotators per item (AMT)' },
  { value: '51', label: 'Hatebase seed terms' },
] as const;

const TEXT_SECTION_STATS = [
  { value: CORPUS_AVG_WORDS.toFixed(1), label: 'Mean caption length (words, corpus-wide)' },
  { value: Math.round(CORPUS_AVG_CHARS).toLocaleString(), label: 'Mean caption length (characters)' },
] as const;

const IMAGE_SECTION_STATS = [
  { value: '500 px', label: 'Shortest side after resize' },
  { value: `${CORPUS_MEAN_FILE_KB.toFixed(0)} KB`, label: 'Corpus mean file size' },
  { value: `${CORPUS_MEAN_OCR_COVERAGE_PCT.toFixed(1)}%`, label: 'Mean OCR coverage (by class)' },
] as const;

/** Six-way hate-speech label set (MMHS150K / WACV 2020; see dataset readme). */
const TARGET_CLASS_LABELS = [
  { id: '0', name: 'NotHate', desc: 'No targeted attack toward a protected or hate-relevant group.' },
  { id: '1', name: 'Racist', desc: 'Race- or ethnicity-targeted slurs or derogation.' },
  { id: '2', name: 'Sexist', desc: 'Gender- or sexuality-adjacent misogynistic content.' },
  { id: '3', name: 'Homophobe', desc: 'Anti-LGBTQ+ hostility.' },
  { id: '4', name: 'Religion', desc: 'Religion- or belief-targeted attacks.' },
  { id: '5', name: 'OtherHate', desc: 'Other community-directed hate not covered above.' },
] as const;

/** Condensed schema excerpt for `MMHS150K_GT.json` (aligns with Kaggle/readme field names). */
const MMHS_FEATURE_DICTIONARY = [
  { feature: 'id', type: 'Numerical', description: 'Tweet ID (unique key in MMHS150K_GT.json).' },
  { feature: 'img_url', type: 'Categorical', description: 'URL of the image paired with the tweet.' },
  { feature: 'tweet_text', type: 'Categorical', description: 'Tweet body text.' },
  { feature: 'labels', type: 'Numerical', description: 'Three integer labels in [0–5], one per AMT worker.' },
  { feature: 'labels_str', type: 'Categorical', description: 'Three string labels (same workers).' },
  { feature: 'tweet_url', type: 'Categorical', description: 'Direct link to the original tweet.' },
] as const;

/** Class-prior summary (paired with preprocessing section on imbalance and rare classes). */
const CLASS_IMBALANCE_STATS = [
  { value: '82.77%', label: 'NotHate share' },
  { value: '0.11%', label: 'Religion share' },
  { value: '760x', label: 'Largest vs smallest class' },
] as const;

const PLOT_CONFIG = { displayModeBar: false, responsive: true, displaylogo: false } as const;

/** Inter stack — matches `index.css` `.hate-eda` body copy. */
const HATE_PLOT_FONT_FAMILY = 'Inter, ui-sans-serif, system-ui, sans-serif';

/** Shared Plotly fragment: font, transparent plot area, dark hovers (all MMHS charts). */
const HATE_PLOT_LAYOUT_BASE: Record<string, unknown> = {
  font: { family: HATE_PLOT_FONT_FAMILY, color: '#334155', size: 12 },
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  hoverlabel: {
    bgcolor: '#0f172a',
    bordercolor: 'transparent',
    font: { family: HATE_PLOT_FONT_FAMILY, size: 12, color: '#f8fafc' },
  },
};

/** Secondary panels (callouts, captions inside viz cards). */
const HATE_CALLOUT_SURFACE = 'rounded-2xl border border-sky-200/50 bg-white shadow-sm shadow-slate-200/25';

/** Focus style for keyboard users (matches sky accent). */
const HATE_FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

/** Shared horizontal legend parked below plot area (prevents overlap with traces). */
const HATE_BOTTOM_LEGEND = {
  orientation: 'h' as const,
  y: -0.3,
  yanchor: 'top' as const,
  x: 0,
  xanchor: 'left' as const,
  font: { size: 11, family: HATE_PLOT_FONT_FAMILY, color: '#475569' },
};

/** Extra bottom room for legend + axis title/ticks. */
const HATE_BOTTOM_LEGEND_MARGIN = { b: 84 };

/** Minimal donut layout: no inner hole gap, horizontal legend below trace. */
const DONUT_PIE_LAYOUT = {
  autosize: true,
  height: 540,
  margin: { l: 8, r: 8, t: 8, b: 112 },
  ...HATE_PLOT_LAYOUT_BASE,
  font: { family: HATE_PLOT_FONT_FAMILY, color: '#0f172a', size: 13 },
  legend: {
    orientation: 'h' as const,
    x: 0.5,
    xanchor: 'center' as const,
    y: -0.22,
    yanchor: 'top' as const,
    bgcolor: 'rgba(0,0,0,0)',
    borderwidth: 0,
    itemwidth: 22,
    tracegroupgap: 0,
    font: { size: 13, color: '#475569', family: HATE_PLOT_FONT_FAMILY },
  },
  annotations: [] as { text?: string }[],
};

/** Brightness vs sharpness scatter from notebook dashboard export. */
const hateDataUrl = (filename: string) => new URL(`./data/${filename}`, import.meta.url).href;
const IMAGE_BRIGHTNESS_SHARPNESS_JSON_PATH = hateDataUrl('11_image_distribution_dashboard.json');
const WORD_COUNT_HIST_JSON_PATH = hateDataUrl('02A_word_count_distribution.json');
const CHAR_COUNT_HIST_JSON_PATH = hateDataUrl('02B_char_count_distribution.json');
const CLASS_COSINE_HEATMAP_JSON_PATH = hateDataUrl('19_text_cosine_similarity_heatmap.json');
const MULTIMODAL_DASHBOARD_JSON_PATH = hateDataUrl('14_multimodal_dashboard.json');
const VOCAB_RICHNESS_JSON_PATH = hateDataUrl('26_vocabulary_richness.json');
const DATASET_DONUTS_JSON_PATH = hateDataUrl('01_dataset_donuts.json');
const TEXT_DISTRIBUTION_DASHBOARD_JSON_PATH = hateDataUrl('02_text_distribution_dashboard.json');
const CLASS_PROFILE_RADAR_JSON_PATH = hateDataUrl('08_class_profile_radar.json');
const CLASS_SUMMARY_BUBBLE_JSON_PATH = hateDataUrl('09_class_summary_bubble.json');
const TEXT_QUALITY_DASHBOARD_JSON_PATH = hateDataUrl('10_text_quality_dashboard.json');
const EMOJI_COUNT_DIST_JSON_PATH = hateDataUrl('10A_emoji_count_distribution.json');
const LANGUAGE_DIST_JSON_PATH = hateDataUrl('10B_updated_language_distribution.json');
const IMAGE_COMPLEXITY_EDGE_JSON_PATH = hateDataUrl('13B_image_complexity_edge_density.json');
const TWEET_OCR_LENGTH_SCATTER_JSON_PATH = hateDataUrl('15_tweet_vs_ocr_length_scatter.json');
const PERSON_PRESENCE_JSON_PATH = hateDataUrl('17_person_presence_rate.json');
const GRAD_CAM_JSON_PATH = hateDataUrl('18_grad_cam_heatmap.json');
const IMAGE_COSINE_HEATMAP_JSON_PATH = hateDataUrl('20_image_cosine_similarity_heatmap.json');
const CENSORSHIP_EVASION_JSON_PATH = hateDataUrl('622_censorship_evasion.json');
/** Plotly-export JSON: `data[]` traces with `name` = `{Class}_{tweetId}` and `source` = embedded `data:image/png;base64,...`. */
const GALLERY_SAMPLE_JSON_PATH = hateDataUrl('gallery_plotly.json');

type GalleryPlotlyTrace = { name?: string; source?: string };

function parseGalleryClassFromTraceName(name: string): string | null {
  for (const cls of [...CLASS_ORDER].sort((a, b) => b.length - a.length)) {
    if (name.startsWith(`${cls}_`)) return cls;
  }
  return null;
}

function galleryTweetIdNote(name: string, classKey: string): string {
  const prefix = `${classKey}_`;
  const id = name.startsWith(prefix) ? name.slice(prefix.length) : name;
  return id ? `Tweet id: ${id}` : name;
}

/** Marker colors on notebook scatter "Brightness vs Sharpness" → dashboard class keys. */
const NOTEBOOK_SCATTER_HEX_TO_CLASS: Record<string, string> = {
  '#2E7D32': 'NotHate',
  '#C62828': 'Racist',
  '#455A64': 'OtherHate',
  '#6A1B9A': 'Homophobe',
  '#AD1457': 'Sexist',
  '#EF6C00': 'Religion',
};

function sanitizeNotebookFigureLayout(layout: Record<string, unknown> | undefined, height: number) {
  const raw = layout && typeof layout === 'object' ? { ...layout } : {};
  delete (raw as { template?: unknown }).template;
  const prevFont =
    raw.font && typeof raw.font === 'object' && raw.font !== null ? (raw.font as Record<string, unknown>) : {};
  const prevHover =
    raw.hoverlabel && typeof raw.hoverlabel === 'object' && raw.hoverlabel !== null
      ? (raw.hoverlabel as Record<string, unknown>)
      : {};
  const { font: _dropFont, hoverlabel: _dropHover, ...rest } = raw;
  return {
    ...rest,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height,
    font: {
      family: HATE_PLOT_FONT_FAMILY,
      color: '#334155',
      size: 12,
      ...prevFont,
    },
    hoverlabel: {
      bgcolor: '#0f172a',
      bordercolor: 'transparent',
      font: { family: HATE_PLOT_FONT_FAMILY, size: 12, color: '#f8fafc' },
      ...prevHover,
    },
  };
}

function normalizeHeatmapColorbar(data: any[] | undefined): any[] {
  return (data ?? []).map((trace) => {
    if (!trace || trace.type !== 'heatmap') return trace;
    const titleText =
      typeof trace?.colorbar?.title?.text === 'string'
        ? trace.colorbar.title.text.toLowerCase()
        : '';
    const shouldAdjust = titleText.includes('similarity') || titleText.includes('relative');
    if (!shouldAdjust) return trace;

    return {
      ...trace,
      colorbar: {
        ...(trace.colorbar ?? {}),
        x: typeof trace?.colorbar?.x === 'number' ? trace.colorbar.x : 1.08,
        xpad: 28,
        ticklabelposition: 'outside right',
        title: {
          ...(trace?.colorbar?.title ?? {}),
          side: 'top',
        },
      },
    };
  });
}

/** public/hate/02A_word_count_distribution.json & 02B: overlay histograms only (drop paired box traces). */
function hate02HistogramOverlayTraces(spec: { data?: any[] } | null | undefined): any[] {
  return (spec?.data ?? [])
    .filter((t) => t?.type === 'histogram')
    .map((t) => ({
      ...t,
      xaxis: undefined,
      yaxis: undefined,
      marker: {
        ...(t.marker ?? {}),
        color: CLASS_COLOR_MAP[t.name] ?? '#64748b',
        opacity: 0.48,
      },
    }));
}

/** public/hate/14_multimodal_dashboard.json trace index 2 = Tweet vs OCR cosine (box). */
function tweetOcrCosineBoxTraces(spec: { data?: any[] } | null | undefined): any[] {
  const raw = spec?.data?.[2];
  if (!raw || raw.type !== 'box') return [];
  const t = { ...raw };
  delete t.xaxis;
  delete t.yaxis;
  return [t];
}

type VocabularyRichnessJsonRow = {
  Class: string;
  TotalTokens: number;
  UniqueTokens: number;
  TTR: number;
};

/** Table + bars for public/hate/26_vocabulary_richness.json (TTR sorted high → low). */
function VocabularyRichnessTable({ rows }: { rows: VocabularyRichnessJsonRow[] }) {
  const sorted = useMemo(() => [...rows].sort((a, b) => b.TTR - a.TTR), [rows]);

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm shadow-sky-100/50">
      <div className="overflow-x-auto">
        <div className="min-w-xl">
          <div
            className="grid gap-x-4 border-b border-sky-100/90 bg-slate-50/80 px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500"
            style={{
              gridTemplateColumns:
                'minmax(5.5rem, 1fr) minmax(5rem, auto) minmax(5.5rem, auto) minmax(6.5rem, auto) minmax(7rem, 1.15fr)',
            }}
          >
            <div>Class</div>
            <div className="text-right tabular-nums">Total words</div>
            <div className="text-right tabular-nums">Unique words</div>
            <div className="text-right tabular-nums">Lexical richness</div>
            <div className="min-w-28">TTR bar</div>
          </div>
          <div className="divide-y divide-slate-100">
            {sorted.map((r) => {
              const pct = r.TTR * 100;
              const barColor = CLASS_COLOR_MAP[r.Class] ?? '#64748b';
              const richnessHint =
                r.Class === 'Religion'
                  ? 'Religion has very few total tokens (n=1,093), so TTR can appear inflated because a small denominator raises the unique-token ratio.'
                  : undefined;
              return (
                <div
                  key={r.Class}
                  className="grid items-center gap-x-4 px-4 py-3 text-sm"
                  style={{
                    gridTemplateColumns:
                      'minmax(5.5rem, 1fr) minmax(5rem, auto) minmax(5.5rem, auto) minmax(6.5rem, auto) minmax(7rem, 1.15fr)',
                  }}
                >
                  <div className="font-bold tracking-tight text-slate-900" title={richnessHint}>
                    {r.Class}
                    {r.Class === 'Religion' ? (
                      <span className="ml-1 align-middle text-xs font-black text-amber-600" title={richnessHint}>
                        ⓘ
                      </span>
                    ) : null}
                  </div>
                  <div className="text-right tabular-nums text-slate-600">{r.TotalTokens.toLocaleString('en-US')}</div>
                  <div className="text-right tabular-nums text-slate-600">{r.UniqueTokens.toLocaleString('en-US')}</div>
                  <div className="text-right tabular-nums font-medium text-slate-800">{pct.toFixed(2)}%</div>
                  <div className="min-w-0">
                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-slate-200/90"
                      title={`${r.Class}: TTR ${pct.toFixed(2)}%`}
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-500 ease-out"
                        style={{
                          width: `${Math.min(100, Math.max(0, pct))}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** One bar trace: class → mean normalized edge density from notebook violin export (`13B_image_complexity_edge_density.json`). */
function buildEdgeDensityMeanBarFromViolinFigure(fig: { data?: any[] } | null | undefined): any[] {
  const byName: Record<string, number[]> = {};
  for (const t of fig?.data ?? []) {
    if (t?.type !== 'violin' && t?.type !== 'box') continue;
    const name = typeof t.name === 'string' ? t.name : '';
    const ys = Array.isArray(t.y) ? t.y.map((v: unknown) => Number(v)).filter((x: number) => !Number.isNaN(x)) : [];
    if (!name || ys.length === 0) continue;
    if (!byName[name]) byName[name] = [];
    byName[name].push(...ys);
  }
  const classes = CLASS_ORDER.filter((c) => (byName[c]?.length ?? 0) > 0);
  if (classes.length === 0) return [];
  const means = classes.map((c) => {
    const arr = byName[c];
    return arr.reduce((s, v) => s + v, 0) / arr.length;
  });
  return [
    {
      type: 'bar' as const,
      x: classes,
      y: means,
      marker: { color: classes.map((c) => CLASS_COLOR_MAP[c]), line: { color: '#ffffff', width: 1 } },
      text: means.map((m) => m.toFixed(3)),
      textposition: 'outside',
      hovertemplate: '<b>%{x}</b><br>Mean edge density: %{y:.4f}<extra></extra>',
      cliponaxis: false,
    },
  ];
}

/** One bar trace: class → mean Laplacian sharpness from dashboard scatter sample (same 5k points as multimodal brightness plot). */
function buildSharpnessMeanBarFromNotebookScatter(trace: any): any[] {
  const colors: string[] = Array.isArray(trace?.marker?.color) ? trace.marker.color : [];
  const ys: number[] = Array.isArray(trace?.y) ? trace.y : [];
  const byClass: Record<string, number[]> = {};
  const n = Math.min(colors.length, ys.length);
  for (let i = 0; i < n; i += 1) {
    const cls = NOTEBOOK_SCATTER_HEX_TO_CLASS[colors[i]];
    if (!cls) continue;
    if (!byClass[cls]) byClass[cls] = [];
    byClass[cls].push(Number(ys[i]));
  }
  const classes = CLASS_ORDER.filter((name) => (byClass[name]?.length ?? 0) > 0);
  if (classes.length === 0) return [];
  const means = classes.map((name) => {
    const arr = byClass[name];
    return arr.reduce((s, v) => s + v, 0) / arr.length;
  });
  return [
    {
      type: 'bar' as const,
      x: classes,
      y: means,
      marker: { color: classes.map((c) => CLASS_COLOR_MAP[c]), line: { color: '#ffffff', width: 1 } },
      text: means.map((m) => m.toFixed(1)),
      textposition: 'outside',
      hovertemplate: '<b>%{x}</b><br>Mean sharpness: %{y:.2f}<extra></extra>',
      cliponaxis: false,
    },
  ];
}

/** public/hate/10_text_quality_dashboard.json - subplot "Potential Text Outliers by Class". */
const NOTEBOOK_TEXT_OUTLIERS_BY_CLASS = [
  { name: 'NotHate', count: 18 },
  { name: 'Racist', count: 2 },
  { name: 'Sexist', count: 0 },
  { name: 'Homophobe', count: 0 },
  { name: 'Religion', count: 0 },
  { name: 'OtherHate', count: 0 },
] as const;

const OVERVIEW_BRIEF = [
  {
    label: 'Source',
    value:
      'MMHS150K (Gomez et al., WACV 2020, “Exploring Hate Speech Detection in Multimodal Publications”). Dataset package and readme on Kaggle mirror the paper’s released files.',
  },
  {
    label: 'Unit of analysis',
    value:
      'Each row is one tweet with a downloaded image; optional OCR text lives under img_txt/. Three AMT labels per tweet are stored in labels / labels_str.',
  },
  {
    label: 'License & usability',
    value:
      'Data files © original authors. Typical Kaggle usability score ≈ 9.4; update frequency listed as none - static snapshot.',
  },
  {
    label: 'EDA focus',
    value:
      'Class imbalance and noise, tweet-text patterns, image geometry and quality and tweet–OCR alignment for multimodal modeling.',
  },
];

const SAMPLE_STRUCTURE = [
  {
    title: 'Raw fields',
    chips: ['id', 'tweet_text', 'img_path', 'split', 'label_0', 'label_1', 'label_2'],
  },
  {
    title: 'Derived text',
    chips: ['tokens', 'word_count', 'char_count', 'emoji_count', 'punct_ratio', 'all_caps_ratio'],
  },
  {
    title: 'OCR features',
    chips: ['img_text', 'img_tokens', 'img_text_len', 'has_img_text', 'tweet↔OCR similarity'],
  },
  {
    title: 'Image features',
    chips: ['width', 'height', 'aspect_ratio', 'brightness', 'contrast', 'sharpness', 'YOLO objects'],
  },
];

const CLASS_ROWS: { name: string; count: string; pct: string; signal: string[] }[] = [
  {
    name: 'NotHate',
    count: '124,005',
    pct: '82.77%',
    signal: [
      'Majority baseline: models can look accurate while mostly learning to predict “not hate.”',
      'Wording is comparatively uniform (lower lexical diversity), so hate vs. not-hate is harder to tease apart with vocabulary-only cues.',
    ],
  },
  {
    name: 'Racist',
    count: '12,287',
    pct: '8.20%',
    signal: [
      'Abuse often shows up in image / OCR text or memes while the tweet stays indirect or polite.',
      'Caption–OCR alignment is a core multimodal signal; tweet-only moderation misses a lot of cases.',
    ],
  },
  {
    name: 'OtherHate',
    count: '5,811',
    pct: '3.88%',
    signal: [
      'Catch-all toxic category: mixed phenomena get lumped together, so labels are inherently noisier.',
      'Expect lower annotator agreement than for slur-heavy racism or homophobia-interpret metrics cautiously.',
    ],
  },
  {
    name: 'Homophobe',
    count: '3,886',
    pct: '2.59%',
    signal: [
      'Vocabulary clusters around a small set of recurring slurs and phrases.',
      'Lexicon-style features are informative but still need context to limit false positives.',
    ],
  },
  {
    name: 'Sexist',
    count: '3,671',
    pct: '2.45%',
    signal: [
      'Strong stylistic cues: insult framing, punctuation rhythm, formatting habits.',
      'OCR adds signal beyond the tweet body-what is written on the image still matters.',
    ],
  },
  {
    name: 'Religion',
    count: '163',
    pct: '0.11%',
    signal: [
      'Tiny sample: any rate, average, or learned weight jumps easily with a handful of tweets.',
      'Treat numbers as illustrative unless you add targeted review or more data for this class.',
    ],
  },
];



const NOISE_RISKS = [
  {
    title: 'Extreme class imbalance',
    detail:
      'The non-hate majority dominates the prior; accuracy without per-class metrics would overstate practical utility.',
  },
  {
    title: 'Annotation noise and subjectivity',
    detail:
      'Borderline and “other hate” instances show higher disagreement, which bounds inter-annotator consistency and model ceiling.',
  },
  {
    title: 'Sparse OCR',
    detail:
      'A large share of images yield empty OCR strings, yet conditional on text valid OCR is often highly discriminative.',
  },
  {
    title: 'Meme and screenshot artefacts',
    detail:
      'Heavy compression, collages and on-image typography challenge low-level colour statistics and generic CNN embeddings.',
  },
];

const TEXT_FINDINGS = [
  'Minority hate classes are smaller in volume but tend to exhibit higher lexical concentration than the neutral majority.',
  'Stylistic features-capitalisation, punctuation density, emoji rate and lexicon hits-remain informative alongside n-gram statistics.',
  'Discriminative n-grams and TF–IDF summaries support interpretation better than decorative word-cloud summaries alone.',
];

const IMAGE_FINDINGS = [
  'Mean width and height by class show layout differences (e.g. wider Religion images) without loading heavy marginal histograms.',
  'Brightness and sharpness describe capture quality and collage-like layouts; they are weak proxies for hate content unless combined with OCR and text.',
  'Detector-based object counts and attribution-style maps (e.g. Grad-CAM) aid qualitative validation more than global colour summaries.',
];

const MULTIMODAL_FINDINGS = [
  'Image-side OCR coverage is a primary motivation for joint text–image modelling on this corpus.',
  'Tweet captions and OCR transcripts are often complementary rather than redundant.',
  'Cases where hate appears only in OCR underline the risk of caption-only moderation pipelines.',
];

const RECOMMENDATIONS = [
  'Report macro-F1, per-class recall and confusion structure-not headline accuracy alone.',
  'Mitigate class skew via reweighting, resampling, or cost-sensitive objectives tuned to rare hate categories.',
  'Model tweet text, OCR text and image embeddings as distinct inputs with explicit fusion or late interaction.',
  'Retain transparent covariates (OCR coverage, lexicon hits, agreement rates, person presence) for error analysis and auditing.',
  'Stress-test on low-agreement and adversarial “caption clean / image toxic” examples rather than assuming noise-free labels.',
];

const SAMPLE_TWEETS: Record<string, string[]> = {
  NotHate: [
    '@disliwisli and then it\'s "ya always tryna change a nigga" mannnnn listen',
    'When a nigga tries to play you but you play them first',
    'Anything else to say? I didn\'t think so. #defendourborders #secureourpeople #buildthewall',
    'Morning timeline just memes and random takes, nothing serious today.',
    'Bro posted that clip again and everyone in replies is just laughing.',
  ],
  Racist: [
    'DONT EVEN THINK ABOUT THROWIN OUT WHITE TRASH!!!!',
    'This is just to much for a nigger to handle, we going to miss you',
    'Me and this nigger trying to get know each other. I\'ll marry anyone who buys this game',
    'Keep your country clean from those people, they ruin everything.',
    'Another rant blaming minorities for jobs and crime all in one thread.',
  ],
  Sexist: [
    'I hate Women that pushes their Arses out when they walk you know you look like a retarded Flamingo, right?',
    '4.5 kg cunt time to get diabetes',
    '@AndyOstroy @FLOTUS Well, she\'s a complicit cunt, just like Ivanka',
    'Women should stay out of politics, they are too emotional for leadership.',
    'That girl talks big online but in real life she is useless.',
  ],
  Homophobe: [
    'Saw a cute dyke at zaxbys today',
    'Bruh this faggot homie',
    'Wow its a faggot #PS4share',
    'Stop pushing gay agenda everywhere, keep that away from kids.',
    'Replies full of slurs toward LGBT people after that pride post.',
  ],
  Religion: [
    'Nigga Jew Nigga Jew',
    '@aperveez @madhukishwar Islam is terrorism, hate, rape',
    'Pakistan Islamists rally against anti-Islam cartoon contest #BanSharia #StopIslam',
    'BanSharia now, these people will destroy our culture if we let them.',
    'Thread targets Muslims with fear language and calls for exclusion.',
  ],
  OtherHate: [
    'Zeke Elliott is completely retarded',
    '@newjackuncut187 Fake New Jack went full retard.',
    '4mt onnat retarded ass shit',
    'Comment section keeps mocking disabled people with repeated insults.',
    'Another post attacking a community with broad hateful stereotypes.',
  ],
};

const CENSORSHIP_EVASION_SAMPLES: { id: string; cls: string; tweet: string; ocr: string }[] = [
  {
    id: '1058763543741390849',
    cls: 'NotHate',
    tweet: '@DlNERODlOR White supremacist trash',
    ocr: "If that's not some white trash I don't know what is.",
  },
  {
    id: '1062392290780610560',
    cls: 'Racist',
    tweet: 'Link post with neutral caption text.',
    ocr: 'Barack Obama and the Jim Crow Media. The Return of the Nigger Breakers.',
  },
  {
    id: '1025046957989998592',
    cls: 'Racist',
    tweet: '@WalshFreedom @nytimes Speaking of white + trash ...',
    ocr: 'WHITE TRASH',
  },
  {
    id: '1047254151388975104',
    cls: 'NotHate',
    tweet: 'Link-only caption.',
    ocr: 'THE WORD NAGA & NIGGER ... became N-G...',
  },
  {
    id: '1024865206936199168',
    cls: 'OtherHate',
    tweet: 'Cultural Appropriation you say ...',
    ocr: 'Redneck Haicu',
  },
  {
    id: '1109789011793596417',
    cls: 'NotHate',
    tweet: '@swissailanit @IsraeliPM ... mulling a response ...',
    ocr: 'Netanyahu. Mulling a tough response to Arab tensions...',
  },
  {
    id: '1114969890648199168',
    cls: 'NotHate',
    tweet: 'Sorry, America',
    ocr: '... bint.bandcamp.com ...',
  },
  {
    id: '1058381901541531649',
    cls: 'NotHate',
    tweet: '#JacobWohl is the very best of today ...',
    ocr: 'Far-right conspiracy theorist gets a moment in spotlight...',
  },
];

const CENSORSHIP_EVASION_CLASS_BREAKDOWN = [
  { name: 'NotHate', count: 38, pct: 80.85 },
  { name: 'Racist', count: 6, pct: 12.77 },
  { name: 'OtherHate', count: 2, pct: 4.26 },
  { name: 'Religion', count: 1, pct: 2.13 },
  { name: 'Homophobe', count: 0, pct: 0.0 },
  { name: 'Sexist', count: 0, pct: 0.0 },
] as const;

const CENSORSHIP_EVASION_TOTAL = CENSORSHIP_EVASION_CLASS_BREAKDOWN.reduce((sum, row) => sum + row.count, 0);
const CENSORSHIP_EVASION_HATE_LABELLED = CENSORSHIP_EVASION_TOTAL - CENSORSHIP_EVASION_CLASS_BREAKDOWN[0].count;

/** Class pills for light surfaces (aligned with chart class colors + sky dashboard chrome). */
const BADGE_STYLES: Record<string, string> = {
  NotHate: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Racist: 'border-red-200 bg-red-50 text-red-900',
  Sexist: 'border-rose-200 bg-rose-50 text-rose-900',
  Homophobe: 'border-violet-200 bg-violet-50 text-violet-900',
  Religion: 'border-amber-200 bg-amber-50 text-amber-900',
  OtherHate: 'border-slate-300 bg-slate-100 text-slate-800',
};

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-sky-200/60 bg-white p-5 shadow-md shadow-slate-200/30 ring-1 ring-slate-200/50">
      <div className="text-3xl font-black tracking-tight text-slate-950 tabular-nums">{value}</div>
      <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</div>
    </div>
  );
}

function VizCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-sky-200/70 bg-white shadow-md shadow-slate-300/20 ring-1 ring-slate-200/60">
      <div className="border-b border-sky-100/90 bg-linear-to-r from-white via-white to-sky-50/40 px-6 py-5">
        <h3 className="hate-eda-title text-lg font-bold tracking-tight text-slate-950">{title}</h3>
        {subtitle && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">{subtitle}</p>}
      </div>
      <div className="bg-slate-50/35 p-4 md:p-6">{children}</div>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[28px] border border-sky-200/70 bg-linear-to-br from-sky-50/90 to-white p-6 shadow-md shadow-slate-200/25 ring-1 ring-slate-200/50">
      <div className="mb-4 flex items-center gap-2 text-sky-700">
        <Sparkles size={16} />
        <h3 className="text-sm font-black uppercase tracking-[0.22em]">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClassBalanceChart() {
  return (
    <div className="space-y-5">
      <LazyPlot
        data={[
          {
            type: 'pie',
            labels: CLASS_BALANCE_SERIES.map((item) => item.name),
            values: CLASS_BALANCE_SERIES.map((item) => item.count),
            hole: 0.38,
            sort: false,
            direction: 'clockwise',
            rotation: 0,
            pull: 0,
            domain: { x: [0.02, 0.98], y: [0.02, 0.93] },
            marker: {
              colors: CLASS_BALANCE_SERIES.map((item) => item.color),
              line: { width: 0 },
            },
            textinfo: 'percent',
            texttemplate: '%{percent:.1%}',
            textposition: 'inside',
            insidetextorientation: 'horizontal',
            textfont: { color: '#ffffff', size: 14, family: HATE_PLOT_FONT_FAMILY },
            hovertemplate: '<b>%{label}</b><br>%{value:,} samples<br>%{percent}<extra></extra>',
            showlegend: true,
          },
        ] as any[]}
        layout={
          {
            ...DONUT_PIE_LAYOUT,
            uniformtext: { minsize: 14, mode: 'hide' },
          } as any
        }
        config={PLOT_CONFIG}
        className="w-full"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CLASS_ROWS.map((row) => (
          <div
            key={row.name}
            className={cn(HATE_CALLOUT_SURFACE, 'border-sky-200/40 p-4 shadow-md shadow-slate-200/20')}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-bold', BADGE_STYLES[row.name])}>
                {row.name}
              </span>
              <span className="text-sm font-black text-slate-900">{row.pct}</span>
            </div>
            <div className="text-lg font-black text-slate-950">{row.count}</div>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-600 marker:text-sky-500">
              {row.signal.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitBalanceChart() {
  return (
    <div className="space-y-5">
      <LazyPlot
        data={[
          {
            type: 'pie',
            labels: SPLIT_BALANCE_SERIES.map((item) => item.name),
            values: SPLIT_BALANCE_SERIES.map((item) => item.count),
            hole: 0.38,
            sort: false,
            direction: 'clockwise',
            rotation: 0,
            pull: 0,
            domain: { x: [0.02, 0.98], y: [0.02, 0.93] },
            marker: {
              colors: SPLIT_BALANCE_SERIES.map((item) => item.color),
              line: { width: 0 },
            },
            textinfo: 'percent',
            texttemplate: '%{percent:.1%}',
            textposition: 'inside',
            insidetextorientation: 'horizontal',
            textfont: { color: '#ffffff', size: 14, family: HATE_PLOT_FONT_FAMILY },
            hovertemplate: '<b>%{label}</b><br>%{value:,} samples<br>%{percent}<extra></extra>',
            showlegend: true,
          },
        ] as any[]}
        layout={
          {
            ...DONUT_PIE_LAYOUT,
            uniformtext: { minsize: 14, mode: 'hide' },
          } as any
        }
        config={PLOT_CONFIG}
        className="w-full"
      />

      <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
          <div className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">Split Counts</div>
          <div className="grid gap-2 sm:grid-cols-3">
            {SPLIT_BALANCE_SERIES.map((item) => (
            <div key={item.name} className={cn(HATE_CALLOUT_SURFACE, 'px-3 py-3 text-center')}>
                <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: item.color }}>
                  {item.name}
                </div>
                <div className="mt-1 text-lg font-black text-slate-950">{item.count.toLocaleString()}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function ClassProfileBubbleChart() {
  return (
    <div className="space-y-5">
      <HateNotebookFigure jsonPath={CLASS_SUMMARY_BUBBLE_JSON_PATH} height={480} />

      <div className="grid gap-3 md:grid-cols-3">
        <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">Read</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Bubble size shows class volume, so imbalance remains visible without overwhelming the rest of the section.</p>
        </div>
        <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">OCR Heavy</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Religion and OtherHate sit furthest right, meaning embedded image text is much more common there.</p>
        </div>
        <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">Agreement</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">NotHate has the strongest label agreement, while hate subclasses cluster lower and look noisier.</p>
        </div>
      </div>
    </div>
  );
}

function ClassSignalSnapshotChart() {
  const metricDefs = [
    { key: 'samples', label: 'Samples', fmt: (v: number) => v.toLocaleString('en-US') },
    { key: 'avgWords', label: 'Avg Words', fmt: (v: number) => v.toFixed(2) },
    { key: 'avgChars', label: 'Avg Chars', fmt: (v: number) => v.toFixed(2) },
    { key: 'avgSentiment', label: 'Avg Sentiment', fmt: (v: number) => v.toFixed(3) },
    { key: 'emojiRate', label: 'Emoji Rate', fmt: (v: number) => `${(v * 100).toFixed(1)}%` },
    { key: 'mentionPct', label: 'Mention Rate', fmt: (v: number) => `${(v * 100).toFixed(1)}%` },
    { key: 'hashtagPct', label: 'Hashtag Rate', fmt: (v: number) => `${(v * 100).toFixed(1)}%` },
    { key: 'punctRatio', label: 'Punctuation Ratio', fmt: (v: number) => `${(v * 100).toFixed(2)}%` },
    { key: 'allCapsRatio', label: 'All-Caps Ratio', fmt: (v: number) => `${(v * 100).toFixed(1)}%` },
    { key: 'hateLexiconRate', label: 'Hate-Lexicon Rate', fmt: (v: number) => `${(v * 100).toFixed(1)}%` },
    { key: 'ocrCoverage', label: 'OCR Coverage', fmt: (v: number) => `${(v * 100).toFixed(1)}%` },
    { key: 'annotatorAgreement', label: 'Annotator Agreement', fmt: (v: number) => `${(v * 100).toFixed(1)}%` },
  ] as const;

  const classNames = CLASS_SIGNAL_SNAPSHOT.map((row) => row.name);

  const z = metricDefs.map((metric) => {
    const values = CLASS_SIGNAL_SNAPSHOT.map((row) => Number((row as any)[metric.key]));
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    if (!Number.isFinite(minV) || !Number.isFinite(maxV) || maxV === minV) {
      return values.map(() => 0.5);
    }
    return values.map((v) => (v - minV) / (maxV - minV));
  });

  const customdata = metricDefs.map((metric) =>
    CLASS_SIGNAL_SNAPSHOT.map((row) => metric.fmt(Number((row as any)[metric.key])))
  );

  return (
    <div className="space-y-4">
      <BasePlot
        height={540}
        data={[
          {
            type: 'heatmap',
            x: classNames,
            y: metricDefs.map((m) => m.label),
            z,
            zmin: 0,
            zmax: 1,
            customdata,
            colorscale: [
              [0, '#eef2ff'],
              [0.5, '#93c5fd'],
              [1, '#1d4ed8'],
            ],
            colorbar: {
              title: { text: 'Relative level', side: 'top' },
              tickvals: [0, 0.5, 1],
              ticktext: ['Low', 'Mid', 'High'],
              thickness: 14,
              x: 1.08,
              xpad: 28,
              ticklabelposition: 'outside right',
            },
            hovertemplate: '<b>%{x}</b><br>%{y}<br>Raw value: %{customdata}<br>Relative level: %{z:.2f}<extra></extra>',
          },
        ] as any[]}
        layout={{
          margin: { l: 150, r: 96, t: 10, b: 64 },
          xaxis: { tickangle: -20 },
          yaxis: { automargin: true },
        }}
      />
      <div className={cn(HATE_CALLOUT_SURFACE, 'px-4 py-3')}>
        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">How to read + key takeaways</div>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-600 marker:text-sky-500">
          <li>Darker color means that class is relatively higher on that metric (not absolute scale).</li>
          <li>Each metric row is normalized within itself; hover shows raw values.</li>
          <li>Religion stands out on OCR coverage and hashtag rate, but sample size is very small.</li>
          <li>Homophobe is highest on hate-lexicon rate, while Racist is high on all-caps and mention rates.</li>
          <li>URL rate is 100% for all classes, so it is omitted from this chart (no between-class variance).</li>
        </ul>
      </div>
    </div>
  );
}

const BasePlot = memo(function BasePlot({
  data,
  layout,
  height = 420,
  className,
}: {
  data: any[];
  layout?: any;
  height?: number;
  className?: string;
}) {
  const withAxisSpacing = (layoutObj: Record<string, unknown>) => {
    const next = { ...layoutObj } as Record<string, any>;
    for (const [k, v] of Object.entries(next)) {
      if (!/^xaxis\d*$/.test(k) && !/^yaxis\d*$/.test(k)) continue;
      const axis = v && typeof v === 'object' ? { ...(v as Record<string, unknown>) } : {};
      const axisTitleRaw = axis.title;
      const axisTitle =
        axisTitleRaw && typeof axisTitleRaw === 'object' ? { ...(axisTitleRaw as Record<string, unknown>) } : { text: axisTitleRaw };
      axis.automargin = true;
      axis.ticklabelstandoff = typeof axis.ticklabelstandoff === 'number' ? Math.max(axis.ticklabelstandoff, 6) : 6;
      axis.title = {
        ...axisTitle,
        standoff:
          typeof (axisTitle as { standoff?: unknown }).standoff === 'number'
            ? Math.max((axisTitle as { standoff: number }).standoff, 18)
            : 18,
      };
      next[k] = axis;
    }
    return next;
  };

  const h = Math.max(height, 360);
  const mergedLayout = withAxisSpacing({
    ...HATE_PLOT_LAYOUT_BASE,
        autosize: true,
    height: h,
    margin: { l: 56, r: 22, t: 32, b: 62 },
    ...layout,
  });

  return <LazyPlot data={data} layout={mergedLayout} config={PLOT_CONFIG} useResizeHandler className={className} />;
});

function ChartDataPlaceholder({ message }: { message: string }) {
  return (
    <div
      className={cn(
        'flex min-h-70 items-center justify-center rounded-xl border border-dashed border-sky-200/70 bg-slate-50/80 px-4 py-10 text-center text-sm text-slate-600 ring-1 ring-slate-200/40'
      )}
    >
      {message}
    </div>
  );
}

/** Load a full Plotly figure JSON from public/hate (or any URL). */
function HateNotebookFigure({
  jsonPath,
        height,
  loadData = true,
  emptyMessage = 'Could not load chart JSON.',
}: {
  jsonPath: string;
  height: number;
  /** When false, skip fetch (use with lazy sections). */
  loadData?: boolean;
  emptyMessage?: string;
}) {
  const [spec, setSpec] = useState<{ data?: any[]; layout?: Record<string, unknown> } | null>(null);

  useEffect(() => {
    if (!loadData) return;
    let alive = true;
    fetch(jsonPath)
      .then((r) => (r.ok ? r.json() : { data: [], layout: {} }))
      .then((j) => {
        if (!alive) return;
        setSpec(j);
      })
      .catch(() => {
        if (!alive) return;
        setSpec({ data: [] });
      });
    return () => {
      alive = false;
    };
  }, [jsonPath, loadData]);

  if (!loadData) {
    return <ChartDataPlaceholder message="Open this section to load chart…" />;
  }
  if (spec === null) {
    return <ChartDataPlaceholder message="Loading chart…" />;
  }
  if (!spec.data?.length) {
    return <ChartDataPlaceholder message={emptyMessage} />;
  }
  return (
    <BasePlot
      height={height}
      data={normalizeHeatmapColorbar(spec.data)}
      layout={sanitizeNotebookFigureLayout(spec.layout, height)}
    />
  );
}

/** Passes through `active` so heavy image charts can tie fetching to the Image section being open. */
function LazyInViewCharts({
  active,
  children,
}: {
  active: boolean;
  children: (loadData: boolean) => React.ReactNode;
}) {
  return <div>{children(active)}</div>;
}

/** Brightness–sharpness scatter only (RGB 3D / PCA removed: no meaningful hate/non-hate separation, heavy JSON). */
function BrightnessSharpnessScatterChart({ loadData }: { loadData: boolean }) {
  const [qualitySpec, setQualitySpec] = useState<any | null>(null);

  useEffect(() => {
    if (!loadData) return;
    let alive = true;
    fetch(IMAGE_BRIGHTNESS_SHARPNESS_JSON_PATH)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load image quality JSON.');
        return res.json();
      })
      .then((json) => {
        if (!alive) return;
        setQualitySpec(json);
      })
      .catch(() => {
        if (!alive) return;
        setQualitySpec({ data: [] });
      });
    return () => {
      alive = false;
    };
  }, [loadData]);

  const qualityScatterTrace = useMemo(() => {
    if (!loadData || qualitySpec === null) return null;
    const traces = (qualitySpec?.data ?? []) as any[];
    const trace = traces.find(
      (item) =>
        item?.type === 'scatter' &&
        item?.xaxis === 'x3' &&
        item?.yaxis === 'y3' &&
        Array.isArray(item?.x) &&
        Array.isArray(item?.y)
    );
    if (!trace) return null;
    const { xaxis: _x, yaxis: _y, ...rest } = trace;
    return {
      ...rest,
      mode: 'markers',
      marker: {
        ...(trace?.marker ?? {}),
        size: 6,
        opacity: 0.52,
      },
      showlegend: false,
    };
  }, [loadData, qualitySpec]);

  if (!loadData) {
    return <ChartDataPlaceholder message="Scroll this section into view to load brightness / sharpness chart." />;
  }
  if (qualitySpec === null) {
    return <ChartDataPlaceholder message="Loading brightness and sharpness…" />;
  }

  return (
    <MiniPanel
      title="Brightness vs Sharpness"
      subtitle="Per-class brightness and sharpness distribution."
    >
      <BasePlot
        height={520}
        data={qualityScatterTrace ? [qualityScatterTrace] : []}
        layout={{
          margin: { l: 56, r: 24, t: 10, b: 52 },
          xaxis: { title: 'Brightness (mean)', gridcolor: '#e2e8f0', zeroline: false },
          yaxis: { title: 'Sharpness (Laplacian variance)', gridcolor: '#e2e8f0', zeroline: false },
        }}
      />
    </MiniPanel>
  );
}

function MiniPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(HATE_CALLOUT_SURFACE, 'border-sky-200/40 p-4 md:p-5')}>
      <div className="mb-3">
        <div className="hate-eda-title text-sm font-black tracking-tight text-slate-950">{title}</div>
        {subtitle && <p className="mt-1 text-xs leading-relaxed text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function DataQualityIssuesChart() {
  const cleanChecks = DATA_QUALITY_ISSUES.filter((item) => item.count === 0);
  const emptyOcrRate = ((DATA_QUALITY_ISSUES.find((item) => item.label === 'Empty OCR text')?.count ?? 0) / TOTAL_SAMPLE_COUNT) * 100;
  const duplicateTweetRate = ((DATA_QUALITY_ISSUES.find((item) => item.label === 'Duplicate tweets')?.count ?? 0) / TOTAL_SAMPLE_COUNT) * 100;

  const barText = DATA_QUALITY_ISSUES.map((item) =>
    item.count === 0
      ? '0'
      : `${item.count.toLocaleString('en-US')} (${((item.count / TOTAL_SAMPLE_COUNT) * 100).toFixed(2)}%)`
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
      <MiniPanel
        title="Missing Data"
        subtitle="Detect empty tweet, empty OCR, duplicates, missing image, corrupt sample."
      >
        <BasePlot
          height={400}
          data={[
            {
              type: 'bar',
              x: DATA_QUALITY_ISSUES.map((item) => item.notebookKey),
              y: DATA_QUALITY_ISSUES.map((item) => item.count),
              marker: {
                color: DATA_QUALITY_ISSUES.map((item) => item.color),
                line: { color: '#ffffff', width: 1 },
              },
              text: barText,
              textposition: 'outside',
              hovertemplate:
                '<b>%{x}</b><br>%{y:,} samples<br><extra></extra>',
              cliponaxis: false,
            },
          ]}
          layout={{
            margin: { l: 52, r: 24, t: 12, b: 124 },
          }}
        />
      </MiniPanel>

      <div className="space-y-4">
        <MiniPanel title="Passed Variables" subtitle="Variables that flagged zero bad rows.">
          <div className="grid gap-3 sm:grid-cols-2">
            {cleanChecks.map((item) => (
              <div key={item.notebookKey} className="rounded-2xl border border-sky-100/90 bg-white px-4 py-3 shadow-sm shadow-sky-100/30">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{item.label}</div>
                <div className="mt-1 text-lg font-black text-slate-950">0</div>
              </div>
            ))}
          </div>
        </MiniPanel>
        <MiniPanel
          title="Summary"
          subtitle="Missing OCR is the main issue; duplicate tweets are a small slice."
        >
          <ul className="list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-slate-600 marker:text-sky-500">
            <li>
              <span className="font-semibold text-slate-800">{emptyOcrRate.toFixed(2)}%</span> of samples have{' '}
              <span className="font-semibold text-slate-800">no OCR on the image</span> - so a large share of rows lack any extracted image text;
              anything that uses “what’s written on the meme” will often get an empty string.
            </li>
            <li>
              <span className="font-semibold text-slate-800">{duplicateTweetRate.toFixed(2)}%</span> are{' '}
              <span className="font-semibold text-slate-800">duplicate tweets</span> - a thin slice; deduplication is minor next to the OCR gap.
            </li>
            <li>
              <span className="font-semibold text-slate-800">Bottom line:</span> the dataset isn’t “dirty” in bulk; the main modeling headache is{' '}
              <span className="font-semibold text-slate-800">missing image text</span>, not floods of broken or repeated rows.
            </li>
          </ul>
        </MiniPanel>
      </div>
    </div>
  );
}

function TextQualityDiagnosticsChart() {
  const avgWords = TEXT_LENGTH_SUMMARY.reduce((sum, item) => sum + item.avgWords, 0) / TEXT_LENGTH_SUMMARY.length;
  const avgChars = TEXT_LENGTH_SUMMARY.reduce((sum, item) => sum + item.avgChars, 0) / TEXT_LENGTH_SUMMARY.length;
  const englishShare = (LANGUAGE_DISTRIBUTION[0].count / TOTAL_SAMPLE_COUNT) * 100;

  return (
    <div className="space-y-4">
      <MiniPanel
        title="Potential text outliers by class"
        subtitle="Tweet count with caption lengths outside the class-specific IQR range."
      >
          <BasePlot
          height={240}
            data={[
              {
                type: 'bar',
              x: NOTEBOOK_TEXT_OUTLIERS_BY_CLASS.map((row) => row.name),
              y: NOTEBOOK_TEXT_OUTLIERS_BY_CLASS.map((row) => row.count),
                marker: {
                color: NOTEBOOK_TEXT_OUTLIERS_BY_CLASS.map((row) => CLASS_COLOR_MAP[row.name]),
                  line: { color: '#ffffff', width: 1.5 },
                },
              text: NOTEBOOK_TEXT_OUTLIERS_BY_CLASS.map((row) => String(row.count)),
                textposition: 'outside',
              hovertemplate: '<b>%{x}</b><br>%{y} flagged tweets<extra></extra>',
              },
            ]}
            layout={{
            margin: { l: 44, r: 18, t: 8, b: 48 },
            yaxis: { title: 'Flagged tweets', gridcolor: '#e2e8f0', zeroline: false },
              xaxis: { tickangle: -20 },
            }}
          />
        </MiniPanel>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-700">Mean tweet length</div>
          <div className="mt-2 text-3xl font-black text-slate-950">{avgWords.toFixed(2)} words</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Class means are close, so semantics matter more than raw length.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-700">Mean character load</div>
          <div className="mt-2 text-3xl font-black text-slate-950">{avgChars.toFixed(1)} chars</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Religion is the main length outlier due to text-heavy samples.</p>
        </div>
      </div>
    </div>
  );
}

const IMAGE_COMPLEXITY_BAR_LAYOUT = {
  margin: { l: 48, r: 24, t: 10, b: 48 },
  xaxis: { title: 'Class', tickangle: -20, gridcolor: '#e2e8f0', zeroline: false },
  yaxis: { gridcolor: '#e2e8f0', zeroline: false },
};

function ImageComplexityChart() {
  const [edgeBar, setEdgeBar] = useState<any[] | null>(null);
  const [sharpnessBar, setSharpnessBar] = useState<any[] | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([fetch(IMAGE_COMPLEXITY_EDGE_JSON_PATH), fetch(IMAGE_BRIGHTNESS_SHARPNESS_JSON_PATH)])
      .then(async ([edgeRes, scatterRes]) => {
        if (!edgeRes.ok || !scatterRes.ok) throw new Error('Failed to load complexity chart JSON.');
        const [edgeJson, imgJson] = await Promise.all([edgeRes.json(), scatterRes.json()]);
        if (!alive) return;
        setEdgeBar(buildEdgeDensityMeanBarFromViolinFigure(edgeJson));
        const scatter = (imgJson.data ?? []).find(
          (t: any) => t?.type === 'scatter' && t?.xaxis === 'x3' && t?.yaxis === 'y3'
        );
        setSharpnessBar(scatter ? buildSharpnessMeanBarFromNotebookScatter(scatter) : []);
      })
      .catch(() => {
        if (!alive) return;
        setEdgeBar([]);
        setSharpnessBar([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const classNames = IMAGE_SUMMARY.map((row) => row.name);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <MiniPanel
          title="Mean edge density by class"
          subtitle="Average edge-density score by class; higher values usually indicate more text, frames, or collage-like layouts."
        >
          {edgeBar === null ? (
            <ChartDataPlaceholder message="Loading edge density…" />
          ) : (
            <BasePlot
              height={300}
              data={edgeBar}
              layout={{
                ...IMAGE_COMPLEXITY_BAR_LAYOUT,
                yaxis: {
                  ...IMAGE_COMPLEXITY_BAR_LAYOUT.yaxis,
                  title: 'Mean edge density (norm.)',
                },
              }}
            />
          )}
        </MiniPanel>
        <MiniPanel
          title="Mean sharpness by class"
          subtitle="Average sharpness by class; higher values usually indicate clearer text or graphic edges."
        >
          {sharpnessBar === null ? (
            <ChartDataPlaceholder message="Loading sharpness…" />
          ) : (
            <BasePlot
              height={300}
              data={sharpnessBar}
              layout={{
                ...IMAGE_COMPLEXITY_BAR_LAYOUT,
                yaxis: {
                  ...IMAGE_COMPLEXITY_BAR_LAYOUT.yaxis,
                  title: 'Mean sharpness (Laplacian var.)',
                },
              }}
            />
          )}
        </MiniPanel>
      </div>

      <MiniPanel
        title="Image format and contrast profile"
        subtitle="Split into separate charts for readability: sample size, aspect ratio, file size and contrast."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <BasePlot
            height={250}
            data={[{ type: 'bar', x: classNames, y: IMAGE_SUMMARY.map((r) => r.sampleN), marker: { color: classNames.map((n) => CLASS_COLOR_MAP[n]) }, text: IMAGE_SUMMARY.map((r) => r.sampleN.toLocaleString('en-US')), textposition: 'outside', hovertemplate: '<b>%{x}</b><br>Sample N: %{y:,}<extra></extra>' }]}
            layout={{ margin: { l: 48, r: 16, t: 8, b: 50 }, xaxis: { tickangle: -20 }, yaxis: { title: 'Samples', gridcolor: '#e2e8f0', zeroline: false } }}
          />
          <BasePlot
            height={250}
            data={[{ type: 'bar', x: classNames, y: IMAGE_SUMMARY.map((r) => r.aspectMean), marker: { color: classNames.map((n) => CLASS_COLOR_MAP[n]) }, text: IMAGE_SUMMARY.map((r) => r.aspectMean.toFixed(3)), textposition: 'outside', hovertemplate: '<b>%{x}</b><br>Mean aspect ratio: %{y:.3f}<extra></extra>' }]}
            layout={{ margin: { l: 48, r: 16, t: 8, b: 50 }, xaxis: { tickangle: -20 }, yaxis: { title: 'Aspect ratio', gridcolor: '#e2e8f0', zeroline: false } }}
          />
          <BasePlot
            height={250}
            data={[{ type: 'bar', x: classNames, y: IMAGE_SUMMARY.map((r) => r.fileSizeMean), marker: { color: classNames.map((n) => CLASS_COLOR_MAP[n]) }, text: IMAGE_SUMMARY.map((r) => r.fileSizeMean.toFixed(1)), textposition: 'outside', hovertemplate: '<b>%{x}</b><br>Mean file size: %{y:.2f} KB<extra></extra>' }]}
            layout={{ margin: { l: 48, r: 16, t: 8, b: 50 }, xaxis: { tickangle: -20 }, yaxis: { title: 'File size (KB)', gridcolor: '#e2e8f0', zeroline: false } }}
          />
          <BasePlot
            height={250}
            data={[{ type: 'bar', x: classNames, y: IMAGE_SUMMARY.map((r) => r.contrast), marker: { color: classNames.map((n) => CLASS_COLOR_MAP[n]) }, text: IMAGE_SUMMARY.map((r) => r.contrast.toFixed(2)), textposition: 'outside', hovertemplate: '<b>%{x}</b><br>Mean contrast: %{y:.2f}<extra></extra>' }]}
            layout={{ margin: { l: 48, r: 16, t: 8, b: 50 }, xaxis: { tickangle: -20 }, yaxis: { title: 'Contrast', gridcolor: '#e2e8f0', zeroline: false } }}
          />
        </div>
      </MiniPanel>
    </div>
  );
}

function TextDistributionDashboardChart() {
  const [distSpecs, setDistSpecs] = useState<{
    word: { data?: any[]; layout?: Record<string, unknown> };
    char: { data?: any[]; layout?: Record<string, unknown> };
    cosineHeat: { data?: any[]; layout?: Record<string, unknown> };
    multimodal: { data?: any[]; layout?: Record<string, unknown> };
    vocabRows: VocabularyRichnessJsonRow[];
  } | null>(null);
  const [profileCosineFs, setProfileCosineFs] = useState(false);

  useEffect(() => {
    let alive = true;
    const loadFig = (url: string) =>
      fetch(url)
        .then((r) => (r.ok ? r.json() : { data: [], layout: {} }))
        .catch(() => ({ data: [], layout: {} }));

    const loadVocabRichness = () =>
      fetch(VOCAB_RICHNESS_JSON_PATH)
        .then((r) => (r.ok ? r.json() : []))
        .then((json: unknown) => (Array.isArray(json) ? (json as VocabularyRichnessJsonRow[]) : []))
        .catch(() => []);

    Promise.all([
      loadFig(WORD_COUNT_HIST_JSON_PATH),
      loadFig(CHAR_COUNT_HIST_JSON_PATH),
      loadFig(CLASS_COSINE_HEATMAP_JSON_PATH),
      loadFig(MULTIMODAL_DASHBOARD_JSON_PATH),
      loadVocabRichness(),
    ]).then(([word, char, cosineHeat, multimodal, vocabRows]) => {
      if (!alive) return;
      setDistSpecs({ word, char, cosineHeat, multimodal, vocabRows });
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!profileCosineFs) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileCosineFs(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [profileCosineFs]);

  const getProfileCosineLayout = (height: number) => {
    if (!distSpecs?.cosineHeat) return {};
    return {
      ...sanitizeNotebookFigureLayout(distSpecs.cosineHeat.layout, height),
      margin: { l: 80, r: 48, t: 16, b: 80 },
      xaxis: {
        ...(distSpecs.cosineHeat.layout?.xaxis as object),
        title: { text: 'Class' },
        tickangle: -35,
        side: 'bottom',
      },
      yaxis: {
        ...(distSpecs.cosineHeat.layout?.yaxis as object),
        title: { text: 'Class' },
      },
    };
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <MiniPanel
        title="Word Count Distribution"
        subtitle="Tweet word-count distribution by category."
      >
        {distSpecs === null ? (
          <ChartDataPlaceholder message="Loading word count histograms…" />
        ) : (
        <BasePlot
            height={300}
            data={hate02HistogramOverlayTraces(distSpecs.word)}
          layout={{
              barmode: 'overlay',
              margin: { l: 48, r: 18, t: 10, ...HATE_BOTTOM_LEGEND_MARGIN },
              xaxis: { title: 'Word count', gridcolor: '#e2e8f0', zeroline: false },
              yaxis: { title: 'Count', gridcolor: '#e2e8f0', zeroline: false },
              legend: HATE_BOTTOM_LEGEND,
            }}
          />
        )}
      </MiniPanel>
      <MiniPanel
        title="Character Count Distribution"
        subtitle="Tweet character-count distribution by category."
      >
        {distSpecs === null ? (
          <ChartDataPlaceholder message="Loading character count histograms…" />
        ) : (
        <BasePlot
            height={300}
            data={hate02HistogramOverlayTraces(distSpecs.char)}
          layout={{
              barmode: 'overlay',
              margin: { l: 48, r: 18, t: 10, ...HATE_BOTTOM_LEGEND_MARGIN },
              xaxis: { title: 'Character count', gridcolor: '#e2e8f0', zeroline: false },
              yaxis: { title: 'Count', gridcolor: '#e2e8f0', zeroline: false },
              legend: HATE_BOTTOM_LEGEND,
            }}
          />
        )}
      </MiniPanel>
      <MiniPanel
        title="Emoji vs Hashtag Rate"
        subtitle="Emoji and hashtag usage rates by category."
      >
        <BasePlot
          height={250}
          data={[
            {
              type: 'bar',
              name: 'Emoji rate',
              x: TEXT_LENGTH_SUMMARY.map((item) => item.name),
              y: TEXT_LENGTH_SUMMARY.map((item) => item.emojiRate),
              marker: { color: '#38bdf8' },
              hovertemplate: '<b>%{x}</b><br>%{y:.2f}% emoji rate<extra></extra>',
            },
            {
              type: 'bar',
              name: 'Hashtag rate',
              x: TEXT_LENGTH_SUMMARY.map((item) => item.name),
              y: TEXT_LENGTH_SUMMARY.map((item) => item.hashtagRate),
              marker: { color: '#0c4a6e' },
              hovertemplate: '<b>%{x}</b><br>%{y:.2f}% hashtag rate<extra></extra>',
            },
          ]}
          layout={{
            barmode: 'group',
            margin: { l: 42, r: 18, t: 8, ...HATE_BOTTOM_LEGEND_MARGIN },
            yaxis: { title: 'Rate (%)', gridcolor: '#e2e8f0', zeroline: false },
            xaxis: { tickangle: -20 },
            legend: HATE_BOTTOM_LEGEND,
          }}
        />
      </MiniPanel>
      <MiniPanel
        title="Hate Lexicon Hit Rate"
        subtitle="Hate-lexicon hit rate by category."
      >
        <BasePlot
          height={250}
          data={[
            {
              type: 'bar',
              x: TEXT_LENGTH_SUMMARY.map((item) => item.name),
              y: TEXT_LENGTH_SUMMARY.map((item) => item.hateLexiconRate),
              marker: { color: TEXT_LENGTH_SUMMARY.map((item) => CLASS_COLOR_MAP[item.name]) },
              text: TEXT_LENGTH_SUMMARY.map((item) => `${item.hateLexiconRate.toFixed(1)}%`),
              textposition: 'outside',
              hovertemplate: '<b>%{x}</b><br>%{y:.2f}% hit rate<extra></extra>',
            },
          ]}
          layout={{
            margin: { l: 42, r: 18, t: 8, b: 48 },
            yaxis: { title: 'Lexicon hit rate (%)', gridcolor: '#e2e8f0', zeroline: false },
            xaxis: { tickangle: -20 },
          }}
        />
      </MiniPanel>

      <div className="xl:col-span-2">
        <MiniPanel
          title="Vocabulary Richness (Stop Words Removed)"
          subtitle="Unique-word ratio (TTR) by category, stop words removed."
        >
          {distSpecs === null ? (
            <ChartDataPlaceholder message="Loading vocabulary richness…" />
          ) : distSpecs.vocabRows.length === 0 ? (
            <ChartDataPlaceholder message="Could not load 26_vocabulary_richness.json." />
          ) : (
            <VocabularyRichnessTable rows={distSpecs.vocabRows} />
          )}
      </MiniPanel>
    </div>

      <div className="xl:col-span-2">
        <MiniPanel
          title="Class Profile Cosine Similarity"
          subtitle="Similarity between class-level text profiles."
        >
          {distSpecs === null ? (
            <ChartDataPlaceholder message="Loading similarity heatmap…" />
          ) : (
            <>
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setProfileCosineFs(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                >
                  <Maximize2 size={14} aria-hidden />
                  Full screen
                </button>
              </div>
    <BasePlot
                height={520}
                data={normalizeHeatmapColorbar(distSpecs.cosineHeat.data)}
                layout={getProfileCosineLayout(520)}
              />
            </>
          )}
        </MiniPanel>
      </div>

      {profileCosineFs && distSpecs && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Class profile cosine similarity, full screen"
          className="fixed inset-0 z-200 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-[2px] md:p-6"
          onClick={() => setProfileCosineFs(false)}
        >
          <button
            type="button"
            onClick={() => setProfileCosineFs(false)}
            className="absolute right-3 top-3 rounded-full bg-white/95 p-2.5 text-slate-800 shadow-lg transition hover:bg-white md:right-5 md:top-5"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <div
            className="max-h-[92vh] w-full max-w-[min(1240px,98vw)] overflow-auto rounded-2xl bg-white p-3 shadow-2xl md:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <BasePlot
              height={720}
              data={normalizeHeatmapColorbar(distSpecs.cosineHeat.data)}
              layout={getProfileCosineLayout(720)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TermsExplorerChart({
  dataMap,
  metricLabel,
  formatter,
  emptyMessage = 'No data available for this class.',
}: {
  dataMap: Record<string, { label: string; value: number }[]>;
  metricLabel: string;
  formatter: (value: number) => string;
  emptyMessage?: string;
}) {
  const firstClass = CLASS_ORDER.find((name) => (dataMap[name] ?? []).length > 0) ?? CLASS_ORDER[0];
  const [activeClass, setActiveClass] = useState(firstClass);
  const activeData = (dataMap[activeClass] ?? []).slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CLASS_ORDER.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setActiveClass(name)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
              activeClass === name
                ? 'border-sky-800 bg-sky-800 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-sky-200 hover:bg-white'
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CLASS_COLOR_MAP[name] }} />
            {name}
          </button>
        ))}
      </div>

      {activeData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-200/70 bg-sky-50/50 px-4 py-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <BasePlot
          height={480}
          data={[
            {
              type: 'bar',
              orientation: 'h',
              x: activeData.map((item) => item.value).reverse(),
              y: activeData.map((item) => item.label).reverse(),
              marker: {
                color: CLASS_COLOR_MAP[activeClass],
                line: { color: '#ffffff', width: 1.5 },
              },
              text: activeData.map((item) => formatter(item.value)).reverse(),
              textposition: 'outside',
              customdata: activeData.map((item) => formatter(item.value)).reverse(),
              hovertemplate: `<b>%{y}</b><br>${metricLabel}: %{customdata}<extra></extra>`,
              cliponaxis: false,
            },
          ]}
          layout={{
            margin: { l: 130, r: 30, t: 8, b: 34 },
            xaxis: { title: metricLabel, gridcolor: '#e2e8f0', zeroline: false },
            yaxis: { tickfont: { size: 11 } },
          }}
        />
      )}
    </div>
  );
}

/** Stop words dashboard - frequencies inlined (no fetch). Rendered inside VizCard body. */
function StopWordsAnalysisPanel() {
  const [activeClass, setActiveClass] = useState('NotHate');
  const [copiedList, setCopiedList] = useState(false);

  const pairs = useMemo(() => {
    const rows = STOP_WORDS_BY_CLASS[activeClass] ?? [];
    return [...rows].map((r) => ({ w: r.label, v: r.value })).sort((a, b) => b.v - a.v);
  }, [activeClass]);

  const totalTop15 = useMemo(() => pairs.reduce((s, p) => s + p.v, 0), [pairs]);
  const profile = CLASS_PROFILE_BUBBLES.find((p) => p.name === activeClass);
  const tokenVolume = profile ? profile.count * profile.avgWords : 0;
  const pctVsTokens = tokenVolume > 0 ? (totalTop15 / tokenVolume) * 100 : 0;

  const copyList = () => {
    void navigator.clipboard.writeText(englishStopwordsCommaSeparated());
    setCopiedList(true);
    window.setTimeout(() => setCopiedList(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[22px] border border-sky-200 bg-white px-5 py-5 shadow-sm shadow-sky-100/60">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">Total (top-15 terms)</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums tracking-tight text-slate-950">
            {Math.round(totalTop15).toLocaleString('en-US')}
          </p>
          <p className="mt-2 text-xs leading-snug text-slate-600">
            Total stop words appear in <span className="font-semibold text-slate-900">{activeClass}</span> tweets.
          </p>
        </div>
        <div className="rounded-[22px] border border-sky-200 bg-white from-sky-50/90 to-white px-5 py-5 shadow-sm shadow-sky-100/40">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-sky-800/90">% of the class’s words</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums tracking-tight text-slate-950">{pctVsTokens.toFixed(1)}%</p>
          <p className="mt-2 text-xs leading-snug text-slate-600">
            Percentage of the class's words that are the stop words.
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">Class</p>
        <div className="flex flex-wrap gap-2">
          {CLASS_ORDER.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveClass(name)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                activeClass === name
                  ? 'border-sky-800 bg-sky-800 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-sky-200 hover:bg-white'
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CLASS_COLOR_MAP[name] }} />
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className={cn(HATE_CALLOUT_SURFACE, 'overflow-hidden p-3')}>
        <BasePlot
          height={400}
          data={[
            {
              type: 'bar',
              x: pairs.map((p) => p.w),
              y: pairs.map((p) => p.v),
              marker: {
                color: CLASS_COLOR_MAP[activeClass] ?? '#64748b',
                line: { color: '#ffffff', width: 0.5 },
              },
              customdata: pairs.map((p) => p.v.toLocaleString('en-US')),
              hovertemplate: '<b>%{x}</b><br>Frequency: %{customdata}<extra></extra>',
            },
          ]}
          layout={{
            margin: { l: 52, r: 24, t: 12, b: 88 },
            font: { family: HATE_PLOT_FONT_FAMILY, color: '#475569', size: 12 },
            xaxis: {
              title: { text: 'Stop words' },
              tickangle: -35,
              gridcolor: '#e2e8f0',
              zeroline: false,
            },
            yaxis: {
              title: { text: 'Frequency' },
              gridcolor: '#e2e8f0',
              zeroline: false,
            },
          }}
        />
      </div>

      <div className="rounded-[22px] border border-sky-200/80 bg-linear-to-br from-sky-50/90 to-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-black uppercase tracking-[0.16em] text-sky-800">Stop words list</h4>
          <button
            type="button"
            onClick={copyList}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-800"
          >
            {copiedList ? <Check className="h-3.5 w-3.5 text-sky-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedList ? 'Copied' : 'Copy all'}
          </button>
        </div>
        <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-slate-200/90 bg-white/90 px-3 py-2.5 font-mono text-[0.68rem] leading-relaxed text-slate-600">
          {englishStopwordsCommaSeparated()}
        </div>
        <p className="mt-2 text-[0.65rem] leading-snug text-slate-500">
          Sklearn <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-700">ENGLISH_STOP_WORDS</code> - {ENGLISH_STOPWORD_COUNT}{' '}
          terms, alphabetical (reference only).
        </p>
      </div>
    </div>
  );
}

function OverallKeywordsChart() {
  const rows = [...TOP_KEYWORDS];
  return (
        <BasePlot
      height={440}
          data={[
            {
              type: 'bar',
          orientation: 'h',
          x: rows.map((item) => item.value).reverse(),
          y: rows.map((item) => item.label).reverse(),
          marker: { color: '#0369a1', line: { color: '#ffffff', width: 1 } },
          text: rows.map((item) => item.value.toLocaleString('en-US')).reverse(),
          textposition: 'outside',
          customdata: rows.map((item) => item.value.toLocaleString('en-US')).reverse(),
          hovertemplate: '<b>%{y}</b><br>Count: %{customdata}<extra></extra>',
          cliponaxis: false,
            },
          ]}
          layout={{
        margin: { l: 100, r: 36, t: 8, b: 40 },
        xaxis: { title: 'Token count (overall)', gridcolor: '#e2e8f0', zeroline: false },
        yaxis: { tickfont: { size: 11 } },
      }}
    />
  );
}

function RadarProfileChart() {
  return <HateNotebookFigure jsonPath={CLASS_PROFILE_RADAR_JSON_PATH} height={520} />;
}

function WidthHeightDistributionChart() {
  return (
    <div className="space-y-4">
      <BasePlot
        height={380}
        data={[
          {
            type: 'scatter',
            mode: 'markers+text',
            x: IMAGE_SUMMARY.map((item) => item.widthMean),
            y: IMAGE_SUMMARY.map((item) => item.heightMean),
            text: IMAGE_SUMMARY.map((item) => item.name),
            textposition: 'top center',
            marker: {
              size: IMAGE_SUMMARY.map((item) => Math.max(18, item.fileSizeMean * 0.65)),
              color: IMAGE_SUMMARY.map((item) => CLASS_COLOR_MAP[item.name]),
              opacity: 0.85,
              line: { color: '#ffffff', width: 2 },
            },
            hovertemplate:
              '<b>%{text}</b><br>Mean width: %{x:.0f}px<br>Mean height: %{y:.0f}px<extra></extra>',
            showlegend: false,
          },
        ]}
        layout={{
          margin: { l: 56, r: 20, t: 10, b: 48 },
          xaxis: { title: 'Mean width (px)', gridcolor: '#e2e8f0', zeroline: false },
          yaxis: { title: 'Mean height (px)', gridcolor: '#e2e8f0', zeroline: false },
          shapes: [
            {
              type: 'line',
              x0: 450,
              x1: 780,
              y0: 450,
              y1: 780,
              line: { color: '#94a3b8', width: 1.5, dash: 'dot' },
            },
          ],
        }}
      />
      <p className="text-xs leading-relaxed text-slate-500">
        Bubble size reflects mean file size. Most classes cluster near balanced layouts, while Religion shifts toward wider poster-like images with very small sample size.
      </p>
    </div>
  );
}

function PersonPresenceRateChart({ loadData = true }: { loadData?: boolean }) {
  return <HateNotebookFigure jsonPath={PERSON_PRESENCE_JSON_PATH} height={340} loadData={loadData} />;
}

function MultimodalDashboardChart() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <MiniPanel title="OCR Coverage" subtitle="The percentage of images in each class that have OCR text.">
        <BasePlot
          height={250}
          data={[
            {
              type: 'bar',
              x: MULTIMODAL_SUMMARY.map((item) => item.name),
              y: MULTIMODAL_SUMMARY.map((item) => item.ocrCoverage),
              marker: { color: MULTIMODAL_SUMMARY.map((item) => CLASS_COLOR_MAP[item.name]) },
              text: MULTIMODAL_SUMMARY.map((item) => `${item.ocrCoverage.toFixed(1)}%`),
              textposition: 'outside',
              hovertemplate: '<b>%{x}</b><br>%{y:.2f}% OCR coverage<extra></extra>',
            },
          ]}
          layout={{
            margin: { l: 42, r: 18, t: 10, b: 48 },
            yaxis: { title: 'Coverage (%)', gridcolor: '#e2e8f0', zeroline: false },
            xaxis: { tickangle: -20 },
          }}
        />
      </MiniPanel>
      <MiniPanel title="Text-heavy Image Ratio" subtitle="The ratio of images in each class that are text-heavy.">
        <BasePlot
          height={250}
          data={[
            {
              type: 'bar',
              x: MULTIMODAL_SUMMARY.map((item) => item.name),
              y: MULTIMODAL_SUMMARY.map((item) => item.textHeavyRatio),
              marker: { color: MULTIMODAL_SUMMARY.map((item) => CLASS_COLOR_MAP[item.name]) },
              text: MULTIMODAL_SUMMARY.map((item) => `${item.textHeavyRatio.toFixed(1)}%`),
              textposition: 'outside',
              hovertemplate: '<b>%{x}</b><br>%{y:.2f}% text-heavy image ratio<extra></extra>',
            },
          ]}
          layout={{
            margin: { l: 42, r: 18, t: 10, b: 48 },
            yaxis: { title: 'Rate (%)', gridcolor: '#e2e8f0', zeroline: false },
            xaxis: { tickangle: -20 },
          }}
        />
      </MiniPanel>
      <MiniPanel title="Tweet vs OCR Similarity" subtitle="Tweet–OCR text similarity by category.">
        <BasePlot
          height={250}
          data={[
            {
              type: 'bar',
              name: 'Cosine mean',
              x: MULTIMODAL_SUMMARY.map((item) => item.name),
              y: MULTIMODAL_SUMMARY.map((item) => item.cosineMean),
              marker: { color: '#38bdf8' },
              hovertemplate: '<b>%{x}</b><br>%{y:.2f} cosine mean<extra></extra>',
            },
            {
              type: 'bar',
              name: 'Jaccard mean',
              x: MULTIMODAL_SUMMARY.map((item) => item.name),
              y: MULTIMODAL_SUMMARY.map((item) => item.jaccardMean),
              marker: { color: '#0c4a6e' },
              hovertemplate: '<b>%{x}</b><br>%{y:.2f} jaccard mean<extra></extra>',
            },
          ]}
          layout={{
            barmode: 'group',
            margin: { l: 42, r: 18, t: 10, ...HATE_BOTTOM_LEGEND_MARGIN },
            yaxis: { title: 'Mean similarity', gridcolor: '#e2e8f0', zeroline: false },
            xaxis: { tickangle: -20 },
            legend: HATE_BOTTOM_LEGEND,
          }}
        />
      </MiniPanel>
      <MiniPanel title="Tweet vs OCR Word Load" subtitle="Mean tweet and OCR word counts by category.">
        <BasePlot
          height={250}
          data={[
            {
              type: 'bar',
              name: 'Tweet words',
              x: MULTIMODAL_SUMMARY.map((item) => item.name),
              y: MULTIMODAL_SUMMARY.map((item) => item.tweetWords),
              marker: { color: '#14b8a6' },
              hovertemplate: '<b>%{x}</b><br>%{y:.2f} tweet words<extra></extra>',
            },
            {
              type: 'bar',
              name: 'OCR words',
              x: MULTIMODAL_SUMMARY.map((item) => item.name),
              y: MULTIMODAL_SUMMARY.map((item) => item.ocrWords),
              marker: { color: '#0369a1' },
              hovertemplate: '<b>%{x}</b><br>%{y:.2f} OCR words<extra></extra>',
            },
          ]}
          layout={{
            barmode: 'group',
            margin: { l: 42, r: 18, t: 10, ...HATE_BOTTOM_LEGEND_MARGIN },
            yaxis: { title: 'Mean word count', gridcolor: '#e2e8f0', zeroline: false },
            xaxis: { tickangle: -20 },
            legend: HATE_BOTTOM_LEGEND,
          }}
        />
      </MiniPanel>
    </div>
  );
}

/** Hex #RRGGBB → rgba() for Plotly colorscales. */
function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return `rgba(100, 116, 139, ${alpha})`;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Tweet vs OCR word counts: 2D density contours per class (clearer than overdrawn scatter). */
function TweetVsOcrLengthChart() {
  const [spec, setSpec] = useState<{ data?: any[] } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(TWEET_OCR_LENGTH_SCATTER_JSON_PATH)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => {
        if (!alive) return;
        setSpec(j);
      })
      .catch(() => {
        if (!alive) return;
        setSpec({ data: [] });
      });
    return () => {
      alive = false;
    };
  }, []);

  const densityFig = useMemo(() => {
    if (!spec?.data?.length) return null;

    const scatterByName: Record<string, { x: number[]; y: number[] }> = {};
    for (const t of spec.data as any[]) {
      if (!Array.isArray(t?.x) || !Array.isArray(t?.y)) {
        continue;
      }
      const name = typeof t.name === 'string' ? t.name : '';
      if (!name || !CLASS_ORDER.includes(name)) continue;
      const x = t.x.map((v: unknown) => Number(v)).filter((v: number) => Number.isFinite(v));
      const y = t.y.map((v: unknown) => Number(v)).filter((v: number) => Number.isFinite(v));
      const n = Math.min(x.length, y.length);
      if (!n) continue;
      scatterByName[name] = { x: x.slice(0, n), y: y.slice(0, n) };
    }

    let maxV = 0;
    for (const cls of CLASS_ORDER) {
      const d = scatterByName[cls];
      if (!d) continue;
      for (const v of d.x) if (Number.isFinite(v) && v > maxV) maxV = v;
      for (const v of d.y) if (Number.isFinite(v) && v > maxV) maxV = v;
    }
    if (maxV <= 0) return null;
    maxV = Math.max(10, Math.ceil(maxV * 1.06));

    const axisBase = {
      range: [0, maxV] as [number, number],
      gridcolor: '#e2e8f0',
      zeroline: false,
      tickfont: { size: 10 },
    };

    const traces: any[] = [];
    const shapes: any[] = [];

    CLASS_ORDER.forEach((cls, i) => {
      const d = scatterByName[cls];
      if (!d?.x?.length) return;
      const xa = i === 0 ? 'x' : `x${i + 1}`;
      const ya = i === 0 ? 'y' : `y${i + 1}`;
      const color = CLASS_COLOR_MAP[cls] ?? '#64748b';

      traces.push({
        type: 'histogram2dcontour',
        name: cls,
        x: d.x,
        y: d.y,
        xaxis: xa,
        yaxis: ya,
        colorscale: [
          [0, hexToRgba(color, 0.04)],
          [0.35, hexToRgba(color, 0.35)],
          [0.7, hexToRgba(color, 0.72)],
          [1, color],
        ],
        showscale: false,
        ncontours: 14,
        line: { width: 0.6, color: 'rgba(255,255,255,0.35)' },
        hovertemplate: `<b>${cls}</b><br>Tweet words=%{x}<br>OCR words=%{y}<extra></extra>`,
      });

      shapes.push({
        type: 'line',
        x0: 0,
        y0: 0,
        x1: maxV,
        y1: maxV,
        xref: xa,
        yref: ya,
        line: { color: '#94a3b8', width: 1.25, dash: 'dash' },
        layer: 'above',
      });
    });

    if (!traces.length) return null;

    const layout: Record<string, unknown> = {
      ...HATE_PLOT_LAYOUT_BASE,
      font: { family: HATE_PLOT_FONT_FAMILY, color: '#334155', size: 11 },
      grid: { rows: 2, columns: 3, pattern: 'independent', roworder: 'top to bottom' },
      showlegend: false,
      margin: { l: 54, r: 10, t: 36, b: 48 },
      shapes,
    };

    const annotations: any[] = CLASS_ORDER.map((cls, i) => {
      const xref = i === 0 ? 'x domain' : `x${i + 1} domain`;
      const yref = i === 0 ? 'y domain' : `y${i + 1} domain`;
      return {
        text: `<b>${cls}</b>`,
        xref,
        yref,
        x: 0.5,
        y: 1.12,
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
        font: { family: HATE_PLOT_FONT_FAMILY, size: 12, color: '#0f172a' },
      };
    });
    layout.annotations = annotations;

    for (let i = 0; i < CLASS_ORDER.length; i++) {
      const xKey = i === 0 ? 'xaxis' : `xaxis${i + 1}`;
      const yKey = i === 0 ? 'yaxis' : `yaxis${i + 1}`;
      const row = Math.floor(i / 3);
      const col = i % 3;

      (layout as any)[xKey] = {
        ...axisBase,
        title: row === 1 && col === 1 ? { text: 'Tweet words', font: { size: 11 } } : undefined,
      };
      (layout as any)[yKey] = {
        ...axisBase,
        title: col === 0 ? { text: 'OCR words', font: { size: 11 } } : undefined,
      };
    }

    return { traces, layout };
  }, [spec]);

  if (spec === null) {
    return <ChartDataPlaceholder message="Loading tweet vs OCR chart…" />;
  }
  if (!densityFig) {
    return <ChartDataPlaceholder message="Could not build density chart from tweet vs OCR data." />;
  }

  const height = 700;
  return (
    <div className="space-y-3">
      <div className={cn(HATE_CALLOUT_SURFACE, 'px-4 py-3')}>
        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">How to read</div>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-600 marker:text-sky-500">
          <li>Each panel is one class; darker regions mean more samples in that tweet/OCR length zone.</li>
          <li>Points near the dashed line mean tweet text and on-image text have similar length.</li>
          <li>Above the dashed line means OCR text is longer; below means tweet caption is longer.</li>
        </ul>
      </div>
      <BasePlot height={height} data={densityFig.traces} layout={{ ...densityFig.layout, height }} />
    </div>
  );
}

function GradCamHeatmapChart() {
  return (
    <div className="space-y-4">
      <HateNotebookFigure jsonPath={GRAD_CAM_JSON_PATH} height={480} />
      <div className="grid gap-3 md:grid-cols-3">
        <div className={cn(HATE_CALLOUT_SURFACE, 'px-4 py-4')}>
          <div className="hate-eda-title text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Peak focus</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">The center-right band receives the strongest activation.</p>
        </div>
        <div className={cn(HATE_CALLOUT_SURFACE, 'px-4 py-4')}>
          <div className="hate-eda-title text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Interpretation</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">The model is reacting to concentrated text or symbol regions, not broad background color.</p>
        </div>
        <div className={cn(HATE_CALLOUT_SURFACE, 'px-4 py-4')}>
          <div className="hate-eda-title text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Modeling note</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Saliency aligns better with OCR-heavy semantics than with low-level palette differences.</p>
        </div>
      </div>
    </div>
  );
}

function CensorshipEvasionChart() {
  return <HateNotebookFigure jsonPath={CENSORSHIP_EVASION_JSON_PATH} height={380} />;
}

function SectionHeader({
  title,
  icon: Icon,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b-4 border-sky-500 pb-3 md:flex-row md:items-center md:justify-between">
      <button
        type="button"
        onClick={onToggle}
        className={cn('group flex items-center gap-3 rounded-xl text-left', HATE_FOCUS_RING)}
        aria-expanded={isOpen}
      >
        <div className="rounded-2xl bg-sky-500 p-2.5 text-slate-950 shadow-sm shadow-sky-300/40 transition-transform group-hover:scale-105">
          <Icon size={22} />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="hate-eda-title text-2xl font-black tracking-tight text-slate-950 transition-colors group-hover:text-sky-700">
            {title}
          </h2>
          {isOpen ? <ChevronDown size={18} className="shrink-0 text-sky-700" /> : <ChevronRight size={18} className="shrink-0 text-slate-400" />}
        </div>
      </button>
    </div>
  );
}

type GalleryTileFromJson = { id: string; classKey: string; src: string; note: string };

function InteractiveSampleGallery() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(CLASS_ORDER.slice(0, 4)));
  const [lightbox, setLightbox] = useState<null | { src: string; label: string; note: string }>(null);
  const [rawTiles, setRawTiles] = useState<GalleryTileFromJson[]>([]);
  const [galleryLoad, setGalleryLoad] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [galleryErr, setGalleryErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setGalleryLoad('loading');
    setGalleryErr(null);
    void fetch(GALLERY_SAMPLE_JSON_PATH)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ data?: GalleryPlotlyTrace[] }>;
      })
      .then((j) => {
        if (cancelled) return;
        const data = Array.isArray(j?.data) ? j.data : [];
        const parsed: GalleryTileFromJson[] = [];
        for (const t of data) {
          const name = typeof t?.name === 'string' ? t.name : '';
          const source = typeof t?.source === 'string' ? t.source : '';
          if (!name || !source.startsWith('data:image')) continue;
          const classKey = parseGalleryClassFromTraceName(name);
          if (!classKey) continue;
          parsed.push({
            id: name,
            classKey,
            src: source,
            note: `${galleryTweetIdNote(name, classKey)} · from gallery_plotly.json`,
          });
        }
        setRawTiles(parsed);
        setGalleryLoad('ok');
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setGalleryLoad('err');
        setGalleryErr(e instanceof Error ? e.message : String(e));
        setRawTiles([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tiles = useMemo(() => rawTiles.filter((t) => selected.has(t.classKey)), [rawTiles, selected]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const toggleClass = (c: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-sky-600 to-sky-700 px-4 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-md shadow-sky-500/30 transition hover:from-sky-500 hover:to-sky-600"
      >
        <ImageIcon size={20} className="shrink-0" aria-hidden />
        Interactive Sample Gallery
        <ChevronDown size={18} className={cn('shrink-0 transition-transform', panelOpen && 'rotate-180')} aria-hidden />
      </button>

      {panelOpen && (
        <>
          <div className="text-center">
            <p className="text-base font-black text-slate-900">
              <span className="mr-1.5" aria-hidden>
                🖼️
              </span>
              MMHS classes ({CLASS_ORDER.length})
            </p>
            <div className="mx-auto mt-3 h-px max-w-md bg-linear-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-bold text-slate-700">Select classes to display:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelected(new Set(CLASS_ORDER))}
                className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-sky-500"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="rounded-xl border-2 border-red-500/80 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-red-600 transition hover:bg-red-50"
              >
                Select none
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-slate-50 p-4">
            <fieldset>
              <legend className="mb-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">Class selection</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {CLASS_ORDER.map((cls) => {
                  const id = `gallery-class-${cls}`;
                  return (
                    <label
                      key={cls}
                      htmlFor={id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-sky-200"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={selected.has(cls)}
                        onChange={() => toggleClass(cls)}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-bold', BADGE_STYLES[cls])}>{cls}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {galleryLoad === 'loading' && (
            <p className="rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-6 text-center text-sm font-medium text-sky-900">
              Loading gallery from JSON…
            </p>
          )}
          {galleryLoad === 'err' && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-800">
              Could not load <span className="font-mono text-xs">gallery_plotly.json</span>
              {galleryErr ? `: ${galleryErr}` : '.'}
            </p>
          )}
          {galleryLoad === 'ok' && rawTiles.length === 0 && (
            <p className="rounded-2xl border border-dashed border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-900">
              No image traces found in JSON (expected Plotly traces with <span className="font-mono text-xs">source</span> data URLs).
            </p>
          )}
          {galleryLoad === 'ok' && rawTiles.length > 0 && selected.size === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No classes selected - choose at least one class to show tiles.
            </p>
          )}
          {galleryLoad === 'ok' && rawTiles.length > 0 && selected.size > 0 && tiles.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No samples for the selected classes in <span className="font-mono text-xs">gallery_plotly.json</span> (e.g. Sexist has no
              traces in the current export).
            </p>
          )}
          {galleryLoad === 'ok' && tiles.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {tiles.map(({ id, classKey, src, note }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLightbox({ src, label: classKey, note })}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-sky-200 hover:shadow-md"
                >
                  <div className="overflow-hidden">
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-56"
                    />
                  </div>
                  <div className="space-y-0.5 p-3">
                    <p className="text-sm font-black text-slate-900">{classKey}</p>
                    <p className="text-xs text-slate-500">Click to enlarge</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged gallery image"
          className="fixed inset-0 z-200 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-[2px]"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/95 p-2.5 text-slate-800 shadow-lg transition hover:bg-white"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <div
            className="max-h-[90vh] max-w-4xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.src} alt="" className="max-h-[75vh] w-full object-contain" />
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="text-sm font-black text-slate-900">{lightbox.label}</p>
              <p className="mt-1 text-xs text-slate-500">{lightbox.note}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SampleTweetExplorer() {
  const categories = Object.keys(SAMPLE_TWEETS);
  const [active, setActive] = useState(categories[0]);

  return (
    <VizCard
      title="Representative Tweet Samples"
      subtitle="Illustrative captions by class."
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {categories.map((name) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                active === name
                  ? BADGE_STYLES[name]
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white'
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {SAMPLE_TWEETS[active].map((tweet, index) => (
            <div key={`${active}-${index}`} className={cn(HATE_CALLOUT_SURFACE, 'p-4 text-sm leading-relaxed text-slate-700')}>
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Sample {index + 1}</div>
              {tweet}
            </div>
          ))}
        </div>
      </div>
    </VizCard>
  );
}

function EvasionSampleExplorer() {
  const classes = Array.from(new Set(CENSORSHIP_EVASION_SAMPLES.map((s) => s.cls)));
  const [active, setActive] = useState(classes[0] ?? 'NotHate');
  const rows = CENSORSHIP_EVASION_SAMPLES.filter((s) => s.cls === active);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {classes.map((cls) => (
          <button
            key={cls}
            type="button"
            onClick={() => setActive(cls)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
              active === cls ? BADGE_STYLES[cls] : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white'
            )}
          >
            {cls}
          </button>
        ))}
      </div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        Showing {rows.length} sample{rows.length === 1 ? '' : 's'} in {active}
      </div>
      <div className="space-y-3">
        {rows.map((sample) => (
          <div key={sample.id} className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400">ID: {sample.id}</span>
              <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-bold', BADGE_STYLES[sample.cls])}>{sample.cls}</span>
            </div>
            <div className="space-y-2 text-sm leading-relaxed">
              <p><span className="font-bold text-slate-900">Tweet:</span> <span className="text-slate-600">{sample.tweet}</span></p>
              <p><span className="font-bold text-sky-700">OCR:</span> <span className="text-slate-600">{sample.ocr}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hate({ onBack }: { onBack: () => void }) {
  const [sections, setSections] = useState<Record<SectionId, boolean>>({
    overview: true,
    preprocessing: true,
    text: true,
    image: true,
    multimodal: true,
    insights: true,
  });

  const toggleSection = (id: SectionId) => {
    setSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const collapseAll = () => {
    setSections(
      SECTION_META.reduce((acc, section) => {
        acc[section.id] = false;
        return acc;
      }, {} as Record<SectionId, boolean>)
    );
  };

  const expandAll = () => {
    setSections(
      SECTION_META.reduce((acc, section) => {
        acc[section.id] = true;
        return acc;
      }, {} as Record<SectionId, boolean>)
    );
  };

  return (
    <div className="hate-eda min-h-screen bg-linear-to-br from-[#dff2ff] via-[#f7fbff] to-white text-slate-900 selection:bg-sky-200">
      <div className="mx-auto w-full max-w-550 p-4 md:p-10">
        <div className="overflow-hidden rounded-[40px] border border-white/60 bg-white/85 shadow-[0_30px_120px_rgba(14,165,233,0.12)] backdrop-blur-xl">
          <header className="relative overflow-hidden border-b border-sky-100 bg-linear-to-br from-slate-950 via-slate-900 to-sky-950 px-6 py-10 text-white md:px-10 md:py-14">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-sky-400/20 blur-[110px]" />
              <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-[130px]" />
              <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-white/5 blur-[100px]" />
            </div>

            <div className="relative z-10">
              <div className="mb-8 flex justify-start">
                <button
                  type="button"
                  onClick={onBack}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
                  )}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              </div>

              <div className="mx-auto max-w-4xl px-2 text-center">
                <div className="hate-eda-title mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-sky-200">
                    <ShieldAlert size={14} />
                    Multimodal Hate Speech EDA
                  </div>
                <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                    MMHS150K EDA Dashboard
                  </h1>
                <p className="mt-5 mx-auto max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                  Text, Image and Multimodal EDA in one scrollable dashboard.
                </p>
              </div>
            </div>
          </header>

          <div className="border-b border-sky-100/80 bg-white px-6 py-4 md:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {SECTION_META.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      'rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700',
                      HATE_FOCUS_RING
                    )}
                  >
                    {section.title}
                  </a>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className={cn(
                    'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50',
                    HATE_FOCUS_RING
                  )}
                >
                  Expand all
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className={cn(
                    'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50',
                    HATE_FOCUS_RING
                  )}
                >
                  Collapse all
                </button>
              </div>
            </div>
          </div>

          <main className="space-y-14 px-6 py-10 md:space-y-16 md:px-10">
              <section id="overview" className="scroll-mt-28">
                <SectionHeader
                  title="Dataset Overview"
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
                      className="overflow-hidden space-y-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {OVERVIEW_CORE_STATS.map((stat) => (
                          <StatCard key={stat.label} value={stat.value} label={stat.label} />
                        ))}
                      </div>

                      <div className="grid gap-6 xl:grid-cols-2">
                        <VizCard
                          title="Target Categories"
                        >
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-200 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                                  <th className="py-2 pr-4">Code</th>
                                  <th className="py-2 pr-4">Class</th>
                                  <th className="py-2">Summary</th>
                                </tr>
                              </thead>
                              <tbody>
                                {TARGET_CLASS_LABELS.map((row) => (
                                  <tr key={row.id} className="border-b border-slate-100">
                                    <td className="py-2.5 pr-4 font-mono text-slate-900">{row.id}</td>
                                    <td className="py-2.5 pr-4 font-bold text-slate-900">{row.name}</td>
                                    <td className="py-2.5 text-slate-600">{row.desc}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </VizCard>

                        <VizCard
                          title="Feature dictionary"
                        >
                          <div className="overflow-x-auto rounded-xl border border-sky-100/90 bg-slate-50/90">
                            <table className="w-full text-left text-xs md:text-sm">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-100/90 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                                  <th className="px-2.5 py-2 md:px-3">Feature</th>
                                  <th className="px-2.5 py-2 md:px-3">Type</th>
                                  <th className="px-2.5 py-2 md:px-3">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {MMHS_FEATURE_DICTIONARY.map((row) => (
                                  <tr key={row.feature} className="border-b border-slate-200/80 last:border-0">
                                    <td className="whitespace-nowrap px-2.5 py-1.5 font-mono font-semibold text-sky-600 md:px-3 md:py-2">
                                      {row.feature}
                                    </td>
                                    <td className="whitespace-nowrap px-2.5 py-1.5 text-slate-600 md:px-3 md:py-2">{row.type}</td>
                                    <td className="px-2.5 py-1.5 text-slate-600 md:px-3 md:py-2">{row.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                                </div>
                          <div className="mt-3 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-sky-950 md:text-sm">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                            <p>
                              Annotated on Amazon Mechanical Turk with six categories; each tweet has three worker labels in{' '}
                              <span className="font-mono text-sky-800">labels</span> /{' '}
                              <span className="font-mono text-sky-800">labels_str</span>.
                            </p>
                          </div>
                        </VizCard>
                      </div>
                      <SampleTweetExplorer />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section id="preprocessing" className="scroll-mt-28">
                <SectionHeader
                  title="Data Preprocessing & Noise"
                  icon={ShieldAlert}
                  isOpen={sections.preprocessing}
                  onToggle={() => toggleSection('preprocessing')}
                />
                <AnimatePresence>
                  {sections.preprocessing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6"
                    >
                        <VizCard
                        title="Class Distribution"
                        >
                        <ClassBalanceChart />
                        </VizCard>
                        <VizCard
                        title="Split Distribution"
                        >
                        <SplitBalanceChart />
                        </VizCard>
                        <VizCard
                        title="Overall Data Quality Checking"
                        subtitle="Detect overall structural issues and noise patterns in the dataset."
                        >
                          <DataQualityIssuesChart />
                        </VizCard>
                        <VizCard
                        title="Class-Level Signal Snapshot"
                        subtitle="Single-view comparison across text, annotation and OCR metrics (normalized)."
                      >
                        <ClassSignalSnapshotChart />
                      </VizCard>
                      <InsightList title="Noise Risks" items={NOISE_RISKS.map((risk) => `${risk.title}: ${risk.detail}`)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section id="text" className="scroll-mt-28">
                <SectionHeader
                  title="Text EDA"
                  icon={Type}
                  isOpen={sections.text}
                  onToggle={() => toggleSection('text')}
                />
                <AnimatePresence>
                  {sections.text && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6"
                    >
                      <VizCard
                        title="Text Quality Diagnostics"
                        subtitle="Language mix and unusually short or long caption patterns."
                      >
                        <TextQualityDiagnosticsChart />
                      </VizCard>
                      <div id="stop-words" className="scroll-mt-28">
                        <VizCard
                          title="Stop Words Analysis"
                          subtitle="Top-15 sklearn English stop tokens per hate class."
                        >
                          <StopWordsAnalysisPanel />
                        </VizCard>
                      </div>

                      <VizCard
                        title="Text Distribution Dashboard"
                      >
                        <TextDistributionDashboardChart />
                      </VizCard>
                        <VizCard
                          title="Overall Keywords"
                        subtitle="Most frequent tweet words (stop words removed)."
                        >
                          <OverallKeywordsChart />
                        </VizCard>
                        <VizCard
                          title="Top Terms by Class"
                        subtitle="Most frequent words by class (stop words removed)."
                        >
                          <TermsExplorerChart
                            dataMap={TOP_WORDS_BY_CLASS}
                          metricLabel="Count"
                          formatter={(v) => v.toLocaleString('en-US')}
                          />
                        </VizCard>

                        <VizCard
                          title="TF-IDF Signature Terms"
                        subtitle="Most distinctive words by class using TF-IDF (stop words removed)."
                        >
                          <TermsExplorerChart
                            dataMap={TFIDF_TERMS_BY_CLASS}
                          metricLabel="TF–IDF score"
                          formatter={(v) => v.toFixed(4)}
                          />
                        </VizCard>

                        <VizCard
                          title="Bigrams by Class"
                        subtitle="Most frequent bigrams by class (stop words removed)."
                        >
                          <TermsExplorerChart
                            dataMap={BIGRAMS_BY_CLASS}
                          metricLabel="Count"
                          formatter={(v) => v.toLocaleString('en-US')}
                          />
                        </VizCard>
                        <VizCard
                          title="Trigrams by Class"
                        subtitle="Most frequent trigrams by class (stop words removed)."
                        >
                          <TermsExplorerChart
                            dataMap={TRIGRAMS_BY_CLASS}
                          metricLabel="Count"
                          formatter={(v) => v.toLocaleString('en-US')}
                          />
                        </VizCard>

                      <InsightList title="Text Takeaways" items={TEXT_FINDINGS} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
              
              <section id="image" className="scroll-mt-28">
                <SectionHeader
                  title="Image EDA"
                  icon={ImageIcon}
                  isOpen={sections.image}
                  onToggle={() => toggleSection('image')}
                />
                <AnimatePresence>
                  {sections.image && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6"
                    >
                      <VizCard
                        title="Images & OCR"
                        subtitle="Sample resized images with OCR transcripts from the release."
                      >
                        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
                          <p>
                            <span className="font-bold text-slate-900">Resized images.</span> Released files under{' '}
                            <span className="font-mono text-xs text-slate-800">img_resized/</span> are resized so the{' '}
                            <span className="font-semibold text-slate-800">shortest side is 500 pixels</span>; the filename matches the tweet (image)
                            ID and aligns with <span className="font-mono text-xs">MMHS150K_GT.json</span>.
                          </p>
                          <p>
                            <span className="font-bold text-slate-900">OCR text.</span> The <span className="font-mono text-xs">img_txt/</span>{' '}
                            folder holds text extracted from each image with OCR. Together with <span className="font-mono text-xs">tweet_text</span>,
                            this supports multimodal analysis when on-image text differs from the caption (e.g. memes, screenshots).
                          </p>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                          {IMAGE_SECTION_STATS.map((stat) => (
                            <StatCard key={stat.label} value={stat.value} label={stat.label} />
                          ))}
                        </div>
                      </VizCard>

                        <VizCard
                        title="Image dimensions"
                        subtitle="Mean image width and height by class."
                        >
                          <WidthHeightDistributionChart />
                        </VizCard>

                        <VizCard
                        title="Brightness vs Sharpness"
                        subtitle="Per-class scatter used for image-quality analysis."
                        >
                        <LazyInViewCharts active={sections.image}>
                          {(load) => <BrightnessSharpnessScatterChart loadData={load} />}
                        </LazyInViewCharts>
                        </VizCard>
                        <VizCard
                          title="Image Complexity and Edge Density"
                          subtitle="Visual layout complexity by class."
                        >
                          <ImageComplexityChart />
                        </VizCard>

                        <VizCard
                          title="YOLO Objects by Class"
                        subtitle="Object detections by class."
                        >
                          <TermsExplorerChart
                            dataMap={YOLO_OBJECTS_BY_CLASS}
                          metricLabel="Detections"
                          formatter={(v) => v.toLocaleString('en-US')}
                          emptyMessage="No YOLO counts in the frozen export for this class."
                          />
                        </VizCard>
                        <VizCard
                          title="Person Presence Rate"
                        subtitle="The percentage of images in each class that have a detected person."
                        >
                        <LazyInViewCharts active={sections.image}>
                          {(load) => <PersonPresenceRateChart loadData={load} />}
                        </LazyInViewCharts>
                        </VizCard>
                      <VizCard
                        title="Class Similarity - Image Embeddings"
                        subtitle="Similarity between class-level image embeddings."
                      >
                        <LazyInViewCharts active={sections.image}>
                          {(load) => (
                            <HateNotebookFigure jsonPath={IMAGE_COSINE_HEATMAP_JSON_PATH} height={520} loadData={load} />
                          )}
                        </LazyInViewCharts>
                      </VizCard>

                      <InsightList title="Image Takeaways" items={IMAGE_FINDINGS} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section id="multimodal" className="scroll-mt-28">
                <SectionHeader
                  title="Multimodal EDA"
                  icon={Layers}
                  isOpen={sections.multimodal}
                  onToggle={() => toggleSection('multimodal')}
                />
                <AnimatePresence>
                  {sections.multimodal && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6"
                    >
                      <VizCard
                        title="OCR Coverage & Text Alignment"
                        subtitle="OCR prevalence, caption length and tweet-to-image text alignment by class."
                      >
                        <MultimodalDashboardChart />
                      </VizCard>

                        <VizCard
                          title="Tweet Length vs OCR Length"
                        subtitle="Compares caption length vs on-image text length for each class. Above the dashed line means image text is longer; below means caption is longer."
                        >
                          <TweetVsOcrLengthChart />
                        </VizCard>
                        <VizCard
                        title="Grad-CAM"
                        subtitle="Grad-CAM heatmaps and RGB strips by class."
                        >
                          <GradCamHeatmapChart />
                        </VizCard>

                      <VizCard
                        title="Censorship Evasion Cases"
                        subtitle="Cases where abusive semantics appear in OCR while tweet text looks clean."
                      >
                        <div className="space-y-5">
                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
                              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Evasion samples</div>
                              <div className="mt-2 text-2xl font-black text-slate-950">{CENSORSHIP_EVASION_TOTAL}</div>
                            </div>
                            <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
                              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Largest class</div>
                              <div className="mt-2 text-sm font-bold text-slate-900">NotHate ({CENSORSHIP_EVASION_CLASS_BREAKDOWN[0].pct.toFixed(2)}%)</div>
                            </div>
                            <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
                              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Hate-labelled share</div>
                              <div className="mt-2 text-sm font-bold text-slate-900">
                                {CENSORSHIP_EVASION_HATE_LABELLED} / {CENSORSHIP_EVASION_TOTAL} ({((CENSORSHIP_EVASION_HATE_LABELLED / CENSORSHIP_EVASION_TOTAL) * 100).toFixed(2)}%)
                              </div>
                            </div>
                            <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
                              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Text-only miss risk</div>
                              <div className="mt-2 text-sm font-bold text-slate-900">High (tweet clean, OCR toxic)</div>
                            </div>
                          </div>
                          <div className={cn(HATE_CALLOUT_SURFACE, 'p-4')}>
                            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Class breakdown</div>
                            <div className="flex flex-wrap gap-2">
                              {CENSORSHIP_EVASION_CLASS_BREAKDOWN.map((row) => (
                                <span key={row.name} className={cn('rounded-full border px-2.5 py-1 text-[11px] font-bold', BADGE_STYLES[row.name])}>
                                  {row.name}: {row.count} ({row.pct.toFixed(2)}%)
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                            <EvasionSampleExplorer />
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                              <CensorshipEvasionChart />
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-500">
                            Cases where the tweet lacks hate lexicon but OCR text contains it.
                          </p>
                        </div>
                      </VizCard>

                      <VizCard
                        title="Interactive Sample Gallery"
                        subtitle="Sample thumbnails by class."
                      >
                        <InteractiveSampleGallery />
                      </VizCard>

                      <InsightList title="Multimodal Takeaways" items={MULTIMODAL_FINDINGS} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section id="insights" className="scroll-mt-28">
                <SectionHeader
                  title="Key Insights"
                  icon={BarChart3}
                  isOpen={sections.insights}
                  onToggle={() => toggleSection('insights')}
                />
                <AnimatePresence>
                  {sections.insights && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6"
                    >
                      <div className="grid gap-6 lg:grid-cols-2">
                        <InsightList
                          title="Executive Summary"
                          items={[
                            'Imbalance is the main structural issue: NotHate dominates while Religion is extremely scarce.',
                            'OCR is critical because hate is often shifted from caption to image text.',
                            'TF-IDF, n-grams and stylistic ratios are more informative than raw frequency alone.',
                            'Visual semantics and OCR position matter more than low-level RGB patterns.',
                          ]}
                        />
                        <InsightList title="Modeling Recommendations" items={RECOMMENDATIONS} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
          </main>

          <footer className="border-t border-sky-100/90 bg-linear-to-b from-white to-slate-50/80 px-6 py-10 text-center text-sm text-slate-500 md:px-10">
            <div className="mb-4 flex justify-center gap-5 text-sky-700">
              <ShieldAlert size={18} />
              <Type size={18} />
              <ImageIcon size={18} />
              <Search size={18} />
            </div>
            <p className="hate-eda-title font-bold text-slate-900">MMHS150K Multimodal Hate Speech - EDA Report</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
