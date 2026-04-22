import React, { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './Home';

const SpotifyEDA = lazy(() => import('./pages/1_spotify/SpotifyEDA'));
const Hate = lazy(() => import('./pages/2_hate/Hate'));

type View = 'home' | 'spotify' | 'hate';

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-sm font-semibold tracking-wide text-slate-400">
      Loading…
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  {currentView === 'hate' && <Hate onBack={() => setCurrentView('home')} />}
  {currentView === 'spotify' && <SpotifyEDA onBack={() => setCurrentView('home')} />}
  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Home onSelect={setCurrentView} />
          </motion.div>
        )}
        {currentView === 'spotify' && (
          <motion.div
            key="spotify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Suspense fallback={<PageLoader />}>
              <SpotifyEDA onBack={() => setCurrentView('home')} />
            </Suspense>
          </motion.div>
        )}
        {currentView === 'hate' && (
          <motion.div
            key="hate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Suspense fallback={<PageLoader />}>
              <Hate onBack={() => setCurrentView('home')} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}