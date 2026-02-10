import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuariosApi } from "@/lib/api/usuarios";
import type {
  FiltrosUsuarios,
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  Usuario,
  UsuariosResponse,
} from "@/lib/types/usuarios";
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
    queryKey: ["usuario", id],
    queryFn: () => usuariosApi.obtenerPorId(id),
    enabled: !!id,
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

// /**
//  * Hook para toggle activo/inactivo
//  */
// export function useToggleActivo() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (usuarioId: number) => usuariosApi.toggleActive(usuarioId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["usuarios"] });
//       queryClient.invalidateQueries({ queryKey: ["usuario"] });
//       toast.success("Usuario actualizado", {
//         description: "El estado del usuario ha sido actualizado",
//       });
//     },
//     onError: (error: ApiError) => {
//       toast.error("Error", {
//         description:
//           error.response?.data?.message || "No se pudo actualizar el usuario",
//       });
//     },
//   });
// }

/**
 * Hook para toggle activo/inactivo
 */
export function useToggleActivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (usuarioId: number) => usuariosApi.toggleActive(usuarioId),
    onSuccess: (data, usuarioId) => {
      // Actualizar cache de la lista
      queryClient.setQueryData<UsuariosResponse>(["usuarios"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((u) =>
            u.id === usuarioId
              ? { ...u, isActive: u.isActive === "Y" ? "N" : "Y" }
              : u,
          ),
        };
      });

      // Actualizar cache del usuario individual
      queryClient.setQueryData<Usuario>(["usuario", usuarioId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isActive: old.isActive === "Y" ? "N" : "Y",
        };
      });

      // Invalidar para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", usuarioId] });

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
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
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

/**
 * Hook para actualizar usuario
 */
export function useActualizarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: ActualizarUsuarioDto }) =>
      usuariosApi.actualizar(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      toast.success("Usuario actualizado", {
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al actualizar usuario", {
        description:
          error.response?.data?.message || "No se pudo actualizar el usuario",
      });
    },
  });
}
