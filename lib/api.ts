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

// Flag para evitar múltiples redirecciones simultáneas
let isHandling401 = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isHandling401) {
      isHandling401 = true;

      useAuthStore.getState().clearAuth();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        try {
          // Llamar a clear-cookie (NO requiere auth) para borrar la cookie HttpOnly
          await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005"}/auth/clear-cookie`,
            {
              method: "POST",
              credentials: "include",
            },
          );
        } catch {
          // Ignorar errores, igual vamos a redirigir
        }

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
