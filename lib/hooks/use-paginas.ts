// lib/hooks/use-paginas.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paginasApi } from "@/lib/api/paginas";
import { toast } from "sonner";
import type { ApiError } from "@/lib/types/api";
import type { CrearPaginaDto, ActualizarPaginaDto } from "@/lib/types/paginas";

/**
 * Hook para listar páginas
 */
export function usePaginas() {
  return useQuery({
    queryKey: ["paginas"],
    queryFn: () => paginasApi.listar(),
  });
}

/**
 * Hook para obtener una página por ID
 */
export function usePagina(id: number) {
  return useQuery({
    queryKey: ["pagina", id],
    queryFn: () => paginasApi.obtenerPorId(id),
    enabled: !!id,
  });
}

/**
 * Hook para crear página
 */
export function useCrearPagina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearPaginaDto) => paginasApi.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginas"] });
      toast.success("Página creada", {
        description: "La página ha sido creada correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al crear página", {
        description:
          error.response?.data?.message || "No se pudo crear la página",
      });
    },
  });
}

/**
 * Hook para actualizar página
 */
export function useActualizarPagina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: ActualizarPaginaDto }) =>
      paginasApi.actualizar(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginas"] });
      queryClient.invalidateQueries({ queryKey: ["pagina"] });
      toast.success("Página actualizada", {
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al actualizar página", {
        description:
          error.response?.data?.message || "No se pudo actualizar la página",
      });
    },
  });
}

/**
 * Hook para eliminar página (soft delete)
 */
export function useEliminarPagina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paginaId: number) => paginasApi.eliminar(paginaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginas"] });
      queryClient.invalidateQueries({ queryKey: ["pagina"] });
      toast.success("Página eliminada", {
        description: "La página ha sido eliminada correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al eliminar página", {
        description:
          error.response?.data?.message || "No se pudo eliminar la página",
      });
    },
  });
}

/**
 * Hook para toggle activo/inactivo
 */
export function useToggleActivoPagina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: string }) =>
      paginasApi.actualizar(id, { activo: activo === "S" ? "N" : "S" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginas"] });
      queryClient.invalidateQueries({ queryKey: ["pagina"] });
      toast.success("Página actualizada", {
        description: "El estado de la página ha sido actualizado",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error", {
        description:
          error.response?.data?.message || "No se pudo actualizar la página",
      });
    },
  });
}
