// ==========================================
// TIPOS PARA GESTIÓN DE USUARIOS
// ==========================================

export interface Usuario {
  id: number;
  email: string;
  fullName: string | null;
  codUserInv: string | null;
  isActive: string; // 'Y' | 'N'
  emailVerified: string; // 'Y' | 'N'
  role: string; // 'ADMIN' | 'USER'
  grupoId: number | null;
  grupoNombre?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrearUsuarioDto {
  email: string;
  fullName: string;
}

export interface ActualizarUsuarioDto {
  fullName?: string;
  codUserInv?: string;
  grupoId?: number;
  role?: string;
  isActive?: string;
}

export interface UsuariosResponse {
  data: Usuario[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UsuariosStats {
  TOTAL: number;
  ACTIVOS: number;
  INACTIVOS: number;
  VERIFICADOS: number;
  NO_VERIFICADOS: number;
  ADMIN: number;
  USER: number;
}

// ==========================================
// TIPOS PARA FILTROS
// ==========================================

export interface FiltrosUsuarios {
  search?: string;
  role?: string; // 'ADMIN' | 'USER'
  isActive?: string; // 'Y' | 'N'
  grupoId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string; // 'ASC' | 'DESC'
}

// ==========================================
// TIPOS PARA SECTORES
// ==========================================

export interface UsuarioSector {
  codUsuario: string;
  codEmpresa: string;
  codSector: string;
  porDefecto: string; // 'S' | 'N'
  empresaNombre?: string;
  sectorNombre?: string;
}

export interface AssignSectorDto {
  codEmpresa: string;
  codSector: string;
  porDefecto?: string; // 'S' | 'N'
}

export interface RemoveSectorDto {
  codEmpresa: string;
  codSector: string;
}

export interface UpdateSectorDefaultDto {
  codEmpresa: string;
  codSector: string;
}

// Agregar al final del archivo

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
