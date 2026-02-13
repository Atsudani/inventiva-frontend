// lib/api/grupos.ts

import { api } from "../api";
import type {
  Grupo,
  GrupoSelect,
  CrearGrupoDto,
  ActualizarGrupoDto,
} from "../types/grupos";

export const gruposApi = {
  /**
   * Listar todos los grupos
   */
  listar: async (): Promise<Grupo[]> => {
    const response = await api.get("/grupos");
    return response.data;
  },

  /**
   * Listar grupos para select (solo id y nombre)
   */
  listarParaSelect: async (): Promise<GrupoSelect[]> => {
    const response = await api.get("/grupos/select");
    return response.data;
  },

  /**
   * Obtener un grupo por ID
   */
  obtenerPorId: async (id: number): Promise<Grupo> => {
    const response = await api.get(`/grupos/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo grupo
   */
  crear: async (datos: CrearGrupoDto): Promise<Grupo> => {
    const response = await api.post("/grupos", datos);
    return response.data;
  },

  /**
   * Actualizar un grupo
   */
  actualizar: async (id: number, datos: ActualizarGrupoDto): Promise<Grupo> => {
    const response = await api.put(`/grupos/${id}`, datos);
    return response.data;
  },

  /**
   * Eliminar un grupo (soft delete)
   */
  eliminar: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const response = await api.delete(`/grupos/${id}`);
    return response.data;
  },
};
