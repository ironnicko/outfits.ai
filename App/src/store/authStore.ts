import { create } from 'zustand';
import { setTokenLocal, setUsernameLocal } from '../utils/auth';


export interface AuthState {
    token: string | null;
    username: string | null;
    setToken: (token: string) => Promise<void>;
    setUsername: (username: string) => Promise<void>;
    clearToken: () => void;
    clearUsername: () => void;
}


export const useAuthStore = create<AuthState>((set: any) => ({
    token: null,
    id: null,
    username: null,
    setToken: async (token: string) => {
        await setTokenLocal(token);
        set({ token });
    },
    clearToken: () => {
        set({ token: null });
    },
    setUsername: async (username: string) => {
        await setUsernameLocal(username);
        set({ username });
    },
    clearUsername: () => {
        set({ username: null })
    }

}));