"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import type { PermisosJerarquicos } from "@/lib/types/permisos";

interface NavMainProps {
  permisos: PermisosJerarquicos;
}

export function NavMain({ permisos }: NavMainProps) {
  const pathname = usePathname();
  // console.log(permisos);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menú de accesos</SidebarGroupLabel>
      <SidebarMenu>
        {/* NIVEL 1: MÓDULOS (colapsable) */}
        {permisos.map((modulo) => {
          // Verificar si alguna página del módulo está activa
          const isModuloActive = modulo.tipos.some((tipo) =>
            tipo.paginas.some((pagina) => pagina.ruta === pathname),
          );

          return (
            <Collapsible
              key={modulo.id}
              asChild
              defaultOpen={isModuloActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {/* Trigger del módulo */}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={modulo.nombre}>
                    <DynamicIcon name={modulo.icono} />
                    <span>{modulo.nombre}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Contenido del módulo: TIPOS */}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* NIVEL 2: TIPOS (colapsable) */}
                    {modulo.tipos.map((tipo) => {
                      // Verificar si alguna página del tipo está activa
                      const isTipoActive = tipo.paginas.some(
                        (pagina) => pagina.ruta === pathname,
                      );

                      return (
                        <Collapsible
                          key={tipo.id}
                          asChild
                          defaultOpen={isTipoActive}
                          className="group/tipo"
                        >
                          <SidebarMenuSubItem>
                            {/* Trigger del tipo */}
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton>
                                {/* <Folder className="size-4" /> */}
                                <DynamicIcon name={tipo.icono} />
                                <span>{tipo.nombre}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/tipo:rotate-90" />
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>

                            {/* Contenido del tipo: PÁGINAS */}
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {/* NIVEL 3: PÁGINAS (items finales, clickeables) */}
                                {tipo.paginas.map((pagina) => {
                                  const isActive = pathname === pagina.ruta;

                                  return (
                                    <SidebarMenuSubItem key={pagina.id}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isActive}
                                      >
                                        <Link href={pagina.ruta}>
                                          <DynamicIcon
                                            name={pagina.icono}
                                            className="size-4"
                                          />
                                          <span>{pagina.nombre}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuSubItem>
                        </Collapsible>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
