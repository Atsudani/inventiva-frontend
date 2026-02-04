"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuthStore } from "@/lib/auth-store";

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const obtenerPaginaPorRuta = useAuthStore((s) => s.obtenerPaginaPorRuta);
  const permisos = useAuthStore((s) => s.permisos);

  // Si estamos en home, no mostrar breadcrumbs
  if (pathname === "/" || pathname === "/login") {
    return null;
  }

  const pagina = obtenerPaginaPorRuta(pathname);

  if (!pagina) {
    return null;
  }

  // Encontrar el módulo y tipo que contienen esta página
  let moduloActual = null;
  let tipoActual = null;

  for (const modulo of permisos) {
    for (const tipo of modulo.tipos) {
      if (tipo.paginas.some((p) => p.id === pagina.id)) {
        moduloActual = modulo;
        tipoActual = tipo;
        break;
      }
    }
    if (moduloActual) break;
  }

  if (!moduloActual || !tipoActual) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {/* Módulo */}
        <BreadcrumbItem>
          <BreadcrumbLink className="text-muted-foreground">
            {moduloActual.nombre}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {/* Tipo */}
        <BreadcrumbItem>
          <BreadcrumbLink className="text-muted-foreground">
            {tipoActual.nombre}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {/* Página actual */}
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">
            {pagina.nombre}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
