"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth } = useAuthStore();

  // useRef NO causa re-renders (mejor que useState)
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Solo ejecutar una vez
    if (hasCheckedRef.current) return;

    hasCheckedRef.current = true;

    // Intentar cargar usuario automáticamente
    async function checkAuth() {
      try {
        const response = await api.get("/auth/me");
        setAuth({
          usuario: response.data.usuario,
          permisos: response.data.permisos || [],
        });
      } catch (error) {
        // Si falla (401, no hay cookie, sesión revocada), limpiar
        clearAuth();
      }
    }

    checkAuth();

    // Array vacío = solo se ejecuta al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
