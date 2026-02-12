// lib/hooks/use-modulos.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modulosApi } from "@/lib/api/modulos";
import { toast } from "sonner";
import type { ApiError } from "@/lib/types/api";
import type { CrearModuloDto, ActualizarModuloDto } from "@/lib/types/modulos";

/**
 * Hook para listar módulos
 */
export function useModulos() {
  return useQuery({
    queryKey: ["modulos"],
    queryFn: () => modulosApi.listar(),
  });
}

/**
 * Hook para obtener módulos para select
 */
export function useModulosSelect() {
  return useQuery({
    queryKey: ["modulos", "select"],
    queryFn: () => modulosApi.listarParaSelect(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener un módulo por ID
 */
export function useModulo(id: number) {
  return useQuery({
    queryKey: ["modulo", id],
    queryFn: () => modulosApi.obtenerPorId(id),
    enabled: !!id,
  });
}

/**
 * Hook para crear módulo
 */
export function useCrearModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearModuloDto) => modulosApi.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
      toast.success("Módulo creado", {
        description: "El módulo ha sido creado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al crear módulo", {
        description:
          error.response?.data?.message || "No se pudo crear el módulo",
      });
    },
  });
}

/**
 * Hook para actualizar módulo
 */
export function useActualizarModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: ActualizarModuloDto }) =>
      modulosApi.actualizar(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
      queryClient.invalidateQueries({ queryKey: ["modulo"] });
      toast.success("Módulo actualizado", {
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al actualizar módulo", {
        description:
          error.response?.data?.message || "No se pudo actualizar el módulo",
      });
    },
  });
}

/**
 * Hook para eliminar módulo (soft delete)
 */
export function useEliminarModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduloId: number) => modulosApi.eliminar(moduloId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
      queryClient.invalidateQueries({ queryKey: ["modulo"] });
      toast.success("Módulo eliminado", {
        description: "El módulo ha sido eliminado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al eliminar módulo", {
        description:
          error.response?.data?.message || "No se pudo eliminar el módulo",
      });
    },
  });
}

/**
 * Hook para toggle activo/inactivo
 */
export function useToggleActivoModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: string }) =>
      modulosApi.actualizar(id, { activo: activo === "S" ? "N" : "S" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
      queryClient.invalidateQueries({ queryKey: ["modulo"] });
      toast.success("Módulo actualizado", {
        description: "El estado del módulo ha sido actualizado",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error", {
        description:
          error.response?.data?.message || "No se pudo actualizar el módulo",
      });
    },
  });
}
