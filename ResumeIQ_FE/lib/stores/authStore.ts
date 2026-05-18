import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isHydrated: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Login failed");
          }

          const data = await res.json();
          if (data.code) {
            throw new Error(data.message || "Invalid credentials");
          }

          set({
            user: {
              id: data.id || "1",
              name: data.name || email.split("@")[0],
              email: data.email,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      signUp: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE_URL}/users/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Signup failed");
          }

          const user = await res.json();
          set({
            user: {
              id: String(user.id),
              name: user.name,
              email: user.email,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    },
  ),
);
