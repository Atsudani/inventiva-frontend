import { api } from "../api";
import type {
  Usuario,
  CrearUsuarioDto,
  UsuariosResponse,
  FiltrosUsuarios,
  ValidarTokenResponse,
  SetearPasswordDto,
  CambiarPasswordDto,
  SolicitarResetPasswordDto,
  ResetPasswordDto,
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
    if (filtros?.activo !== undefined)
      params.append("activo", String(filtros.activo));
    if (filtros?.activado !== undefined)
      params.append("activado", String(filtros.activado));
    if (filtros?.pagina) params.append("pagina", String(filtros.pagina));
    if (filtros?.porPagina)
      params.append("porPagina", String(filtros.porPagina));

    const response = await api.get(`/usuarios?${params.toString()}`);
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
   * Crear un nuevo usuario
   * El backend generará el token de activación y lo enviará por email (a implementar después)
   */
  crear: async (datos: CrearUsuarioDto): Promise<Usuario> => {
    const response = await api.post("/usuarios", datos);
    return response.data;
  },

  /**
   * Reenviar link de activación a un usuario
   */
  reenviarActivacion: async (
    usuarioId: number,
  ): Promise<{ mensaje: string }> => {
    const response = await api.post(
      `/usuarios/${usuarioId}/reenviar-activacion`,
    );
    return response.data;
  },

  /**
   * Activar/Desactivar un usuario (solo admin)
   */
  toggleActivo: async (usuarioId: number): Promise<Usuario> => {
    const response = await api.patch(`/usuarios/${usuarioId}/toggle-activo`);
    return response.data;
  },

  /**
   * Eliminar un usuario (soft delete)
   */
  eliminar: async (usuarioId: number): Promise<{ mensaje: string }> => {
    const response = await api.delete(`/usuarios/${usuarioId}`);
    return response.data;
  },
};

// ==========================================
// ACTIVACIÓN DE CUENTA
// ==========================================

export const activacionApi = {
  /**
   * Validar si un token de activación es válido
   */
  validarToken: async (token: string): Promise<ValidarTokenResponse> => {
    const response = await api.get(`/auth/activacion/validar/${token}`);
    return response.data;
  },

  /**
   * Activar cuenta y setear contraseña inicial
   */
  activarCuenta: async (
    datos: SetearPasswordDto,
  ): Promise<{ mensaje: string }> => {
    const response = await api.post("/auth/activacion/activar", datos);
    return response.data;
  },
};

// ==========================================
// CAMBIO DE CONTRASEÑA (USUARIO LOGUEADO)
// ==========================================

export const passwordApi = {
  /**
   * Cambiar contraseña del usuario logueado
   */
  cambiar: async (datos: CambiarPasswordDto): Promise<{ mensaje: string }> => {
    const response = await api.post("/auth/cambiar-password", datos);
    return response.data;
  },
};

// ==========================================
// RECUPERACIÓN DE CONTRASEÑA
// ==========================================

export const recuperacionApi = {
  /**
   * Solicitar reset de contraseña (envía email con token)
   */
  solicitar: async (
    datos: SolicitarResetPasswordDto,
  ): Promise<{ mensaje: string }> => {
    const response = await api.post("/auth/recuperacion/solicitar", datos);
    return response.data;
  },

  /**
   * Validar token de recuperación
   */
  validarToken: async (token: string): Promise<ValidarTokenResponse> => {
    const response = await api.get(`/auth/recuperacion/validar/${token}`);
    return response.data;
  },

  /**
   * Resetear contraseña con token
   */
  resetear: async (datos: ResetPasswordDto): Promise<{ mensaje: string }> => {
    const response = await api.post("/auth/recuperacion/resetear", datos);
    return response.data;
  },
};
