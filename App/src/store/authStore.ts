import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setTokenLocal, setUsernameLocal } from "../utils/auth";

export interface AuthState {
    token: string | null;
    username: string | null;
    isOnboardingComplete: boolean;
    all_data: any,
    setToken: (token: string) => Promise<void>;
    setUsername: (username: string) => Promise<void>;
    setOnboardingComplete: (status: boolean) => void;
    clearToken: () => void;
    clearUsername: () => void;
    setAllData: (all_data: any) => void;
  }
  
  export const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        token: null,
        username: null,
        isOnboardingComplete: false,
        all_data: {},
        setAllData: async(all_data: any)=> {
          set({ all_data })
        },
        setToken: async (token: string) => {
          await setTokenLocal(token);
          set({ token });
        },
        setUsername: async (username: string) => {
          await setUsernameLocal(username);
          set({ username });
        },
        setOnboardingComplete: (status: boolean) => set({ isOnboardingComplete: status }), // ✅ Update state correctly
        clearToken: () => set({ token: null }),
        clearUsername: () => set({ username: null }),
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  );
  