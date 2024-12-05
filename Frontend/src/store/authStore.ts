import { create } from 'zustand';
import { setTokenLocal } from '../utils/auth';


export interface AuthState {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
    token: null,
    id: null,
    setToken: (token: string) => {
        setTokenLocal(token);
        set({ token });
    },
    clearToken: () => {

        set({ token: null });
    },

}));
