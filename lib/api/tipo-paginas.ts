// lib/api/tipo-paginas.ts

import { api } from "../api";
import type {
  TipoPagina,
  TipoPaginaSelect,
  CrearTipoPaginaDto,
  ActualizarTipoPaginaDto,
} from "../types/tipo-paginas";

export const tipoPaginasApi = {
  /**
   * Listar todos los tipos de páginas
   */
  listar: async (): Promise<TipoPagina[]> => {
    const response = await api.get("/tipo-paginas");
    return response.data;
  },

  /**
   * Listar tipos de páginas para select (solo id y nombre)
   */
  listarParaSelect: async (): Promise<TipoPaginaSelect[]> => {
    const response = await api.get("/tipo-paginas/select");
    return response.data;
  },

  /**
   * Obtener un tipo de página por ID
   */
  obtenerPorId: async (id: number): Promise<TipoPagina> => {
    const response = await api.get(`/tipo-paginas/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo tipo de página
   */
  crear: async (datos: CrearTipoPaginaDto): Promise<TipoPagina> => {
    const response = await api.post("/tipo-paginas", datos);
    return response.data;
  },

  /**
   * Actualizar un tipo de página
   */
  actualizar: async (
    id: number,
    datos: ActualizarTipoPaginaDto,
  ): Promise<TipoPagina> => {
    const response = await api.put(`/tipo-paginas/${id}`, datos);
    return response.data;
  },

  /**
   * Eliminar un tipo de página (soft delete)
   */
  eliminar: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const response = await api.delete(`/tipo-paginas/${id}`);
    return response.data;
  },
};
