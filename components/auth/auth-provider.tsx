"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setAuth, setLoading, clearAuth } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Solo cargar si estamos en una ruta protegida (no en /login)
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    // Solo ejecutar una vez por mount
    if (hasChecked.current) {
      return;
    }

    hasChecked.current = true;

    // SIEMPRE verificar con el backend al montar
    // Esto detecta si la sesión fue revocada en otro dispositivo
    async function loadUser() {
      try {
        const response = await api.get("/auth/me");

        setAuth({
          usuario: response.data.usuario,
          permisos: response.data.permisos || [],
        });
      } catch (error) {
        // Si falla (401, sesión revocada, no hay cookie, etc)
        // Limpiar store y dejar que el middleware redirija
        clearAuth();
      }
    }

    loadUser();
  }, [pathname, setAuth, setLoading, clearAuth]);

  return <>{children}</>;
}
