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
    email: string,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.post("/auth/admin/resend-setup", {
      email,
    });
    return response.data;
  },

  /**
   * Solicitar reset de contraseña (forgot password)
   */
  forgotPassword: async (
    email: string,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  /**
   * Resetear contraseña con token
   */
  resetPassword: async (
    token: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<{ ok: boolean; message: string }> => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
      confirmNewPassword,
    });
    return response.data;
  },

  /**
   * Cambiar contraseña (usuario logueado)
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<{ ok: boolean }> => {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    return response.data;
  },
};
