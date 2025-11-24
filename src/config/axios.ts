import axios from "axios";

import { useAuthStore } from "@/domain/auth/stores/auth.store";

export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Token expirado");
      const logout = useAuthStore.getState().logout;
      logout();
    }
    return Promise.reject(error);
  }
);
