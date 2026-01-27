import { create } from "zustand";

export type UsuarioAuth = {
  id: number;
  email: string;
  nombre?: string;
};

type AuthState = {
  accessToken: string | null;
  usuario: UsuarioAuth | null;
  permisos: string[]; // ej: ["TES_MOVIMIENTOS", "COM_FACTURAS", ...]
  setAuth: (data: {
    accessToken: string;
    usuario: UsuarioAuth | null;
    permisos: string[];
  }) => void;
  clearAuth: () => void;
};

const TOKEN_KEY = "inventiva_access_token";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  usuario: null,
  permisos: [],

  setAuth: ({ accessToken, usuario, permisos }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, accessToken);
    }
    set({ accessToken, usuario, permisos });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ accessToken: null, usuario: null, permisos: [] });
  },
}));
