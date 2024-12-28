import { create } from "zustand";
import { api } from "../utils/api";

export interface Tag {
    TagID: number;
    TagName: string;
}

export interface Clothes {
    ID: string;
    Type: string;
    URL: string | null;
    Color?: string | null;
    Tags: Tag[] | null;
}

const mockClothes: Clothes[] = [
    { ID: '1', Tags: [], Type: 'upper', URL: "" },
    { ID: '2', Tags: [], Type: 'upper', URL: 'https://cdn2.iconfinder.com/data/icons/arrows-part-1/32/tiny-arrow-left-2-1024.png' },
    { ID: '3', Tags: [], Type: 'lower', URL: 'https://example.com/pants1.jpg' },
    { ID: '4', Tags: [], Type: 'shoes', URL: 'https://example.com/shoes1.jpg' },
];

interface ClothingState {
    clothes: Clothes[];
    fetch: (token: string) => Promise<void>;
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
}));