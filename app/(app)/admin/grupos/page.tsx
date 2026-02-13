"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useGrupos,
  useCrearGrupo,
  useActualizarGrupo,
  useEliminarGrupo,
  useToggleActivoGrupo,
} from "@/lib/hooks/use-grupos";
import { useAuthStore } from "@/lib/auth-store";
import { GrupoForm } from "./_components/grupo-form";
import type { Grupo } from "@/lib/types/grupos";
import type {
  CrearGrupoFormData,
  EditarGrupoFormData,
} from "@/lib/schemas/grupos";

export default function GruposPage() {
  const [search, setSearch] = useState("");
  const [sheetMode, setSheetMode] = useState<"crear" | "editar" | null>(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo | null>(
    null,
  );

  const tienePermisoCrear = useAuthStore((s) =>
    s.tienePermisoAccion("/admin/grupos", "crear"),
  );

  const { data: grupos, isLoading, refetch } = useGrupos();
  const crearGrupo = useCrearGrupo();
  const actualizarGrupo = useActualizarGrupo();
  const eliminarGrupo = useEliminarGrupo();
  const toggleActivo = useToggleActivoGrupo();

  // Filtrar por búsqueda
  const gruposFiltrados =
    grupos?.filter(
      (g) =>
        g.nombre.toLowerCase().includes(search.toLowerCase()) ||
        g.codigo.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-PY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCrear = () => {
    setGrupoSeleccionado(null);
    setSheetMode("crear");
  };

  const handleEditar = (grupo: Grupo) => {
    setGrupoSeleccionado(grupo);
    setSheetMode("editar");
  };

  const handleCloseSheet = () => {
    setSheetMode(null);
    setGrupoSeleccionado(null);
  };

  const handleSubmitCrear = (data: CrearGrupoFormData) => {
    crearGrupo.mutate(data, {
      onSuccess: () => {
        handleCloseSheet();
      },
    });
  };

  const handleSubmitEditar = (data: EditarGrupoFormData) => {
    if (!grupoSeleccionado) return;

    actualizarGrupo.mutate(
      {
        id: grupoSeleccionado.id,
        datos: data,
      },
      {
        onSuccess: () => {
          handleCloseSheet();
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grupos</h1>
          <p className="text-muted-foreground">
            Gestiona los grupos de usuarios
          </p>
        </div>

        {tienePermisoCrear && (
          <Button onClick={handleCrear}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Grupo
          </Button>
        )}
      </div>

      {/* Filtros */}
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
                placeholder="Buscar por nombre o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Botón Actualizar */}
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : gruposFiltrados.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron grupos
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gruposFiltrados.map((grupo) => (
                  <TableRow key={grupo.id}>
                    <TableCell>
                      <Badge variant="outline">{grupo.codigo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {grupo.nombre}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-md truncate">
                      {grupo.descripcion || "-"}
                    </TableCell>
                    <TableCell>
                      <ConfirmDialog
                        title={
                          grupo.activo === "S"
                            ? "Desactivar grupo"
                            : "Activar grupo"
                        }
                        description={`¿${grupo.activo === "S" ? "Desactivar" : "Activar"} el grupo ${grupo.nombre}?`}
                        confirmText={
                          grupo.activo === "S" ? "Desactivar" : "Activar"
                        }
                        variant={
                          grupo.activo === "S" ? "destructive" : "default"
                        }
                        onConfirm={() =>
                          toggleActivo.mutate({
                            id: grupo.id,
                            activo: grupo.activo,
                          })
                        }
                        isPending={toggleActivo.isPending}
                        trigger={
                          <button className="cursor-pointer">
                            {grupo.activo === "S" ? (
                              <Badge className="bg-green-500">Activo</Badge>
                            ) : (
                              <Badge variant="destructive">Inactivo</Badge>
                            )}
                          </button>
                        }
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatearFecha(grupo.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditar(grupo)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>

                          <ConfirmDialog
                            title="Eliminar grupo"
                            description={`¿Eliminar el grupo ${grupo.nombre}? Esta acción no se puede deshacer.`}
                            confirmText="Sí, eliminar"
                            variant="destructive"
                            onConfirm={() => eliminarGrupo.mutate(grupo.id)}
                            isPending={eliminarGrupo.isPending}
                            trigger={
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Sheet de Crear/Editar */}
      <Sheet open={sheetMode !== null} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-lg overflow-y-auto p-0">
          <div className="p-6">
            <SheetHeader>
              <SheetTitle>
                {sheetMode === "crear" ? "Nuevo Grupo" : "Editar Grupo"}
              </SheetTitle>
              <SheetDescription>
                {sheetMode === "crear"
                  ? "Crea un nuevo grupo de usuarios"
                  : "Modifica la información del grupo"}
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="px-6 pb-6">
            <GrupoForm
              grupo={sheetMode === "editar" ? grupoSeleccionado! : undefined}
              onSubmit={
                sheetMode === "crear" ? handleSubmitCrear : handleSubmitEditar
              }
              onCancel={handleCloseSheet}
              isPending={crearGrupo.isPending || actualizarGrupo.isPending}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
