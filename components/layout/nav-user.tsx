"use client";

import { useState, useEffect } from "react";
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

// Tipar el estado global
interface UserLoadState {
  isLoading: boolean;
  hasLoaded: boolean;
  lastLoadTime: number;
}

// Extender Window
declare global {
  interface Window {
    __USER_LOAD_STATE?: UserLoadState;
  }
}

// Inicializar estado global
if (typeof window !== "undefined" && !window.__USER_LOAD_STATE) {
  window.__USER_LOAD_STATE = {
    isLoading: false,
    hasLoaded: false,
    lastLoadTime: 0,
  };
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { usuario } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.__USER_LOAD_STATE) return;

    const state = window.__USER_LOAD_STATE;
    const now = Date.now();

    // Protecciones múltiples:
    // 1. Si ya hay usuario, no cargar
    if (usuario) return;

    // 2. Si ya está cargando, no cargar
    if (state.isLoading) {
      console.log("⏳ Ya está cargando, skipping...");
      return;
    }

    // 3. Si ya cargó hace menos de 5 segundos, no cargar
    if (state.hasLoaded && now - state.lastLoadTime < 5000) {
      console.log("⏱️ Cargó recientemente, skipping...");
      return;
    }

    // Marcar que está cargando
    state.isLoading = true;

    console.log("🔄 Iniciando carga de usuario...");

    async function loadUser() {
      try {
        const response = await api.get("/auth/me");
        console.log("✅ Usuario cargado exitosamente");

        useAuthStore.getState().setAuth({
          usuario: response.data.usuario,
          permisos: response.data.permisos || [],
        });

        if (window.__USER_LOAD_STATE) {
          window.__USER_LOAD_STATE.hasLoaded = true;
          window.__USER_LOAD_STATE.lastLoadTime = Date.now();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("❌ Error al cargar usuario:", error.message);
        }
        // El interceptor maneja el 401 automáticamente
        if (window.__USER_LOAD_STATE) {
          window.__USER_LOAD_STATE.hasLoaded = true;
          window.__USER_LOAD_STATE.lastLoadTime = Date.now();
        }
      } finally {
        if (window.__USER_LOAD_STATE) {
          window.__USER_LOAD_STATE.isLoading = false;
        }
      }
    }

    loadUser();
  }, [usuario]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      // Reset state
      if (typeof window !== "undefined" && window.__USER_LOAD_STATE) {
        window.__USER_LOAD_STATE = {
          isLoading: false,
          hasLoaded: false,
          lastLoadTime: 0,
        };
      }
      useAuthStore.getState().clearAuth();
      router.push("/login");
    }
  };

  const handleLogoutAll = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await api.post("/auth/logout-all");
    } catch (error) {
      console.error("Error al hacer logout-all:", error);
    } finally {
      // Reset state
      if (typeof window !== "undefined" && window.__USER_LOAD_STATE) {
        window.__USER_LOAD_STATE = {
          isLoading: false,
          hasLoaded: false,
          lastLoadTime: 0,
        };
      }
      useAuthStore.getState().clearAuth();
      router.push("/login");
    }
  };

  if (!usuario) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt={usuario.nombre} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(usuario.nombre)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{usuario.nombre}</span>
                <span className="truncate text-xs">{usuario.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt={usuario.nombre} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(usuario.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{usuario.nombre}</span>
                  <span className="truncate text-xs">{usuario.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Mi Cuenta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notificaciones
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut />
              {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut />
              {isLoggingOut
                ? "Cerrando sesiones..."
                : "Cerrar en Todos los Dispositivos"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
