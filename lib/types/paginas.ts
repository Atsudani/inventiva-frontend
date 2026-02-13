// lib/types/paginas.ts

export interface Pagina {
  id: number;
  moduloId: number;
  tipoId: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  ruta: string;
  icono: string | null;
  orden: number;
  activo: string;
  createdAt: string;
  updatedAt: string;
  // Datos de relaciones
  moduloNombre?: string;
  tipoNombre?: string;
}

export interface CrearPaginaDto {
  moduloId: number;
  tipoId: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  ruta: string;
  icono?: string;
  orden?: number;
}

export interface ActualizarPaginaDto {
  moduloId?: number;
  tipoId?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  ruta?: string;
  icono?: string;
  orden?: number;
  activo?: string;
}
