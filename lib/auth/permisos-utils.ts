import { Pagina, PermisosJerarquicos } from "@/lib/types/permisos";

export type AccionPermiso = "ver" | "crear" | "editar" | "eliminar";

export type PermisosAcciones = Record<AccionPermiso, boolean>;

export type PermisosIndexados = Record<string, PermisosAcciones>;
export type PaginasIndexadas = Record<string, Pagina>;

export function construirIndices(permisos: PermisosJerarquicos): {
  permisosPorRuta: PermisosIndexados;
  paginaPorRuta: PaginasIndexadas;
} {
  const permisosPorRuta: PermisosIndexados = {};
  const paginaPorRuta: PaginasIndexadas = {};

  for (const modulo of permisos) {
    for (const tipo of modulo.tipos) {
      for (const pagina of tipo.paginas) {
        paginaPorRuta[pagina.ruta] = pagina;

        permisosPorRuta[pagina.ruta] = {
          ver: !!pagina.permisos.ver,
          crear: !!pagina.permisos.crear,
          editar: !!pagina.permisos.editar,
          eliminar: !!pagina.permisos.eliminar,
        };
      }
    }
  }

  return { permisosPorRuta, paginaPorRuta };
}
