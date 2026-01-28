import { create } from "zustand";

export type UsuarioAuth = {
  id: number;
  email: string;
  nombre: string;
  role: string;
};

type AuthState = {
  usuario: UsuarioAuth | null;
  permisos: string[];
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (data: { usuario: UsuarioAuth; permisos: string[] }) => void;

  clearAuth: () => void;

  setLoading: (loading: boolean) => void;

  hasPermission: (permiso: string) => boolean;
  hasAnyPermission: (permisos: string[]) => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,
  permisos: [],
  isAuthenticated: false,
  isLoading: true,

  setAuth: ({ usuario, permisos }) => {
    set({
      usuario,
      permisos,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    set({
      usuario: null,
      permisos: [],
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  hasPermission: (permiso: string) => {
    return get().permisos.includes(permiso);
  },

  hasAnyPermission: (permisos: string[]) => {
    const userPermisos = get().permisos;
    return permisos.some((p) => userPermisos.includes(p));
  },
}));
