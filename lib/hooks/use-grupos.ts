import { useQuery } from "@tanstack/react-query";
import { gruposApi } from "../api/grupos";

export function useGruposSelect() {
  return useQuery({
    queryKey: ["gruposSelect"],
    queryFn: () => gruposApi.obtenerGruposSelect(),
    staleTime: 1000 * 60 * 5, // 5 minutos (los grupos no cambian tan seguido)
  });
}
