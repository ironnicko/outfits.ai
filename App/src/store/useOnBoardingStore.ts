import { create } from "zustand";

export const useOnboardingStore = create((set) => ({
  step: 0,
  totalSteps: 0, // Initialize with 0, will be set dynamically
  answers: {},

  setTotalSteps: (steps) => set({ totalSteps: steps }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    })),

  nextStep: () =>
    set((state) => ({
      step: state.step < state.totalSteps - 1 ? state.step + 1 : state.step,
    })),

  prevStep: () =>
    set((state) => ({
      step: state.step > 0 ? state.step - 1 : state.step,
    })),
}));
