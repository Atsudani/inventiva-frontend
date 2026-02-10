"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  KeyRound,
  LogOut,
} from "lucide-react";

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

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { usuario } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const clearCookieAndRedirect = () => {
    document.cookie =
      "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    useAuthStore.getState().clearAuth();
    router.push("/login");
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      clearCookieAndRedirect();
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
      clearCookieAndRedirect();
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

              <DropdownMenuItem
                onClick={() => router.push("/perfil/cambiar-password")}
              >
                <KeyRound />
                Cambiar Contraseña
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
