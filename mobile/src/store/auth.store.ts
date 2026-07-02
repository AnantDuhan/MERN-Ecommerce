import { create } from "zustand";

import { User } from "@/features/auth/types/user";

interface AuthState {
  user: User | null;
  token: string | null;

  isAuthenticated: boolean;
  isInitializing: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: (user: User | null, token: string | null) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
      isInitializing: false,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: false,
    }),

  initialize: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: !!token,
      isInitializing: false,
    }),

  setUser: (user) =>
    set((state) => ({
      ...state,
      user,
    })),
}));
