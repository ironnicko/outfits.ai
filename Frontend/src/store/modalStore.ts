import { create } from 'zustand';

export interface ModalState {
    yes: boolean;
    setBool: (yes: boolean) => void;
    toggleBool: () => void;
}

export const useModalStore = create<ModalState>((set: any) => ({
    yes: false,
    setBool: (yes: boolean) => {
        set({ yes });
    },
    toggleBool: () => {
        set({ yes: false });
    },

}));
