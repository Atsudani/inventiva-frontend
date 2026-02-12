// lib/types/modulos.ts

export interface Modulo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
  activo: string;
  createdAt: string;
  updatedAt: string;
}

export type ModuloSelect = Pick<Modulo, "id" | "nombre">;

export interface CrearModuloDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
}

export interface ActualizarModuloDto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
  activo?: string;
}
