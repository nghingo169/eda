import React, { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  Music,
  Sparkles,
  Database,
  TrendingUp,
} from 'lucide-react';

const SpotifyEDA = lazy(() => import('./SpotifyEDA'));
const SpotifyML = lazy(() => import('./SpotifyML'));

type SpotifySubView = 'hub' | 'eda' | 'ml';

type SpotifyHubProps = {
  onBack?: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-sm font-semibold tracking-wide text-slate-400">
      Loading…
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center backdrop-blur-md">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-300">
        {label}
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-zinc-500">
      <div className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
      {text}
    </li>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-bold text-zinc-900">{value}</span>
    </div>
  );
}

export default function SpotifyHub({ onBack }: SpotifyHubProps) {
  const [subView, setSubView] = useState<SpotifySubView>('hub');

  if (subView === 'eda') {
    return (
      <Suspense fallback={<PageLoader />}>
        <SpotifyEDA onBack={() => setSubView('hub')} />
      </Suspense>
    );
  }

  if (subView === 'ml') {
    return (
      <Suspense fallback={<PageLoader />}>
        <SpotifyML onBack={() => setSubView('hub')} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1DB954] to-zinc-900 p-4 font-sans md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <header className="relative overflow-hidden bg-zinc-950 px-6 py-14 text-center text-white md:px-10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#1DB954] blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#1DB954] blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-2xl bg-[#1DB954] p-3 text-black shadow-lg shadow-[#1DB954]/20">
              <Music size={40} strokeWidth={3} />
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-[#1DB954] md:text-6xl">
              Spotify Project Hub
            </h1>

            <p className="mx-auto mt-3 max-w-3xl text-lg text-zinc-400 md:text-xl">
              Choose how you want to explore the Spotify Top Songs 2023 project:
              through exploratory data analysis or machine learning results.
            </p>

            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              <StatPill label="Tracks" value="952" />
              <StatPill label="Features" value="24" />
              <StatPill label="EDA View" value="1" />
              <StatPill label="ML View" value="1" />
            </div>
          </div>
        </header>

        <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 shadow-sm">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-full border-2 border-zinc-400 px-5 py-2 text-sm font-bold text-zinc-700 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              <ArrowLeft size={16} />
              Home
            </button>
          ) : null}
        </div>

        <main className="space-y-12 p-6 md:p-10">
          <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
                Explore All Spotify Methods
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-500">
                Start with descriptive insights from the dataset, then move into
                predictive modeling to see how hit songs can be identified.
              </p>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <motion.button
              whileHover={{ y: -8 }}
              onClick={() => setSubView('eda')}
              className="group rounded-3xl border border-zinc-200 bg-white p-8 text-left shadow-sm transition hover:border-[#1DB954]/40 hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1DB954]/10 text-[#1DB954] transition-all duration-500 group-hover:bg-[#1DB954] group-hover:text-black">
                  <BarChart3 size={30} />
                </div>
                <span className="rounded-full border border-[#1DB954]/20 bg-[#1DB954]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1DB954]">
                  EDA
                </span>
              </div>

              <h3 className="text-3xl font-black tracking-tight text-zinc-900 transition-colors group-hover:text-[#1DB954]">
                Dataset Overview (EDA)
              </h3>

              <p className="mt-4 text-base leading-relaxed text-zinc-500">
                Explore distributions, descriptive statistics, artist impact,
                temporal trends, platform influence, and sonic profile patterns
                in the Spotify Top Songs dataset.
              </p>

              <div className="mt-6 space-y-3">
                <InfoRow label="Main goal" value="Understand the data" />
                <InfoRow label="Output" value="Patterns & visual insights" />
                <InfoRow label="Focus" value="Artists, platforms, trends" />
                <InfoRow label="Style" value="Interactive charts" />
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
                <ul className="space-y-3">
                  <FeatureItem text="Audio feature distributions and outlier analysis" />
                  <FeatureItem text="Artist impact, collaboration, and stream concentration" />
                  <FeatureItem text="Temporal patterns like seasonality and Friday release effect" />
                  <FeatureItem text="Platform presence and hit-factor exploration" />
                </ul>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-zinc-900">
                Open EDA Dashboard
                <ArrowRight
                  size={18}
                  className="transition-transform duration-500 group-hover:translate-x-2"
                />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ y: -8 }}
              onClick={() => setSubView('ml')}
              className="group rounded-3xl border border-zinc-200 bg-white p-8 text-left shadow-sm transition hover:border-[#1DB954]/40 hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1DB954]/10 text-[#1DB954] transition-all duration-500 group-hover:bg-[#1DB954] group-hover:text-black">
                  <Brain size={30} />
                </div>
                <span className="rounded-full border border-[#1DB954]/20 bg-[#1DB954]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1DB954]">
                  ML
                </span>
              </div>

              <h3 className="text-3xl font-black tracking-tight text-zinc-900 transition-colors group-hover:text-[#1DB954]">
                Machine Learning
              </h3>

              <p className="mt-4 text-base leading-relaxed text-zinc-500">
                Compare predictive models, examine evaluation metrics, inspect
                the best-performing model, and understand what makes hit-song
                prediction possible.
              </p>

              <div className="mt-6 space-y-3">
                <InfoRow label="Main goal" value="Predict hit songs" />
                <InfoRow label="Output" value="Metrics & model analysis" />
                <InfoRow label="Focus" value="Performance comparison" />
                <InfoRow label="Style" value="Charts + model inspector" />
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
                <ul className="space-y-3">
                  <FeatureItem text="Train/test split and preprocessing pipeline overview" />
                  <FeatureItem text="Comparison across accuracy, precision, recall, F1, and ROC AUC" />
                  <FeatureItem text="Best-model analysis with confusion matrix and interpretation" />
                  <FeatureItem text="Practical insights on hit prediction and feature importance" />
                </ul>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-zinc-900">
                Open ML Dashboard
                <ArrowRight
                  size={18}
                  className="transition-transform duration-500 group-hover:translate-x-2"
                />
              </div>
            </motion.button>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-[#1DB954]/10 p-3 text-[#1DB954]">
                <Sparkles size={24} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-zinc-900">
                  Recommended flow
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-500">
                  Visit <strong>EDA first</strong> to understand the dataset and
                  discover the main patterns. Then continue to{' '}
                  <strong>Machine Learning</strong> to see how those signals are
                  turned into predictive models.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="mb-2 flex items-center gap-2 font-bold text-zinc-900">
                      <Database size={18} className="text-[#1DB954]" />
                      Step 1
                    </div>
                    <p className="text-sm text-zinc-500">
                      Learn the dataset structure and identify meaningful
                      variables.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="mb-2 flex items-center gap-2 font-bold text-zinc-900">
                      <TrendingUp size={18} className="text-[#1DB954]" />
                      Step 2
                    </div>
                    <p className="text-sm text-zinc-500">
                      Observe which factors seem linked to streaming success.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="mb-2 flex items-center gap-2 font-bold text-zinc-900">
                      <Brain size={18} className="text-[#1DB954]" />
                      Step 3
                    </div>
                    <p className="text-sm text-zinc-500">
                      See how well models can use those factors to predict hits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}