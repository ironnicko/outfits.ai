import create from "zustand";

// Define the state structure
interface ColorAnalysisState {
  data: any | null; // Stores the color analysis result
  setData: (result: any) => void; // Function to update the result
}

// Create Zustand store
export const useColorAnalysisStore = create<ColorAnalysisState>((set) => ({
  data: null, // Initial state is empty
  setData: (result) => set({ data: result }),
}));
