import { api } from "../api";
import type {
  Usuario,
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  UsuariosResponse,
  UsuariosStats,
  FiltrosUsuarios,
  UsuarioSector,
  AssignSectorDto,
  RemoveSectorDto,
  UpdateSectorDefaultDto,
} from "../types/usuarios";

// ==========================================
// ADMIN - GESTIÓN DE USUARIOS
// ==========================================

export const usuariosApi = {
  /**
   * Listar usuarios con filtros y paginación
   */
  listar: async (filtros?: FiltrosUsuarios): Promise<UsuariosResponse> => {
    const params = new URLSearchParams();

    if (filtros?.search) params.append("search", filtros.search);
    if (filtros?.role) params.append("role", filtros.role);
    if (filtros?.isActive) params.append("isActive", filtros.isActive);
    if (filtros?.grupoId) params.append("grupoId", String(filtros.grupoId));
    if (filtros?.page) params.append("page", String(filtros.page));
    if (filtros?.pageSize) params.append("pageSize", String(filtros.pageSize));
    if (filtros?.sortBy) params.append("sortBy", filtros.sortBy);
    if (filtros?.sortOrder) params.append("sortOrder", filtros.sortOrder);

    const response = await api.get(`/usuarios?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtener estadísticas de usuarios
   */
  obtenerStats: async (): Promise<UsuariosStats> => {
    const response = await api.get("/usuarios/stats");
    return response.data;
  },

  /**
   * Obtener un usuario por ID
   */
  obtenerPorId: async (id: number): Promise<Usuario> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  /**
   * Actualizar un usuario
   */
  actualizar: async (
    id: number,
    datos: ActualizarUsuarioDto,
  ): Promise<Usuario> => {
    const response = await api.put(`/usuarios/${id}`, datos);
    return response.data;
  },

  /**
   * Eliminar un usuario (soft delete)
   */
  eliminar: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  // ==========================================
  // GESTIÓN DE SECTORES
  // ==========================================

  /**
   * Obtener sectores de un usuario
   */
  obtenerSectores: async (id: number): Promise<UsuarioSector[]> => {
    const response = await api.get(`/usuarios/${id}/sectores`);
    return response.data;
  },

  /**
   * Asignar sector a un usuario
   */
  asignarSector: async (
    id: number,
    datos: AssignSectorDto,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.post(`/usuarios/${id}/sectores`, datos);
    return response.data;
  },

  /**
   * Remover sector de un usuario
   */
  removerSector: async (
    id: number,
    datos: RemoveSectorDto,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.delete(`/usuarios/${id}/sectores`, {
      data: datos,
    });
    return response.data;
  },

  /**
   * Establecer sector por defecto
   */
  setSectorDefault: async (
    id: number,
    datos: UpdateSectorDefaultDto,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.patch(`/usuarios/${id}/sectores/default`, datos);
    return response.data;
  },

  /**
   * Activar/Desactivar usuario (toggle)
   */
  toggleActive: async (id: number): Promise<Usuario> => {
    const response = await api.put(`/usuarios/${id}/toggle-active`);
    return response.data;
  },
};
