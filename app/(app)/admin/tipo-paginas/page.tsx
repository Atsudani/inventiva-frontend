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
  useTipoPaginas,
  useCrearTipoPagina,
  useActualizarTipoPagina,
  useEliminarTipoPagina,
  useToggleActivoTipoPagina,
} from "@/lib/hooks/use-tipo-paginas";
import { useAuthStore } from "@/lib/auth-store";
import { TipoPaginaForm } from "./_components/tipo-pagina-form";
import type { TipoPagina } from "@/lib/types/tipo-paginas";
import type {
  CrearTipoPaginaFormData,
  EditarTipoPaginaFormData,
} from "@/lib/schemas/tipo-paginas";

export default function TipoPaginasPage() {
  const [search, setSearch] = useState("");
  const [sheetMode, setSheetMode] = useState<"crear" | "editar" | null>(null);
  const [tipoPaginaSeleccionada, setTipoPaginaSeleccionada] =
    useState<TipoPagina | null>(null);

  const tienePermisoCrear = useAuthStore((s) =>
    s.tienePermisoAccion("/admin/tipo-paginas", "crear"),
  );

  const { data: tipoPaginas, isLoading, refetch } = useTipoPaginas();
  const crearTipoPagina = useCrearTipoPagina();
  const actualizarTipoPagina = useActualizarTipoPagina();
  const eliminarTipoPagina = useEliminarTipoPagina();
  const toggleActivo = useToggleActivoTipoPagina();

  // Filtrar por búsqueda
  const tipoPaginasFiltradas =
    tipoPaginas?.filter(
      (tp) =>
        tp.nombre.toLowerCase().includes(search.toLowerCase()) ||
        tp.codigo.toLowerCase().includes(search.toLowerCase()),
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
    setTipoPaginaSeleccionada(null);
    setSheetMode("crear");
  };

  const handleEditar = (tipoPagina: TipoPagina) => {
    setTipoPaginaSeleccionada(tipoPagina);
    setSheetMode("editar");
  };

  const handleCloseSheet = () => {
    setSheetMode(null);
    setTipoPaginaSeleccionada(null);
  };

  const handleSubmitCrear = (data: CrearTipoPaginaFormData) => {
    crearTipoPagina.mutate(data, {
      onSuccess: () => {
        handleCloseSheet();
      },
    });
  };

  const handleSubmitEditar = (data: EditarTipoPaginaFormData) => {
    if (!tipoPaginaSeleccionada) return;

    actualizarTipoPagina.mutate(
      {
        id: tipoPaginaSeleccionada.id,
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
          <h1 className="text-3xl font-bold tracking-tight">Tipo de Páginas</h1>
          <p className="text-muted-foreground">
            Gestiona los tipos de páginas del sistema
          </p>
        </div>

        {tienePermisoCrear && (
          <Button onClick={handleCrear}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Tipo
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
          ) : tipoPaginasFiltradas.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron tipos de páginas
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
                {tipoPaginasFiltradas.map((tipoPagina) => (
                  <TableRow key={tipoPagina.id}>
                    <TableCell className="font-medium">
                      {tipoPagina.orden}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tipoPagina.codigo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {tipoPagina.nombre}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {tipoPagina.descripcion || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tipoPagina.icono || "-"}
                    </TableCell>
                    <TableCell>
                      <ConfirmDialog
                        title={
                          tipoPagina.activo === "S"
                            ? "Desactivar tipo"
                            : "Activar tipo"
                        }
                        description={`¿${tipoPagina.activo === "S" ? "Desactivar" : "Activar"} el tipo ${tipoPagina.nombre}?`}
                        confirmText={
                          tipoPagina.activo === "S" ? "Desactivar" : "Activar"
                        }
                        variant={
                          tipoPagina.activo === "S" ? "destructive" : "default"
                        }
                        onConfirm={() =>
                          toggleActivo.mutate({
                            id: tipoPagina.id,
                            activo: tipoPagina.activo,
                          })
                        }
                        isPending={toggleActivo.isPending}
                        trigger={
                          <button className="cursor-pointer">
                            {tipoPagina.activo === "S" ? (
                              <Badge className="bg-green-500">Activo</Badge>
                            ) : (
                              <Badge variant="destructive">Inactivo</Badge>
                            )}
                          </button>
                        }
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatearFecha(tipoPagina.createdAt)}
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
                            onClick={() => handleEditar(tipoPagina)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>

                          <ConfirmDialog
                            title="Eliminar tipo de página"
                            description={`¿Eliminar el tipo ${tipoPagina.nombre}? Esta acción no se puede deshacer.`}
                            confirmText="Sí, eliminar"
                            variant="destructive"
                            onConfirm={() =>
                              eliminarTipoPagina.mutate(tipoPagina.id)
                            }
                            isPending={eliminarTipoPagina.isPending}
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
                {sheetMode === "crear"
                  ? "Nuevo Tipo de Página"
                  : "Editar Tipo de Página"}
              </SheetTitle>
              <SheetDescription>
                {sheetMode === "crear"
                  ? "Crea un nuevo tipo de página del sistema"
                  : "Modifica la información del tipo de página"}
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="px-6 pb-6">
            <TipoPaginaForm
              tipoPagina={
                sheetMode === "editar" ? tipoPaginaSeleccionada! : undefined
              }
              onSubmit={
                sheetMode === "crear" ? handleSubmitCrear : handleSubmitEditar
              }
              onCancel={handleCloseSheet}
              isPending={
                crearTipoPagina.isPending || actualizarTipoPagina.isPending
              }
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
