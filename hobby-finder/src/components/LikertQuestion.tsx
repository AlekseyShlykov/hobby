'use client';

import { useState, useEffect } from 'react';
import { useTestStore } from '@/lib/store';
import ProgressBar from './ProgressBar';
import PlaceholderImage from './PlaceholderImage';
import type { LikertQuestion as LikertQuestionType } from '@/types';

interface Props {
  question: LikertQuestionType;
}

const likertValues = ['5', '4', '3', '2', '1'] as const; // 5=agree, 1=disagree

const optionLabels: Record<string, { en: string; ru: string; fr: string }> = {
  '5': { en: 'Strongly agree', ru: 'Полностью согласен', fr: 'Tout à fait d\'accord' },
  '4': { en: 'Agree', ru: 'Скорее согласен', fr: 'D\'accord' },
  '3': { en: 'Neutral', ru: 'Нейтрально', fr: 'Neutre' },
  '2': { en: 'Disagree', ru: 'Скорее не согласен', fr: 'Pas d\'accord' },
  '1': { en: 'Strongly disagree', ru: 'Полностью не согласен', fr: 'Pas du tout d\'accord' },
};

// Dreamy watercolor scale – soft pastels
const optionStyles = [
  'border-emerald-300/60 bg-emerald-50 hover:bg-emerald-100/80 focus:ring-emerald-400/50',
  'border-emerald-200/50 bg-white hover:bg-emerald-50/80 focus:ring-emerald-300/50',
  'border-violet-200/50 bg-white hover:bg-violet-50/80 focus:ring-violet-300/50',
  'border-amber-200/50 bg-white hover:bg-amber-50/80 focus:ring-amber-300/50',
  'border-amber-300/60 bg-amber-50 hover:bg-amber-100/80 focus:ring-amber-400/50',
];

const selectedStyles = [
  'ring-2 ring-emerald-400 border-emerald-400 bg-emerald-100',
  'ring-2 ring-emerald-300 border-emerald-300 bg-emerald-50',
  'ring-2 ring-violet-300 border-violet-300 bg-violet-50',
  'ring-2 ring-amber-300 border-amber-300 bg-amber-50',
  'ring-2 ring-amber-400 border-amber-400 bg-amber-100',
];

export default function LikertQuestion({ question }: Props) {
  const { locale, answerQuestion, nextStep, answers } = useTestStore();

  const existingAnswer = answers.find(a => a.questionId === question.id);
  const [selected, setSelected] = useState<string | null>(existingAnswer?.value || null);

  useEffect(() => {
    const existing = answers.find(a => a.questionId === question.id);
    setSelected(existing?.value || null);
  }, [question.id, answers]);

  const handleSelect = (value: string) => {
    setSelected(value);
    const impacts = question.impacts[value] || {};
    answerQuestion(question.id, value, impacts);

    setTimeout(() => {
      nextStep();
    }, 350);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 safe-area-pb"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 justify-center">
        <ProgressBar />

        <div className="space-y-6 sm:space-y-8">
          {question.image && (
            <div className="w-full rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <PlaceholderImage
                name={question.image}
                width={800}
                height={400}
                className="w-full"
              />
            </div>
          )}
          {/* Question text – readable line length, responsive size */}
          <h2
            className="text-lg sm:text-xl md:text-2xl font-semibold text-center leading-snug sm:leading-relaxed px-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {question.text[locale]}
          </h2>

          {/* Scale: vertical on mobile (better touch + readability), horizontal on desktop */}
          <div
            className="space-y-3 sm:space-y-4"
            role="radiogroup"
            aria-label={question.text[locale]}
          >
            {/* Mobile: vertical list – full labels, min 48px touch targets */}
            <div className="flex flex-col gap-2 sm:hidden">
              {likertValues.map((value, index) => {
                const isSelected = selected === value;
                const label = optionLabels[value][locale];
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSelect(value)}
                    className={`min-h-[48px] w-full rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isSelected ? selectedStyles[index] : optionStyles[index]
                    }`}
                    style={{
                      color: 'var(--text-primary)',
                    }}
                    aria-pressed={isSelected}
                    aria-label={label}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium text-base">{label}</span>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 flex-shrink-0 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop: horizontal scale with endpoint labels */}
            <div className="hidden sm:block space-y-4">
              <div className="flex justify-between text-sm font-medium px-1" style={{ color: 'var(--text-secondary)' }}>
                <span>{optionLabels['5'][locale]}</span>
                <span>{optionLabels['1'][locale]}</span>
              </div>
              <div className="flex gap-2 md:gap-3">
                {likertValues.map((value, index) => {
                  const isSelected = selected === value;
                  const label = optionLabels[value][locale];
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSelect(value)}
                      title={label}
                      className={`flex-1 min-h-[56px] md:min-h-[64px] rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] ${
                        isSelected ? `${selectedStyles[index]} scale-105 shadow-lg` : optionStyles[index]
                      }`}
                      aria-pressed={isSelected}
                      aria-label={label}
                    >
                      {isSelected ? (
                        <span className="flex items-center justify-center w-full h-full">
                          <svg
                            className="w-6 h-6 md:w-7 md:h-7 text-slate-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="sr-only">{label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Decorative gradient line – desktop only */}
            <div className="hidden sm:block h-1 rounded-full bg-gradient-to-r from-emerald-200 via-violet-100 to-amber-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
