"use client";

import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/auth-store";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();

  const contextoOperativo = useAuthStore((s) => s.contextoOperativo);
  const cambiarSector = useAuthStore((s) => s.cambiarSector);

  if (!contextoOperativo) {
    return null;
  }

  const { empresa, sector, sucursal, sectoresDisponibles } = contextoOperativo;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {/* <activeTeam.logo className="size-4" /> */}
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{sector.nombre}</span>
                <span className="truncate text-xs">{sucursal.nombre}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-gray-50"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel> */}

            {/* Empresa actual (solo informativo) */}
            <DropdownMenuLabel className="text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">
                  {empresa.nombre}
                </span>
                <span className="font-normal text-muted-foreground">
                  RUC: {empresa.ruc}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Sectores disponibles */}
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Sectores
            </DropdownMenuLabel>

            {sectoresDisponibles.map((s) => {
              const isActive = s.codSector === sector.codigo;

              return (
                <DropdownMenuItem
                  key={s.codSector}
                  onClick={() => cambiarSector(s.codSector)}
                  className="gap-2 p-2 cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Building2 className="size-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="truncate">{s.nombre}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {s.sucursal.nombre}
                    </span>
                  </div>
                  {isActive && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              );
            })}

            {/* {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))} */}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
