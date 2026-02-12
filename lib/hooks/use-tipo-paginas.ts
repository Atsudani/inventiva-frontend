// lib/hooks/use-tipo-paginas.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoPaginasApi } from "@/lib/api/tipo-paginas";
import { toast } from "sonner";
import type { ApiError } from "@/lib/types/api";
import type {
  CrearTipoPaginaDto,
  ActualizarTipoPaginaDto,
} from "@/lib/types/tipo-paginas";

/**
 * Hook para listar tipos de páginas
 */
export function useTipoPaginas() {
  return useQuery({
    queryKey: ["tipo-paginas"],
    queryFn: () => tipoPaginasApi.listar(),
  });
}

/**
 * Hook para obtener tipos de páginas para select
 */
export function useTipoPaginasSelect() {
  return useQuery({
    queryKey: ["tipo-paginas", "select"],
    queryFn: () => tipoPaginasApi.listarParaSelect(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener un tipo de página por ID
 */
export function useTipoPagina(id: number) {
  return useQuery({
    queryKey: ["tipo-pagina", id],
    queryFn: () => tipoPaginasApi.obtenerPorId(id),
    enabled: !!id,
  });
}

/**
 * Hook para crear tipo de página
 */
export function useCrearTipoPagina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearTipoPaginaDto) => tipoPaginasApi.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipo-paginas"] });
      toast.success("Tipo de página creado", {
        description: "El tipo de página ha sido creado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al crear tipo de página", {
        description:
          error.response?.data?.message || "No se pudo crear el tipo de página",
      });
    },
  });
}

/**
 * Hook para actualizar tipo de página
 */
export function useActualizarTipoPagina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      datos,
    }: {
      id: number;
      datos: ActualizarTipoPaginaDto;
    }) => tipoPaginasApi.actualizar(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipo-paginas"] });
      queryClient.invalidateQueries({ queryKey: ["tipo-pagina"] });
      toast.success("Tipo de página actualizado", {
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al actualizar tipo de página", {
        description:
          error.response?.data?.message ||
          "No se pudo actualizar el tipo de página",
      });
    },
  });
}

/**
 * Hook para eliminar tipo de página (soft delete)
 */
export function useEliminarTipoPagina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tipoPaginaId: number) => tipoPaginasApi.eliminar(tipoPaginaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipo-paginas"] });
      queryClient.invalidateQueries({ queryKey: ["tipo-pagina"] });
      toast.success("Tipo de página eliminado", {
        description: "El tipo de página ha sido eliminado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al eliminar tipo de página", {
        description:
          error.response?.data?.message ||
          "No se pudo eliminar el tipo de página",
      });
    },
  });
}

/**
 * Hook para toggle activo/inactivo
 */
export function useToggleActivoTipoPagina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: string }) =>
      tipoPaginasApi.actualizar(id, { activo: activo === "S" ? "N" : "S" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipo-paginas"] });
      queryClient.invalidateQueries({ queryKey: ["tipo-pagina"] });
      toast.success("Tipo de página actualizado", {
        description: "El estado del tipo de página ha sido actualizado",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error", {
        description:
          error.response?.data?.message ||
          "No se pudo actualizar el tipo de página",
      });
    },
  });
}
