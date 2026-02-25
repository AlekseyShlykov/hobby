'use client';

import { useState, useEffect } from 'react';
import { useTestStore } from '@/lib/store';
import PlaceholderImage from './PlaceholderImage';
import ProgressBar from './ProgressBar';
import type { ContextQuestion as ContextQuestionType, UserContext } from '@/types';

interface Props {
  question: ContextQuestionType;
  contextField: keyof UserContext;
}

export default function ContextQuestion({ question, contextField }: Props) {
  const { locale, answerContext, nextStep, context, setTestComplete, currentStep, totalSteps } = useTestStore();

  const existingValue = context[contextField];
  const [selected, setSelected] = useState<string | null>(existingValue || null);

  useEffect(() => {
    setSelected(context[contextField] || null);
  }, [question.id, context, contextField]);

  const handleSelect = (value: string) => {
    setSelected(value);
    answerContext(question.id, contextField, value);

    setTimeout(() => {
      if (currentStep >= totalSteps) {
        setTestComplete(true);
      } else {
        nextStep();
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-2xl">
        <ProgressBar />

        <div className="space-y-8">
          <div className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <PlaceholderImage
              name={question.image}
              width={600}
              height={180}
              className="w-full opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-center leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {question.text[locale]}
          </h2>

          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.value)}
                className={`group w-full p-5 rounded-2xl text-left transition-all duration-300 border ${
                  selected === option.value
                    ? 'scale-[1.02] shadow-xl shadow-violet-200/30'
                    : 'hover:scale-[1.01] shadow-lg shadow-violet-100/20'
                }`}
                style={{
                  background: selected === option.value ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  borderColor: selected === option.value ? 'var(--accent-primary)' : 'var(--border)',
                  color: selected === option.value ? 'white' : 'var(--text-primary)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selected === option.value
                        ? 'border-white bg-white'
                        : ''
                    }`}
                    style={{
                      borderColor: selected === option.value ? 'white' : 'var(--text-muted)'
                    }}
                  >
                    {selected === option.value && (
                      <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                    )}
                  </div>
                  <span className="font-medium text-base md:text-lg">{option.text[locale]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
