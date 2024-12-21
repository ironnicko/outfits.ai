import { create } from 'zustand';
import { setTokenLocal, setUsernameLocal } from '../utils/auth';


export interface AuthState {
    token: string | null;
    username: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
    setUsername: (username: string) => void;
    clearUsername: () => void;
}


export const useAuthStore = create<AuthState>((set: any) => ({
    token: null,
    id: null,
    username: null,
    setToken: (token: string) => {
        setTokenLocal(token);
        set({ token });
    },
    clearToken: () => {
        set({ token: null });
    },
    setUsername: (username: string) => {
        setUsernameLocal(username);
        set({ username });
    },
    clearUsername: () => {
        set({ username: null })
    }

}));