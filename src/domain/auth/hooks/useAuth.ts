import { useAuthStore } from "../stores/auth.store";

export default function useAuth() {
  const profile = useAuthStore((state) => state.profile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setProfile = useAuthStore((state) => state.setProfile);
  const logout = useAuthStore((state) => state.logout);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  return {
    isAuthenticated,
    profile,
    setProfile,
    logout,
    setIsAuthenticated,
  };
}
