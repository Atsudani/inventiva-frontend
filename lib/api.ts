import axios from "axios";
import { useAuthStore } from "@/lib/auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 ESTO ES LA CLAVE para implementar httpOnly cookie, token del lado de server
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
