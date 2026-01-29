"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileText, Folder } from "lucide-react";
import * as LucideIcons from "lucide-react";

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
import type { PermisosJerarquicos } from "@/lib/types/permisos";

interface NavMainProps {
  permisos: PermisosJerarquicos;
}

export function NavMain({ permisos }: NavMainProps) {
  const pathname = usePathname();

  // Función helper para obtener el ícono de Lucide (sin errores de tipo)
  const getIcon = (iconName: string | null) => {
    if (!iconName) return FileText;

    // Acceso dinámico sin problemas de tipo
    const icons = LucideIcons as Record<string, unknown>;
    const Icon = icons[iconName];

    // Verificar si es un componente válido
    if (typeof Icon === "function") {
      return Icon as React.ComponentType<{ className?: string }>;
    }

    return FileText;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {/* NIVEL 1: MÓDULOS (colapsable) */}
        {permisos.map((modulo) => {
          const ModuloIcon = getIcon(modulo.icono);

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
                    <ModuloIcon />
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
                                <Folder className="size-4" />
                                <span>{tipo.nombre}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/tipo:rotate-90" />
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>

                            {/* Contenido del tipo: PÁGINAS */}
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {/* NIVEL 3: PÁGINAS (items finales, clickeables) */}
                                {tipo.paginas.map((pagina) => {
                                  const PaginaIcon = getIcon(pagina.icono);
                                  const isActive = pathname === pagina.ruta;

                                  return (
                                    <SidebarMenuSubItem key={pagina.id}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isActive}
                                      >
                                        <Link href={pagina.ruta}>
                                          <PaginaIcon className="size-4" />
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

// "use client";

// import { ChevronRight, type LucideIcon } from "lucide-react";

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";

// export function NavMain({
//   items,
// }: {
//   items: {
//     title: string;
//     url: string;
//     icon?: LucideIcon;
//     isActive?: boolean;
//     items?: {
//       title: string;
//       url: string;
//     }[];
//   }[];
// }) {
//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Menú de accesos</SidebarGroupLabel>
//       <SidebarMenu>
//         {items.map((item) => (
//           <Collapsible
//             key={item.title}
//             asChild
//             defaultOpen={item.isActive}
//             className="group/collapsible"
//           >
//             <SidebarMenuItem>
//               <CollapsibleTrigger asChild>
//                 <SidebarMenuButton tooltip={item.title}>
//                   {item.icon && <item.icon />}
//                   <span>{item.title}</span>
//                   <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                 </SidebarMenuButton>
//               </CollapsibleTrigger>
//               <CollapsibleContent>
//                 <SidebarMenuSub>
//                   {item.items?.map((subItem) => (
//                     <SidebarMenuSubItem key={subItem.title}>
//                       <SidebarMenuSubButton asChild>
//                         <a href={subItem.url}>
//                           <span>{subItem.title}</span>
//                         </a>
//                       </SidebarMenuSubButton>
//                     </SidebarMenuSubItem>
//                   ))}
//                 </SidebarMenuSub>
//               </CollapsibleContent>
//             </SidebarMenuItem>
//           </Collapsible>
//         ))}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }
