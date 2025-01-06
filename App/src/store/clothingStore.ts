import { create } from "zustand";
import { api } from "../utils/api";

export interface Tag {
    ID: number;
    tag: string;
}

export interface Clothes {
    ID?: string;
    type?: string
    url?: string
    Tags?: Tag[] | null
    color?: string
    User?: any
    CreatedAt?: string
    DeletedAt?: string
    UpdatedAt?: string
}

const mockClothes: Clothes[] = [
    { ID: '2', Tags: [], type: 'top', url: '/Users/avya/Desktop/outfits.ai/App/clothing/top/85.png', color: "" },
    { ID: '3', Tags: [], type: 'bottom', url: '/Users/avya/Desktop/outfits.ai/App/clothing/bottom/89.png', color: "" },
    { ID: '4', Tags: [], type: 'shoe', url: '/Users/avya/Desktop/outfits.ai/App/clothing/shoe/WhatsApp Image 2024-12-30 at 21.58.44.png', color: "" },
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
            const response = await api.get('/api/v1/clothing', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data: Clothes[] = response.data;
            set({ clothes: data });
        } catch (error: any) {
            console.error("Failed to fetch clothes:", error.message);
        }
    },
    clear: () => {
        set({ clothes: mockClothes })
    }
}));