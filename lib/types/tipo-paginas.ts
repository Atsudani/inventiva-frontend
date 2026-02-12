// lib/types/tipo-paginas.ts

export interface TipoPagina {
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

export type TipoPaginaSelect = Pick<TipoPagina, "id" | "nombre">;

export interface CrearTipoPaginaDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
}

export interface ActualizarTipoPaginaDto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
  activo?: string;
}
