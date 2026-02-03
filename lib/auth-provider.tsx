"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./auth-store";
import { api } from "./api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { usuario, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    async function loadUserData() {
      // Si ya hay usuario (viene del login), no cargar de nuevo
      if (usuario) {
        console.log("✅ Usuario ya existe en store, saltando carga");
        setIsLoading(false);
        return;
      }

      console.log("🔄 Cargando datos de usuario...");

      try {
        const response = await api.get("/auth/me");

        if (!response.data.usuario || !response.data.empresa) {
          throw new Error("Datos incompletos del servidor");
        }

        console.log("✅ Datos de usuario cargados");

        setAuth({
          usuario: response.data.usuario,
          empresa: response.data.empresa,
          sector: response.data.sector,
          sucursal: response.data.sucursal,
          sectoresDisponibles: response.data.sectoresDisponibles || [],
          permisos: response.data.permisos || [],
        });
      } catch (error) {
        console.error("❌ Error cargando datos de usuario:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [clearAuth, setAuth, usuario]); // Solo ejecutar una vez

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
