'use client';

import { useTestStore } from '@/lib/store';
import PlaceholderImage from './PlaceholderImage';
import LanguageSelector from './LanguageSelector';
import results from '@/data/results.json';

export default function Welcome() {
  const { locale, startTest, totalSteps } = useTestStore();
  const ui = results.ui.welcome;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>

      <div className="max-w-xl w-full text-center space-y-10">
        <div className="relative w-full max-w-xl mx-auto aspect-[400/250]">
          <PlaceholderImage
            name="hero-hobbies"
            width={400}
            height={250}
            fill
            className="absolute inset-0 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {ui.title[locale]}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {ui.subtitle[locale]}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={startTest}
            className="group relative w-full py-5 px-8 text-lg font-semibold rounded-2xl transition-all duration-300 overflow-hidden"
            style={{ 
              background: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <span className="relative flex items-center justify-center gap-3">
              {ui.start[locale]}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {totalSteps} {locale === 'ru' ? 'вопросов' : locale === 'fr' ? 'questions' : 'questions'} • 5-7 min
          </p>
        </div>
      </div>
    </div>
  );
}
