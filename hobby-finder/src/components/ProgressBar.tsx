'use client';

import { useTestStore } from '@/lib/store';
import results from '@/data/results.json';

export default function ProgressBar() {
  const { currentStep, totalSteps, locale } = useTestStore();
  const ui = results.ui.progress;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-5 sm:mb-8">
      <div className="flex justify-between text-xs sm:text-sm font-medium mb-2 sm:mb-3" style={{ color: 'var(--text-secondary)' }}>
        <span>
          {ui.question[locale]} {currentStep} {ui.of[locale]} {totalSteps}
        </span>
        <span className="tabular-nums">{Math.round(progress)}%</span>
      </div>
      <div className="h-1 sm:h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-hover))'
          }}
        />
      </div>
    </div>
  );
}
