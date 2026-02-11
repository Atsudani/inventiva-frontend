import { api } from "../api";
import { GrupoSelect } from "../types/grupos";

export const gruposApi = {
  obtenerGruposSelect: async (): Promise<GrupoSelect[]> => {
    const response = await api.get("/grupos/select");
    return response.data;
  },
};
