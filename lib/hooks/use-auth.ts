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
    mutationFn: (userId: number) => authApi.reenviarActivacion(userId),
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
