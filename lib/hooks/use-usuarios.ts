import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuariosApi } from "@/lib/api/usuarios";
import type { FiltrosUsuarios, CrearUsuarioDto } from "@/lib/types/usuarios";
import { toast } from "sonner";
import type { ApiError } from "@/lib/types/api";

// ==========================================
// QUERIES (Lectura)
// ==========================================

/**
 * Hook para listar usuarios con filtros
 */
export function useUsuarios(filtros?: FiltrosUsuarios) {
  return useQuery({
    queryKey: ["usuarios", filtros],
    queryFn: () => usuariosApi.listar(filtros),
  });
}

/**
 * Hook para obtener un usuario por ID
 */
export function useUsuario(id: number) {
  return useQuery({
    queryKey: ["usuarios", id],
    queryFn: () => usuariosApi.obtenerPorId(id),
    enabled: !!id, // Solo ejecutar si hay ID
  });
}

// ==========================================
// MUTATIONS (Escritura)
// ==========================================

/**
 * Hook para crear un nuevo usuario
 */
export function useCrearUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearUsuarioDto) => usuariosApi.crear(datos),
    onSuccess: () => {
      // Invalidar la lista de usuarios para que se recargue
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario creado", {
        description: "El usuario ha sido creado exitosamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al crear usuario", {
        description:
          error.response?.data?.message || "No se pudo crear el usuario",
      });
    },
  });
}

/**
 * Hook para reenviar link de activación
 */
export function useReenviarActivacion() {
  return useMutation({
    mutationFn: (usuarioId: number) =>
      usuariosApi.reenviarActivacion(usuarioId),
    onSuccess: () => {
      toast.success("Link enviado", {
        description: "Se reenvió el link de activación",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "No se pudo reenviar el link",
      });
    },
  });
}

/**
 * Hook para toggle activo/inactivo
 */
export function useToggleActivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (usuarioId: number) => usuariosApi.toggleActive(usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario actualizado", {
        description: "El estado del usuario ha sido actualizado",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error", {
        description:
          error.response?.data?.message || "No se pudo actualizar el usuario",
      });
    },
  });
}

/**
 * Hook para eliminar usuario (soft delete)
 */
export function useEliminarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (usuarioId: number) => usuariosApi.eliminar(usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario eliminado", {
        description: "El usuario ha sido desactivado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al eliminar usuario", {
        description:
          error.response?.data?.message || "No se pudo eliminar el usuario",
      });
    },
  });
}
