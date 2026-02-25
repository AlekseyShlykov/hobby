'use client';

import { useTestStore } from '@/lib/store';
import Welcome from './Welcome';
import LikertQuestion from './LikertQuestion';
import VisualQuestion from './VisualQuestion';
import ContextQuestion from './ContextQuestion';
import Results from './Results';
import testConfig from '@/data/test-config.json';
import type { LikertQuestion as LikertQ, VisualQuestion as VisualQ, ContextQuestion as ContextQ, UserContext } from '@/types';

// Test structure: 10 OCEAN + 12 Hobby + 5 Visual + 2 Context = 29 questions

export default function TestFlow() {
  const { currentStep, isTestComplete } = useTestStore();

  // Show welcome screen
  if (currentStep === 0) {
    return <Welcome />;
  }

  // Show results
  if (isTestComplete) {
    return <Results />;
  }

  const oceanQuestions = testConfig.questions.ocean as unknown as LikertQ[];
  const hobbyQuestions = testConfig.questions.hobby as unknown as LikertQ[];
  const visualQuestions = testConfig.questions.visual as unknown as VisualQ[];
  const contextQuestions = testConfig.questions.context as unknown as ContextQ[];

  // Calculate step boundaries based on actual question counts
  const oceanEnd = oceanQuestions.length;
  const hobbyEnd = oceanEnd + hobbyQuestions.length;
  const visualEnd = hobbyEnd + visualQuestions.length;
  const contextEnd = visualEnd + contextQuestions.length;

  // Steps 1-10: Big Five OCEAN questions
  if (currentStep >= 1 && currentStep <= oceanEnd) {
    const questionIndex = currentStep - 1;
    const question = oceanQuestions[questionIndex];
    if (question) {
      return <LikertQuestion question={question} />;
    }
  }

  // Steps 11-22: Hobby-related questions (RIASEC)
  if (currentStep > oceanEnd && currentStep <= hobbyEnd) {
    const questionIndex = currentStep - oceanEnd - 1;
    const question = hobbyQuestions[questionIndex];
    if (question) {
      return <LikertQuestion question={question} />;
    }
  }

  // Steps 23-25: Visual questions
  if (currentStep > hobbyEnd && currentStep <= visualEnd) {
    const questionIndex = currentStep - hobbyEnd - 1;
    const question = visualQuestions[questionIndex];
    if (question) {
      return <VisualQuestion question={question} />;
    }
  }

  // Steps 26-27: Context questions
  if (currentStep > visualEnd && currentStep <= contextEnd) {
    const questionIndex = currentStep - visualEnd - 1;
    const question = contextQuestions[questionIndex];
    const contextFields: (keyof UserContext)[] = ['time', 'budget'];
    if (question) {
      return (
        <ContextQuestion
          question={question}
          contextField={contextFields[questionIndex]}
        />
      );
    }
  }

  // Fallback
  return <Welcome />;
}
