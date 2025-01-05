import { create } from 'zustand';
import { SelectedClothing } from '../screens/generateOutfits/GenerateOutfitsScreen';

export interface SavedOutfit {
  id: string;
  items: SelectedClothing[];
  occasion?: string;
  createdAt: string
}

interface OutfitStore {
  outfits: SavedOutfit[];
  addOutfit: (outfit: SavedOutfit) => void;
  removeOutfit: (id: string) => void;
}

export const useOutfitStore = create<OutfitStore>((set) => ({
  outfits: [],
  addOutfit: (outfit) =>
    set((state) => ({
      outfits: [...state.outfits, {
        ...outfit,
        id: Math.random().toString(36).substr(2, 9),
      }]
    })),
  removeOutfit: (id) =>
    set((state) => ({
      outfits: state.outfits.filter(outfit => outfit.id !== id)
    })),
})); 