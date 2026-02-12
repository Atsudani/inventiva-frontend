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
  useModulos,
  useCrearModulo,
  useActualizarModulo,
  useEliminarModulo,
  useToggleActivoModulo,
} from "@/lib/hooks/use-modulos";
import { useAuthStore } from "@/lib/auth-store";
import { ModuloForm } from "./_components/modulo-form";
import type { Modulo } from "@/lib/types/modulos";
import type {
  CrearModuloFormData,
  EditarModuloFormData,
} from "@/lib/schemas/modulos";

export default function ModulosPage() {
  const [search, setSearch] = useState("");
  const [sheetMode, setSheetMode] = useState<"crear" | "editar" | null>(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState<Modulo | null>(
    null,
  );

  const tienePermisoCrear = useAuthStore((s) =>
    s.tienePermisoAccion("/admin/modulos", "crear"),
  );

  const { data: modulos, isLoading, refetch } = useModulos();
  const crearModulo = useCrearModulo();
  const actualizarModulo = useActualizarModulo();
  const eliminarModulo = useEliminarModulo();
  const toggleActivo = useToggleActivoModulo();

  // Filtrar por búsqueda
  const modulosFiltrados =
    modulos?.filter(
      (m) =>
        m.nombre.toLowerCase().includes(search.toLowerCase()) ||
        m.codigo.toLowerCase().includes(search.toLowerCase()),
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
    setModuloSeleccionado(null);
    setSheetMode("crear");
  };

  const handleEditar = (modulo: Modulo) => {
    setModuloSeleccionado(modulo);
    setSheetMode("editar");
  };

  const handleCloseSheet = () => {
    setSheetMode(null);
    setModuloSeleccionado(null);
  };

  const handleSubmitCrear = (data: CrearModuloFormData) => {
    crearModulo.mutate(data, {
      onSuccess: () => {
        handleCloseSheet();
      },
    });
  };

  const handleSubmitEditar = (data: EditarModuloFormData) => {
    if (!moduloSeleccionado) return;

    actualizarModulo.mutate(
      {
        id: moduloSeleccionado.id,
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
          <h1 className="text-3xl font-bold tracking-tight">Módulos</h1>
          <p className="text-muted-foreground">
            Gestiona los módulos del sistema
          </p>
        </div>

        {tienePermisoCrear && (
          <Button onClick={handleCrear}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Módulo
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
          ) : modulosFiltrados.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron módulos
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Icono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modulosFiltrados.map((modulo) => (
                  <TableRow key={modulo.id}>
                    <TableCell className="font-medium">
                      {modulo.orden}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{modulo.codigo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {modulo.nombre}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {modulo.descripcion || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {modulo.icono || "-"}
                    </TableCell>
                    <TableCell>
                      <ConfirmDialog
                        title={
                          modulo.activo === "S"
                            ? "Desactivar módulo"
                            : "Activar módulo"
                        }
                        description={`¿${modulo.activo === "S" ? "Desactivar" : "Activar"} el módulo ${modulo.nombre}?`}
                        confirmText={
                          modulo.activo === "S" ? "Desactivar" : "Activar"
                        }
                        variant={
                          modulo.activo === "S" ? "destructive" : "default"
                        }
                        onConfirm={() =>
                          toggleActivo.mutate({
                            id: modulo.id,
                            activo: modulo.activo,
                          })
                        }
                        isPending={toggleActivo.isPending}
                        trigger={
                          <button className="cursor-pointer">
                            {modulo.activo === "S" ? (
                              <Badge className="bg-green-500">Activo</Badge>
                            ) : (
                              <Badge variant="destructive">Inactivo</Badge>
                            )}
                          </button>
                        }
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatearFecha(modulo.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditar(modulo)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>

                          <ConfirmDialog
                            title="Eliminar módulo"
                            description={`¿Eliminar el módulo ${modulo.nombre}? Esta acción no se puede deshacer.`}
                            confirmText="Sí, eliminar"
                            variant="destructive"
                            onConfirm={() => eliminarModulo.mutate(modulo.id)}
                            isPending={eliminarModulo.isPending}
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
      {/* Sheet de Crear/Editar */}
      <Sheet open={sheetMode !== null} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-lg overflow-y-auto p-0 bg-gray-100">
          <div className="p-6">
            <SheetHeader>
              <SheetTitle>
                {sheetMode === "crear" ? "Nuevo Módulo" : "Editar Módulo"}
              </SheetTitle>
              <SheetDescription>
                {sheetMode === "crear"
                  ? "Crea un nuevo módulo del sistema"
                  : "Modifica la información del módulo"}
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="px-6 pb-6">
            <ModuloForm
              modulo={sheetMode === "editar" ? moduloSeleccionado! : undefined}
              onSubmit={
                sheetMode === "crear" ? handleSubmitCrear : handleSubmitEditar
              }
              onCancel={handleCloseSheet}
              isPending={crearModulo.isPending || actualizarModulo.isPending}
            />
          </div>
        </SheetContent>
      </Sheet>
      {/* <Sheet open={sheetMode !== null} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "crear" ? "Nuevo Módulo" : "Editar Módulo"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "crear"
                ? "Crea un nuevo módulo del sistema"
                : "Modifica la información del módulo"}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ModuloForm
              modulo={sheetMode === "editar" ? moduloSeleccionado! : undefined}
              onSubmit={
                sheetMode === "crear" ? handleSubmitCrear : handleSubmitEditar
              }
              onCancel={handleCloseSheet}
              isPending={crearModulo.isPending || actualizarModulo.isPending}
            />
          </div>
        </SheetContent>
      </Sheet> */}
    </div>
  );
}
