import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  isInitialized: boolean
  setIsInitialized: (initialized: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isInitialized: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setIsInitialized: (initialized) => set({ isInitialized: initialized }),
})) 