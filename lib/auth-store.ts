import { create } from "zustand";
import { Pagina, PermisosJerarquicos } from "./types/permisos";

export type UsuarioAuth = {
  id: number;
  email: string;
  nombre: string;
  role: string;
  grupo: string | null;
};

export type Empresa = {
  codigo: string;
  nombre: string;
  nombreCorto: string;
  ruc: string;
};

export type Sector = {
  codigo: string;
  nombre: string;
  abreviatura: string;
  porDefecto: boolean;
};

export type Sucursal = {
  codigo: string;
  nombre: string;
  esMatriz: boolean;
};

export type SectorDisponible = {
  codEmpresa: string;
  codSector: string;
  nombre: string;
  abreviatura: string;
  porDefecto: boolean;
  sucursal: Sucursal;
};

export type ContextoOperativo = {
  empresa: Empresa;
  sector: Sector;
  sucursal: Sucursal;
  sectoresDisponibles: SectorDisponible[];
};

type AuthState = {
  usuario: UsuarioAuth | null;
  contextoOperativo: ContextoOperativo | null;
  permisos: PermisosJerarquicos;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (data: {
    usuario: UsuarioAuth;
    empresa: Empresa;
    sector: Sector;
    sucursal: Sucursal;
    sectoresDisponibles: SectorDisponible[];
    permisos: PermisosJerarquicos;
  }) => void;

  clearAuth: () => void;

  setLoading: (loading: boolean) => void;

  //Cambiar sector (sin re-login)
  cambiarSector: (codSector: string) => void;

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
  contextoOperativo: null,
  permisos: [],
  isAuthenticated: false,
  isLoading: true,

  setAuth: ({
    usuario,
    empresa,
    sector,
    sucursal,
    sectoresDisponibles,
    permisos,
  }) => {
    set({
      usuario,
      contextoOperativo: {
        empresa,
        sector,
        sucursal,
        sectoresDisponibles,
      },
      permisos,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    set({
      usuario: null,
      contextoOperativo: null,
      permisos: [],
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  cambiarSector: (codSector: string) => {
    const { contextoOperativo } = get();
    if (!contextoOperativo) return;

    const nuevoSector = contextoOperativo.sectoresDisponibles.find(
      (s) => s.codSector === codSector,
    );

    if (!nuevoSector) return;

    set({
      contextoOperativo: {
        ...contextoOperativo,
        sector: {
          codigo: nuevoSector.codSector,
          nombre: nuevoSector.nombre,
          abreviatura: nuevoSector.abreviatura,
          porDefecto: nuevoSector.porDefecto,
        },
        sucursal: nuevoSector.sucursal,
      },
    });
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
