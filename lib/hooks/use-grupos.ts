// lib/hooks/use-grupos.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gruposApi } from "@/lib/api/grupos";
import { toast } from "sonner";
import type { ApiError } from "@/lib/types/api";
import type { CrearGrupoDto, ActualizarGrupoDto } from "@/lib/types/grupos";

/**
 * Hook para listar grupos
 */
export function useGrupos() {
  return useQuery({
    queryKey: ["grupos"],
    queryFn: () => gruposApi.listar(),
  });
}

/**
 * Hook para obtener grupos para select
 */
export function useGruposSelect() {
  return useQuery({
    queryKey: ["grupos", "select"],
    queryFn: () => gruposApi.listarParaSelect(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener un grupo por ID
 */
export function useGrupo(id: number) {
  return useQuery({
    queryKey: ["grupo", id],
    queryFn: () => gruposApi.obtenerPorId(id),
    enabled: !!id,
  });
}

/**
 * Hook para crear grupo
 */
export function useCrearGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearGrupoDto) => gruposApi.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      toast.success("Grupo creado", {
        description: "El grupo ha sido creado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al crear grupo", {
        description:
          error.response?.data?.message || "No se pudo crear el grupo",
      });
    },
  });
}

/**
 * Hook para actualizar grupo
 */
export function useActualizarGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: ActualizarGrupoDto }) =>
      gruposApi.actualizar(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["grupo"] });
      toast.success("Grupo actualizado", {
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al actualizar grupo", {
        description:
          error.response?.data?.message || "No se pudo actualizar el grupo",
      });
    },
  });
}

/**
 * Hook para eliminar grupo (soft delete)
 */
export function useEliminarGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (grupoId: number) => gruposApi.eliminar(grupoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["grupo"] });
      toast.success("Grupo eliminado", {
        description: "El grupo ha sido eliminado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al eliminar grupo", {
        description:
          error.response?.data?.message || "No se pudo eliminar el grupo",
      });
    },
  });
}

/**
 * Hook para toggle activo/inactivo
 */
export function useToggleActivoGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: string }) =>
      gruposApi.actualizar(id, { activo: activo === "S" ? "N" : "S" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["grupo"] });
      toast.success("Grupo actualizado", {
        description: "El estado del grupo ha sido actualizado",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error", {
        description:
          error.response?.data?.message || "No se pudo actualizar el grupo",
      });
    },
  });
}
