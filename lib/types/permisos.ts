export interface PermisosAccion {
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
}

export interface Pagina {
  id: number;
  codigo: string;
  nombre: string;
  ruta: string;
  icono: string | undefined;
  orden: number;
  permisos: PermisosAccion;
}

export interface Tipo {
  id: number;
  codigo: string;
  nombre: string;
  icono: string;
  orden: number;
  paginas: Pagina[];
}

export interface Modulo {
  id: number;
  codigo: string;
  nombre: string;
  icono: string;
  orden: number;
  tipos: Tipo[];
}

export type PermisosJerarquicos = Modulo[];
