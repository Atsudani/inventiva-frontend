// lib/types/grupos.ts

export interface Grupo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  activo: string;
  createdAt: string;
  updatedAt: string;
}

export type GrupoSelect = Pick<Grupo, "id" | "nombre">;

export interface CrearGrupoDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
}

export interface ActualizarGrupoDto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  activo?: string;
}
