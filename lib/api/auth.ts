// lib/api/auth.ts

import { api } from "../api";

export const authApi = {
  /**
   * Configurar contraseña inicial con token
   */
  setupPassword: async (
    token: string,
    password: string,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.post("/auth/set-password", {
      token,
      newPassword: password,
    });
    return response.data;
  },

  /**
   * Reenviar email de activación (admin)
   */
  reenviarActivacion: async (
    userId: number,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.post("/auth/admin/resend-setup", {
      userId,
    });
    return response.data;
  },
};
