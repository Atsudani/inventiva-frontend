// lib/api/permisos-grupos.ts

import { api } from "../api";
import type {
  PermisoGrupoPagina,
  ActualizarPermisosGrupoDto,
} from "../types/permisos-grupos";

export const permisosGruposApi = {
  /**
   * Obtener permisos de un grupo para todas las páginas
   */
  obtenerPorGrupo: async (grupoId: number): Promise<PermisoGrupoPagina[]> => {
    const response = await api.get(`/permisos-grupos/${grupoId}`);
    return response.data;
  },

  /**
   * Actualizar permisos de un grupo
   */
  actualizar: async (
    grupoId: number,
    datos: ActualizarPermisosGrupoDto,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.put(`/permisos-grupos/${grupoId}`, datos);
    return response.data;
  },
};
