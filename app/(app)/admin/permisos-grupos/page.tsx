"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/Spinner";
import { useGruposSelect } from "@/lib/hooks/use-grupos";
import {
  usePermisosGrupo,
  useActualizarPermisosGrupo,
} from "@/lib/hooks/use-permisos-grupos";
import type { PermisoGrupoPagina } from "@/lib/types/permisos-grupos";

export default function PermisosGruposPage() {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number>(0);
  const [permisos, setPermisos] = useState<PermisoGrupoPagina[]>([]);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  const { data: grupos } = useGruposSelect();
  const {
    data: permisosData,
    isLoading,
    refetch,
  } = usePermisosGrupo(grupoSeleccionado);
  const actualizarPermisos = useActualizarPermisosGrupo();
  const [resetKey, setResetKey] = useState(0);

  // ✅ Actualizar permisos cuando cambian los datos del servidor
  useEffect(() => {
    if (permisosData) {
      setPermisos([...permisosData]);
    }
  }, [permisosData, resetKey]);

  // Aplicar filtros
  const permisosFiltrados = useMemo(() => {
    let resultado = permisos;

    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter((p) =>
        p.paginaNombre?.toLowerCase().includes(busqueda.toLowerCase()),
      );
    }

    // Filtrar por tipo
    if (tipoFiltro !== "todos") {
      resultado = resultado.filter((p) => p.tipoNombre === tipoFiltro);
    }

    return resultado;
  }, [permisos, busqueda, tipoFiltro]);

  // Paginación
  const totalPaginas = Math.ceil(permisosFiltrados.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const permisosPaginados = permisosFiltrados.slice(inicio, fin);

  const handleGrupoChange = (value: string) => {
    const grupoId = parseInt(value);
    setGrupoSeleccionado(grupoId);
    setPaginaActual(1);
    setBusqueda("");
    setTipoFiltro("todos");
  };

  const handleBusquedaChange = (value: string) => {
    setBusqueda(value);
    setPaginaActual(1);
  };

  const handleTipoChange = (value: string) => {
    setTipoFiltro(value);
    setPaginaActual(1);
  };

  const handleItemsPorPaginaChange = (value: string) => {
    setItemsPorPagina(Number(value));
    setPaginaActual(1);
  };

  const handlePermisoChange = (
    paginaId: number,
    campo: "puedeVer" | "puedeCrear" | "puedeEditar" | "puedeEliminar",
    valor: boolean,
  ) => {
    setPermisos((prev) =>
      prev.map((p) =>
        p.paginaId === paginaId ? { ...p, [campo]: valor ? "S" : "N" } : p,
      ),
    );
  };

  const handleGuardar = () => {
    if (!grupoSeleccionado) return;

    actualizarPermisos.mutate({
      grupoId: grupoSeleccionado,
      datos: {
        permisos: permisos.map((p) => ({
          paginaId: p.paginaId,
          puedeVer: p.puedeVer,
          puedeCrear: p.puedeCrear,
          puedeEditar: p.puedeEditar,
          puedeEliminar: p.puedeEliminar,
        })),
      },
    });
  };

  const grupoNombre =
    grupos?.find((g) => g.id === grupoSeleccionado)?.nombre || "";

  // Lista única de tipos desde los permisos
  const tiposUnicos = useMemo(() => {
    const tipos = new Set(
      permisos.map((p) => p.tipoNombre).filter((t): t is string => Boolean(t)), // ← Type guard para TypeScript
    );
    return Array.from(tipos).sort();
  }, [permisos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Asignación de Permisos
          </h1>
          <p className="text-muted-foreground">
            Gestiona los permisos de cada grupo por página
          </p>
        </div>

        {grupoSeleccionado > 0 && (
          <Button
            onClick={handleGuardar}
            disabled={actualizarPermisos.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {actualizarPermisos.isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        )}
      </div>

      {/* Selector de Grupo */}
      <Card>
        <CardHeader>
          <CardTitle>Selecciona un Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={grupoSeleccionado.toString()}
            onValueChange={handleGrupoChange}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecciona un grupo" />
            </SelectTrigger>
            <SelectContent>
              {grupos?.map((grupo) => (
                <SelectItem key={grupo.id} value={grupo.id.toString()}>
                  {grupo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filtros */}
      {grupoSeleccionado > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {/* Búsqueda */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar página..."
                  value={busqueda}
                  onChange={(e) => handleBusquedaChange(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filtro por Tipo */}
              <Select value={tipoFiltro} onValueChange={handleTipoChange}>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Tipo de página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposUnicos.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botón Actualizar */}
              <Button
                variant="outline"
                onClick={async () => {
                  await refetch();
                  setResetKey((k) => k + 1);
                  setBusqueda("");
                  setTipoFiltro("todos");
                  setPaginaActual(1);
                }}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Permisos */}
      {grupoSeleccionado > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Permisos de: <span className="text-primary">{grupoNombre}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            ) : permisosFiltrados.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No se encontraron páginas
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Página</TableHead>
                      <TableHead>Ruta</TableHead>
                      <TableHead className="text-center">Ver</TableHead>
                      <TableHead className="text-center">Crear</TableHead>
                      <TableHead className="text-center">Editar</TableHead>
                      <TableHead className="text-center">Eliminar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permisosPaginados.map((permiso) => (
                      <TableRow key={permiso.paginaId}>
                        <TableCell>
                          <Badge variant="secondary">
                            {permiso.moduloNombre}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permiso.tipoNombre}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {permiso.paginaNombre}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {permiso.paginaRuta}
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={permiso.puedeVer === "S"}
                            onCheckedChange={(checked) =>
                              handlePermisoChange(
                                permiso.paginaId,
                                "puedeVer",
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={permiso.puedeCrear === "S"}
                            onCheckedChange={(checked) =>
                              handlePermisoChange(
                                permiso.paginaId,
                                "puedeCrear",
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={permiso.puedeEditar === "S"}
                            onCheckedChange={(checked) =>
                              handlePermisoChange(
                                permiso.paginaId,
                                "puedeEditar",
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={permiso.puedeEliminar === "S"}
                            onCheckedChange={(checked) =>
                              handlePermisoChange(
                                permiso.paginaId,
                                "puedeEliminar",
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Paginación */}
                <div className="flex items-center justify-between border-t p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Mostrar
                    </span>
                    <Select
                      value={itemsPorPagina.toString()}
                      onValueChange={handleItemsPorPaginaChange}
                    >
                      <SelectTrigger className="w-17.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                      de {permisosFiltrados.length} resultados
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                      disabled={paginaActual === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Página {paginaActual} de {totalPaginas}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                      }
                      disabled={paginaActual === totalPaginas}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
