"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./auth-store";
import { api } from "./api";
import { Spinner } from "@/components/ui/Spinner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isValidating, setIsValidating] = useState(true);

  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const usuario = useAuthStore((s) => s.usuario);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    // Esperar a que Zustand hidrate desde localStorage
    if (!hasHydrated) {
      return;
    }

    async function validateSession() {
      // Si no hay usuario en el store (ni de localStorage), no hay nada que validar
      if (!usuario) {
        console.log("📭 No hay usuario en store, nada que validar");
        setIsValidating(false);
        return;
      }

      console.log("🔄 Validando sesión con el servidor...");

      try {
        // Validar que la cookie/sesión siga siendo válida
        await api.get("/auth/me");
        console.log("✅ Sesión válida");
      } catch (error) {
        // Si falla (401), el interceptor de api.ts ya limpia y redirige
        console.error("❌ Sesión inválida:", error);
        clearAuth();
      } finally {
        setIsValidating(false);
      }
    }

    validateSession();
  }, [hasHydrated, usuario, clearAuth]);

  // Mostrar loading mientras:
  // 1. Zustand está hidratando desde localStorage
  // 2. Estamos validando la sesión con el servidor
  if (!hasHydrated || (isAuthenticated && isValidating)) {
    return <Spinner />;
  }

  return <>{children}</>;
}
