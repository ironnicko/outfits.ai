import { create } from "zustand";
import { api } from "../utils/api";

export interface Tag {
    TagID: number;
    TagName: string;
}

export interface Clothes {
    ID?: string;
    Type?: string;
    URL?: string | null;
    Color?: string | null;
    Tags?: Tag[] | null;
}

const mockClothes: Clothes[] = [
    { ID: '2', Tags: [], Type: 'top', URL: '/Users/avya/Desktop/outfits.ai/App/clothing/top/85.png' },
    { ID: '3', Tags: [], Type: 'bottom', URL: '/Users/avya/Desktop/outfits.ai/App/clothing/bottom/89.png' },
    { ID: '4', Tags: [], Type: 'shoe', URL: '/Users/avya/Desktop/outfits.ai/App/clothing/shoe/WhatsApp Image 2024-12-30 at 21.58.44.png' },
];

interface ClothingState {
    clothes: Clothes[];
    fetch: (token: string) => Promise<void>;
    clear: () => void;
}

export const useClothingStore = create<ClothingState>((set) => ({
    clothes: mockClothes,
    fetch: async (token: string) => {
        try {
            const response = await api.get('/api/v1/clothing/get-clothings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data: Clothes[] = response.data;
            set({ clothes: data });
        } catch (error) {
            console.error("Failed to fetch clothes:", error);
        }
    },
    clear: () => {
        set({ clothes: mockClothes })
    }
}));