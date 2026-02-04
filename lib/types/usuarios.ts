// ==========================================
// TIPOS PARA GESTIÓN DE USUARIOS
// ==========================================

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  role: string;
  grupo: string | null;
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso: string | null;

  // Para el estado de activación
  activado: boolean;
  tokenActivacion: string | null;
  tokenExpiracion: string | null;
}

export interface CrearUsuarioDto {
  email: string;
  nombre: string;
  role: string;
  grupo?: string | null;
}

export interface UsuarioListItem {
  id: number;
  email: string;
  nombre: string;
  role: string;
  grupo: string | null;
  activo: boolean;
  activado: boolean;
  fechaCreacion: string;
  ultimoAcceso: string | null;
}

export interface UsuariosResponse {
  usuarios: UsuarioListItem[];
  total: number;
  pagina: number;
  porPagina: number;
}

// ==========================================
// TIPOS PARA ACTIVACIÓN Y RECUPERACIÓN
// ==========================================

export interface ValidarTokenResponse {
  valido: boolean;
  email?: string;
  nombre?: string;
  mensaje?: string;
}

export interface SetearPasswordDto {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface CambiarPasswordDto {
  passwordActual: string;
  passwordNuevo: string;
  passwordConfirm: string;
}

export interface SolicitarResetPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  passwordConfirm: string;
}

// ==========================================
// TIPOS PARA FILTROS Y PAGINACIÓN
// ==========================================

export interface FiltrosUsuarios {
  search?: string;
  role?: string;
  activo?: boolean;
  activado?: boolean;
  pagina?: number;
  porPagina?: number;
}
