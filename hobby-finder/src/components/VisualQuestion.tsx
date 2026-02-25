'use client';

import { useState, useEffect } from 'react';
import { useTestStore } from '@/lib/store';
import PlaceholderImage from './PlaceholderImage';
import ProgressBar from './ProgressBar';
import type { VisualQuestion as VisualQuestionType } from '@/types';

interface Props {
  question: VisualQuestionType;
}

export default function VisualQuestion({ question }: Props) {
  const { locale, answerVisual, nextStep, answers } = useTestStore();

  const existingAnswer = answers.find(a => a.questionId === question.id);
  const [selected, setSelected] = useState<string | null>(existingAnswer?.value || null);

  useEffect(() => {
    const existing = answers.find(a => a.questionId === question.id);
    setSelected(existing?.value || null);
  }, [question.id, answers]);

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    const option = question.options.find(o => o.id === optionId);
    if (option) {
      answerVisual(question.id, optionId, option.impacts);
    }

    setTimeout(() => {
      nextStep();
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-3xl">
        <ProgressBar />

        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-center leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {question.prompt[locale]}
          </h2>

          <div className="grid grid-cols-2 gap-5">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 border ${
                  selected === option.id
                    ? 'ring-2 ring-violet-300 scale-[1.02] shadow-2xl shadow-violet-200/30'
                    : 'hover:scale-[1.01] hover:shadow-xl shadow-lg shadow-violet-100/40'
                }`}
                style={{
                  borderColor: selected === option.id ? 'var(--accent-primary)' : 'var(--border)'
                }}
              >
                <PlaceholderImage
                  name={option.image}
                  height={240}
                  className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 to-transparent" />
                {selected === option.id && (
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--accent-primary)' }}>
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
