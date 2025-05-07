import { create } from "zustand";

export const useColorAnalysisStore = create((set) => ({
  colorAnalysisResults: null, // Stores color analysis data
  setColorAnalysisResults: (data: any) => set({ colorAnalysisResults: data }),
  resetColorAnalysisResults: () => set({ colorAnalysisResults: null }),
}));
