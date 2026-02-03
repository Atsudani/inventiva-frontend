// ============================================
// MEJORAS MENORES A TU IMPLEMENTACIÓN
// lib/auth/permisos-utils.ts
// ============================================

import { Pagina, PermisosJerarquicos } from "@/lib/types/permisos";

export type AccionPermiso = "ver" | "crear" | "editar" | "eliminar";

export type PermisosAcciones = Record<AccionPermiso, boolean>;

export type PermisosIndexados = Record<string, PermisosAcciones>;
export type PaginasIndexadas = Record<string, Pagina>;

/**
 * Construir índices de permisos y páginas para lookup O(1)
 * Se ejecuta una vez al login
 */
export function construirIndices(permisos: PermisosJerarquicos): {
  permisosPorRuta: PermisosIndexados;
  paginaPorRuta: PaginasIndexadas;
} {
  const permisosPorRuta: PermisosIndexados = {};
  const paginaPorRuta: PaginasIndexadas = {};

  for (const modulo of permisos) {
    for (const tipo of modulo.tipos) {
      for (const pagina of tipo.paginas) {
        // Guardar página completa
        paginaPorRuta[pagina.ruta] = pagina;

        // Guardar permisos (doble negación para asegurar boolean)
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

// ============================================
// MEJORA OPCIONAL: Función helper adicional
// ============================================

/**
 * Verificar si una ruta existe en los permisos
 * Útil para debugging o validaciones
 */
export function rutaExiste(
  paginaPorRuta: PaginasIndexadas,
  ruta: string,
): boolean {
  return ruta in paginaPorRuta;
}

/**
 * Obtener todas las rutas disponibles
 * Útil para generar sitemap o navegación
 */
export function obtenerRutasDisponibles(
  permisosPorRuta: PermisosIndexados,
): string[] {
  return Object.keys(permisosPorRuta);
}

/**
 * Obtener rutas con un permiso específico
 * Ejemplo: todas las páginas donde puede crear
 */
export function obtenerRutasConPermiso(
  permisosPorRuta: PermisosIndexados,
  accion: AccionPermiso,
): string[] {
  return Object.entries(permisosPorRuta)
    .filter(([_, permisos]) => permisos[accion])
    .map(([ruta]) => ruta);
}

// ============================================
// MEJORA: Agregar logs en desarrollo
// ============================================

export function construirIndicesConLog(permisos: PermisosJerarquicos) {
  const inicio = performance.now();
  const indices = construirIndices(permisos);
  const fin = performance.now();

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Índices de permisos construidos:", {
      totalRutas: Object.keys(indices.paginaPorRuta).length,
      tiempoMs: (fin - inicio).toFixed(2),
      rutas: Object.keys(indices.paginaPorRuta),
    });
  }

  return indices;
}

// ============================================
// MEJORA: Validación de integridad
// ============================================

/**
 * Verificar que no haya rutas duplicadas
 * Útil en desarrollo para detectar errores
 */
export function validarIntegridadPermisos(permisos: PermisosJerarquicos): {
  valido: boolean;
  duplicados: string[];
} {
  const rutasVistas = new Set<string>();
  const duplicados: string[] = [];

  for (const modulo of permisos) {
    for (const tipo of modulo.tipos) {
      for (const pagina of tipo.paginas) {
        if (rutasVistas.has(pagina.ruta)) {
          duplicados.push(pagina.ruta);
        }
        rutasVistas.add(pagina.ruta);
      }
    }
  }

  if (duplicados.length > 0) {
    console.error("⚠️ Rutas duplicadas encontradas:", duplicados);
  }

  return {
    valido: duplicados.length === 0,
    duplicados,
  };
}

// ============================================
// TESTING: Función para tests
// ============================================

/**
 * Crear permisos mock para testing
 */
export function crearPermisosMock(): PermisosJerarquicos {
  return [
    {
      id: 1,
      codigo: "VENTAS",
      nombre: "Ventas",
      icono: "shopping-bag",
      orden: 1,
      tipos: [
        {
          id: 1,
          codigo: "MOVIMIENTOS",
          nombre: "Movimientos",
          icono: "folder",
          orden: 1,
          paginas: [
            {
              id: 1,
              codigo: "VENTAS_MOV_FACTURACION",
              nombre: "Facturación",
              ruta: "/ventas/movimientos/facturacion",
              icono: "file-text",
              orden: 1,
              permisos: {
                ver: true,
                crear: true,
                editar: true,
                eliminar: false,
              },
            },
          ],
        },
      ],
    },
  ];
}
