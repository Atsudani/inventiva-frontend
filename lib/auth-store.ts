import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pagina, PermisosJerarquicos } from "./types/permisos";
import {
  AccionPermiso,
  construirIndices,
  PaginasIndexadas,
  PermisosIndexados,
} from "./auth/permisos-utils";

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

  // Indices para búsqueda rápida
  permisosPorRuta: PermisosIndexados;
  paginaPorRuta: PaginasIndexadas;

  isAuthenticated: boolean;
  isLoading: boolean;

  // Flag para saber si ya se hidrataron los datos de localStorage
  _hasHydrated: boolean;

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

  setHasHydrated: (state: boolean) => void;

  // Cambiar sector (sin re-login)
  cambiarSector: (codSector: string) => void;

  // Helpers para verificar permisos
  tienePermisoRuta: (ruta: string) => boolean;
  tienePermisoAccion: (ruta: string, accion: AccionPermiso) => boolean;
  obtenerPaginaPorRuta: (ruta: string) => Pagina | null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      contextoOperativo: null,
      permisos: [],
      isAuthenticated: false,
      isLoading: true,

      permisosPorRuta: {},
      paginaPorRuta: {},

      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      setAuth: ({
        usuario,
        empresa,
        sector,
        sucursal,
        sectoresDisponibles,
        permisos,
      }) => {
        const { permisosPorRuta, paginaPorRuta } = construirIndices(permisos);
        set({
          usuario,
          contextoOperativo: {
            empresa,
            sector,
            sucursal,
            sectoresDisponibles,
          },
          permisos,
          permisosPorRuta,
          paginaPorRuta,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearAuth: () => {
        set({
          usuario: null,
          contextoOperativo: null,
          permisos: [],
          permisosPorRuta: {},
          paginaPorRuta: {},
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

      tienePermisoRuta: (ruta: string) => {
        const { permisosPorRuta } = get();
        return permisosPorRuta[ruta]?.ver ?? false;
      },

      tienePermisoAccion: (ruta: string, accion: AccionPermiso) => {
        const { permisosPorRuta } = get();
        return permisosPorRuta[ruta]?.[accion] ?? false;
      },

      obtenerPaginaPorRuta: (ruta: string) => {
        const { paginaPorRuta } = get();
        return paginaPorRuta[ruta] ?? null;
      },
    }),
    {
      name: "inventiva-auth", // nombre de la key en localStorage

      // Solo persistir estos campos (no isLoading, _hasHydrated, ni las funciones)
      partialize: (state) => ({
        usuario: state.usuario,
        contextoOperativo: state.contextoOperativo,
        permisos: state.permisos,
        permisosPorRuta: state.permisosPorRuta,
        paginaPorRuta: state.paginaPorRuta,
        isAuthenticated: state.isAuthenticated,
      }),

      // Callback cuando termina de hidratar desde localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

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
