// lib/hooks/use-auth.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import type { ApiError } from "@/lib/types/api";

/**
 * Hook para configurar password inicial
 */
export function useSetupPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.setupPassword(token, password),
    onSuccess: (data) => {
      toast.success("Contraseña configurada", {
        description: data.message || "Ya puedes iniciar sesión",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al configurar contraseña", {
        description:
          error.response?.data?.message ||
          "El token puede haber expirado o ser inválido",
      });
    },
  });
}

/**
 * Hook para reenviar email de activación (admin)
 */
export function useReenviarActivacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => authApi.reenviarActivacion(email),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Email reenviado", {
        description:
          data.message || "Se ha enviado un nuevo email de activación",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al reenviar email", {
        description:
          error.response?.data?.message ||
          "No se pudo enviar el email de activación",
      });
    },
  });
}

/**
 * Hook para solicitar reset de contraseña
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (data) => {
      toast.success("Email enviado", {
        description:
          data.message || "Revisa tu correo para resetear tu contraseña",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al enviar email", {
        description:
          error.response?.data?.message ||
          "No se pudo enviar el email de recuperación",
      });
    },
  });
}

/**
 * Hook para resetear contraseña con token
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
      confirmNewPassword,
    }: {
      token: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => authApi.resetPassword(token, newPassword, confirmNewPassword),
    onSuccess: (data) => {
      toast.success("Contraseña actualizada", {
        description:
          data.message || "Ya puedes iniciar sesión con tu nueva contraseña",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al actualizar contraseña", {
        description:
          error.response?.data?.message ||
          "El token puede haber expirado o ser inválido",
      });
    },
  });
}

/**
 * Hook para cambiar contraseña (usuario logueado)
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
      confirmNewPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) =>
      authApi.changePassword(currentPassword, newPassword, confirmNewPassword),
    onSuccess: () => {
      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido cambiada correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al cambiar contraseña", {
        description:
          error.response?.data?.message ||
          "Verifica que tu contraseña actual sea correcta",
      });
    },
  });
}
