// lib/hooks/use-permisos-grupos.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permisosGruposApi } from "@/lib/api/permisos-grupos";
import { toast } from "sonner";
import type { ApiError } from "@/lib/types/api";
import type { ActualizarPermisosGrupoDto } from "@/lib/types/permisos-grupos";

/**
 * Hook para obtener permisos de un grupo
 */
export function usePermisosGrupo(grupoId: number) {
  return useQuery({
    queryKey: ["permisos-grupo", grupoId],
    queryFn: () => permisosGruposApi.obtenerPorGrupo(grupoId),
    enabled: !!grupoId && grupoId > 0,
  });
}

/**
 * Hook para actualizar permisos de un grupo
 */
export function useActualizarPermisosGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      grupoId,
      datos,
    }: {
      grupoId: number;
      datos: ActualizarPermisosGrupoDto;
    }) => permisosGruposApi.actualizar(grupoId, datos),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["permisos-grupo", variables.grupoId],
      });
      toast.success("Permisos actualizados", {
        description:
          data.message || "Los permisos se han guardado correctamente",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Error al actualizar permisos", {
        description:
          error.response?.data?.message ||
          "No se pudieron actualizar los permisos",
      });
    },
  });
}
