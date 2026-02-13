// lib/types/permisos-grupos.ts

export interface PermisoGrupoPagina {
  id: number;
  grupoId: number;
  paginaId: number;
  puedeVer: string;
  puedeCrear: string;
  puedeEditar: string;
  puedeEliminar: string;
  createdAt: string;
  // Datos de relaciones
  paginaNombre?: string;
  paginaCodigo?: string;
  paginaRuta?: string;
  moduloNombre?: string;
  tipoNombre?: string;
}

export interface ActualizarPermisosGrupoDto {
  permisos: Array<{
    paginaId: number;
    puedeVer: string;
    puedeCrear: string;
    puedeEditar: string;
    puedeEliminar: string;
  }>;
}
