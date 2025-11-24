import type { UserProfile } from "../types";
import { create } from "zustand";

interface AuthUserState {
  profile: UserProfile;
  isAuthenticated: boolean;
}

interface AuthActions {
  setProfile: (profile: UserProfile) => void;
  logout: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthUserState & AuthActions>((set) => ({
  profile: {} as UserProfile,
  isAuthenticated: !!localStorage.getItem("authToken"),
  setProfile: (profile: UserProfile) => {
    
    set({ profile });
  },
  logout: () => {
    localStorage.removeItem("authToken");
    set({ profile: {} as UserProfile, isAuthenticated: false });
  },
  setIsAuthenticated: (isAuthenticated) => {
    set({ isAuthenticated });
  },
}));
