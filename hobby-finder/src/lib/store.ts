import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale, UserScores, UserContext, Answer, OceanTrait, RiasecTrait, TraitImpacts } from '@/types';

interface TestState {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Test progress
  currentStep: number;
  totalSteps: number;
  answers: Answer[];

  // Scores
  scores: UserScores;
  context: UserContext;

  // Actions
  startTest: () => void;
  answerQuestion: (questionId: string, value: string, impacts: TraitImpacts) => void;
  answerVisual: (questionId: string, optionId: string, impacts: TraitImpacts) => void;
  answerContext: (questionId: string, field: keyof UserContext, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetTest: () => void;

  // Status
  isTestComplete: boolean;
  setTestComplete: (complete: boolean) => void;
}

const initialScores: UserScores = {
  ocean: { O: 5, C: 5, E: 5, A: 5, N: 5 },
  riasec: { R: 5, I: 5, Art: 5, S: 5, Ent: 5, Con: 5 },
};

const initialContext: UserContext = {
  time: '',
  budget: '',
  activity: '',
};

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),

      currentStep: 0,
      totalSteps: 29, // 10 OCEAN + 12 Hobby + 5 Visual + 2 Context
      answers: [],
      scores: { ...initialScores },
      context: { ...initialContext },
      isTestComplete: false,

      startTest: () => set({
        currentStep: 1,
        answers: [],
        scores: {
          ocean: { O: 5, C: 5, E: 5, A: 5, N: 5 },
          riasec: { R: 5, I: 5, Art: 5, S: 5, Ent: 5, Con: 5 },
        },
        context: { ...initialContext },
        isTestComplete: false,
      }),

      answerQuestion: (questionId, value, impacts) => {
        const { scores, answers } = get();
        const newScores = { ...scores };

        // Apply impacts to scores
        Object.entries(impacts).forEach(([trait, impact]) => {
          if (trait in newScores.ocean) {
            newScores.ocean[trait as OceanTrait] += impact;
          } else if (trait in newScores.riasec) {
            newScores.riasec[trait as RiasecTrait] += impact;
          }
        });

        // Clamp scores between 0 and 10
        Object.keys(newScores.ocean).forEach((key) => {
          newScores.ocean[key as OceanTrait] = Math.max(0, Math.min(10, newScores.ocean[key as OceanTrait]));
        });
        Object.keys(newScores.riasec).forEach((key) => {
          newScores.riasec[key as RiasecTrait] = Math.max(0, Math.min(10, newScores.riasec[key as RiasecTrait]));
        });

        const newAnswer: Answer = {
          questionId,
          value,
          timestamp: Date.now(),
        };

        set({
          scores: newScores,
          answers: [...answers.filter(a => a.questionId !== questionId), newAnswer],
        });
      },

      answerVisual: (questionId, optionId, impacts) => {
        const { scores, answers } = get();
        const newScores = { ...scores };

        Object.entries(impacts).forEach(([trait, impact]) => {
          if (trait in newScores.ocean) {
            newScores.ocean[trait as OceanTrait] += impact;
          } else if (trait in newScores.riasec) {
            newScores.riasec[trait as RiasecTrait] += impact;
          }
        });

        // Clamp scores
        Object.keys(newScores.ocean).forEach((key) => {
          newScores.ocean[key as OceanTrait] = Math.max(0, Math.min(10, newScores.ocean[key as OceanTrait]));
        });
        Object.keys(newScores.riasec).forEach((key) => {
          newScores.riasec[key as RiasecTrait] = Math.max(0, Math.min(10, newScores.riasec[key as RiasecTrait]));
        });

        const newAnswer: Answer = {
          questionId,
          value: optionId,
          timestamp: Date.now(),
        };

        set({
          scores: newScores,
          answers: [...answers.filter(a => a.questionId !== questionId), newAnswer],
        });
      },

      answerContext: (questionId, field, value) => {
        const { context, answers } = get();

        const newAnswer: Answer = {
          questionId,
          value,
          timestamp: Date.now(),
        };

        set({
          context: { ...context, [field]: value },
          answers: [...answers.filter(a => a.questionId !== questionId), newAnswer],
        });
      },

      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      resetTest: () => set({
        currentStep: 0,
        answers: [],
        scores: {
          ocean: { O: 5, C: 5, E: 5, A: 5, N: 5 },
          riasec: { R: 5, I: 5, Art: 5, S: 5, Ent: 5, Con: 5 },
        },
        context: { ...initialContext },
        isTestComplete: false,
      }),

      setTestComplete: (complete) => set({ isTestComplete: complete }),
    }),
    {
      name: 'hobby-finder-storage',
      partialize: (state) => ({
        locale: state.locale,
        answers: state.answers,
        scores: state.scores,
        context: state.context,
        currentStep: state.currentStep,
        isTestComplete: state.isTestComplete,
      }),
    }
  )
);
