import { create } from 'zustand';
import { SelectedClothing } from '../screens/generateOutfits/GenerateOutfitsScreen';
import { Clothes } from './clothingStore';
import { api } from '../utils/api';

export interface SavedOutfit {
  ID?: string | null;
  OutfitTop?: SelectedClothing;
  OutfitBottom?: SelectedClothing;
  OutfitHat?: SelectedClothing;
  OutfitShoe?: SelectedClothing;
  top?: string | null;
  bottom?: string | null;
  shoe?: string | null;
  hat?: string | null;
  description?: string | null;
  try_on_image?: string | null;
  occasion?: string;
  CreatedAt?: string;
}

export function isSavedOutfit(item: SavedOutfit | Clothes[]): item is SavedOutfit {
  return (
    (item as SavedOutfit).OutfitHat !== undefined ||
    (item as SavedOutfit).OutfitTop !== undefined ||
    (item as SavedOutfit).OutfitBottom !== undefined ||
    (item as SavedOutfit).OutfitShoe !== undefined
  );
}

export function convertSavedOutfit(items: SavedOutfit) {
  var final = []
  if (items.OutfitHat?.url != '') {
    final.push(items.OutfitHat || { type: "hat" })
  }
  if (items.OutfitShoe?.url != '') {
    final.push(items.OutfitShoe || { type: "shoe" })
  }
  if (items.OutfitTop?.url != '') {
    final.push(items.OutfitTop || { type: "top" })
  }
  if (items.OutfitBottom?.url != '') {
    final.push(items.OutfitBottom || { type: "bottom" })
  }
  return final
}

export function convertClothes(items: Clothes[]) {
  var final: SavedOutfit = { ID: null };
  // final.description = items.description
  items.forEach((item) => {
    if (item.type == 'hat' && item.url) {
      final.hat = item.ID
    }
    if (item.type == 'bottom' && item.url) {
      final.bottom = item.ID
    }
    if (item.type == 'top' && item.url) {
      final.top = item.ID
    }
    if (item.type == 'shoe' && item.url) {
      final.shoe = item.ID
    }
  })

  return final
}
export function convertSavedOutfitUpload(items: SavedOutfit) {
  var final: SavedOutfit = { ID: null };
  final.description = items.description
  if (items.OutfitHat && items.OutfitHat.url) {
    final.hat = items.OutfitHat.ID
  } else final.hat = null
  if (items.OutfitBottom && items.OutfitBottom.url) {
    final.bottom = items.OutfitBottom.ID
  } else final.bottom = null
  if (items.OutfitTop && items.OutfitTop.url) {
    final.top = items.OutfitTop.ID
  } else final.top = null
  if (items.OutfitShoe && items.OutfitShoe.url) {
    final.shoe = items.OutfitShoe.ID
  } else
    final.shoe = null

  return final
}

interface OutfitState {
  outfits: SavedOutfit[];
  fetch: (token: string) => Promise<void>;
  clear: () => void;
};

export const useOutfitStore = create<OutfitState>((set) => ({
  outfits: [],
  fetch: async (token: string) => {
    try {
      const response = await api.get<SavedOutfit[]>('/api/v1/outfit', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: SavedOutfit[] = response.data;
      set({ outfits: data });
    } catch (error: any) {
      console.error("Failed to fetch clothes:", error.message);
    }
  },
  clear: () => {
    set({ outfits: [] })
  }
}));