// lib/api/modulos.ts

import { api } from "../api";
import type {
  Modulo,
  ModuloSelect,
  CrearModuloDto,
  ActualizarModuloDto,
} from "../types/modulos";

export const modulosApi = {
  /**
   * Listar todos los módulos
   */
  listar: async (): Promise<Modulo[]> => {
    const response = await api.get("/modulos");
    return response.data;
  },

  /**
   * Listar módulos para select (solo id y nombre)
   */
  listarParaSelect: async (): Promise<ModuloSelect[]> => {
    const response = await api.get("/modulos/select");
    return response.data;
  },

  /**
   * Obtener un módulo por ID
   */
  obtenerPorId: async (id: number): Promise<Modulo> => {
    const response = await api.get(`/modulos/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo módulo
   */
  crear: async (datos: CrearModuloDto): Promise<Modulo> => {
    const response = await api.post("/modulos", datos);
    return response.data;
  },

  /**
   * Actualizar un módulo
   */
  actualizar: async (
    id: number,
    datos: ActualizarModuloDto,
  ): Promise<Modulo> => {
    const response = await api.put(`/modulos/${id}`, datos);
    return response.data;
  },

  /**
   * Eliminar un módulo (soft delete)
   */
  eliminar: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const response = await api.delete(`/modulos/${id}`);
    return response.data;
  },
};
