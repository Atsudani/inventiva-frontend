// lib/api/paginas.ts

import { api } from "../api";
import type {
  Pagina,
  CrearPaginaDto,
  ActualizarPaginaDto,
} from "../types/paginas";

export const paginasApi = {
  /**
   * Listar todas las páginas
   */
  listar: async (): Promise<Pagina[]> => {
    const response = await api.get("/paginas");
    return response.data;
  },

  /**
   * Obtener una página por ID
   */
  obtenerPorId: async (id: number): Promise<Pagina> => {
    const response = await api.get(`/paginas/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva página
   */
  crear: async (datos: CrearPaginaDto): Promise<Pagina> => {
    const response = await api.post("/paginas", datos);
    return response.data;
  },

  /**
   * Actualizar una página
   */
  actualizar: async (
    id: number,
    datos: ActualizarPaginaDto,
  ): Promise<Pagina> => {
    const response = await api.put(`/paginas/${id}`, datos);
    return response.data;
  },

  /**
   * Eliminar una página (soft delete)
   */
  eliminar: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const response = await api.delete(`/paginas/${id}`);
    return response.data;
  },
};
