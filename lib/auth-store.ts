import { create } from "zustand";
import { Pagina, PermisosJerarquicos } from "./types/permisos";

export type UsuarioAuth = {
  id: number;
  email: string;
  nombre: string;
  role: string;
  grupo: string | null;
};

type AuthState = {
  usuario: UsuarioAuth | null;
  permisos: PermisosJerarquicos;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (data: {
    usuario: UsuarioAuth;
    permisos: PermisosJerarquicos;
  }) => void;

  clearAuth: () => void;

  setLoading: (loading: boolean) => void;

  // Helpers para verificar permisos
  tienePermisoRuta: (ruta: string) => boolean;
  tienePermisoAccion: (
    ruta: string,
    accion: "ver" | "crear" | "editar" | "eliminar",
  ) => boolean;
  obtenerPaginaPorRuta: (ruta: string) => Pagina | null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,
  permisos: [],
  isAuthenticated: false,
  isLoading: true,

  setAuth: ({ usuario, permisos }) => {
    set({
      usuario,
      permisos,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    set({
      usuario: null,
      permisos: [],
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Verificar si el usuario tiene permiso para ver una ruta
  tienePermisoRuta: (ruta: string) => {
    const { permisos } = get();

    for (const modulo of permisos) {
      for (const tipo of modulo.tipos) {
        for (const pagina of tipo.paginas) {
          if (pagina.ruta === ruta) {
            return pagina.permisos.ver;
          }
        }
      }
    }

    return false;
  },

  // Verificar si el usuario tiene un permiso específico (crear, editar, eliminar)
  tienePermisoAccion: (
    ruta: string,
    accion: "ver" | "crear" | "editar" | "eliminar",
  ) => {
    const { permisos } = get();

    for (const modulo of permisos) {
      for (const tipo of modulo.tipos) {
        for (const pagina of tipo.paginas) {
          if (pagina.ruta === ruta) {
            return pagina.permisos[accion];
          }
        }
      }
    }

    return false;
  },

  // Obtener página completa por ruta
  obtenerPaginaPorRuta: (ruta: string) => {
    const { permisos } = get();

    for (const modulo of permisos) {
      for (const tipo of modulo.tipos) {
        for (const pagina of tipo.paginas) {
          if (pagina.ruta === ruta) {
            return pagina;
          }
        }
      }
    }

    return null;
  },
}));

// ============================================
// EJEMPLO DE USO EN COMPONENTES
// ============================================

/*
 En un componente cualquiera:

import { useAuthStore } from "@/lib/auth-store";

function FacturacionPage() {
  const tienePermisoCrear = useAuthStore(s => 
    s.tienePermisoAccion('/ventas/movimientos/facturacion', 'crear')
  );
  
  const tienePermisoEliminar = useAuthStore(s => 
    s.tienePermisoAccion('/ventas/movimientos/facturacion', 'eliminar')
  );

  return (
    <div>
      <h1>Facturación</h1>
      
      {tienePermisoCrear && (
        <Button>Nueva Factura</Button>
      )}
      
      <Table>
        {facturas.map(factura => (
          <Row key={factura.id}>
            <td>{factura.numero}</td>
            <td>
              <Button>Ver</Button>
              {tienePermisoEliminar && (
                <Button variant="destructive">Eliminar</Button>
              )}
            </td>
          </Row>
        ))}
      </Table>
    </div>
  );
}
*/
