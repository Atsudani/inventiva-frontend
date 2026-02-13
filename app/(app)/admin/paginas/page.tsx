"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  RefreshCw,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  usePaginas,
  useEliminarPagina,
  useToggleActivoPagina,
} from "@/lib/hooks/use-paginas";
import { useAuthStore } from "@/lib/auth-store";

export default function PaginasPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  const tienePermisoCrear = useAuthStore((s) =>
    s.tienePermisoAccion("/admin/paginas", "crear"),
  );

  const { data: paginas, isLoading, refetch } = usePaginas();
  const eliminarPagina = useEliminarPagina();
  const toggleActivo = useToggleActivoPagina();

  // Filtrar por búsqueda
  const paginasFiltradas =
    paginas?.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo.toLowerCase().includes(search.toLowerCase()) ||
        p.ruta.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  // Paginación
  const totalPaginas = Math.ceil(paginasFiltradas.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const paginasPaginadas = paginasFiltradas.slice(inicio, fin);

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-PY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Resetear a página 1 cuando cambia el filtro
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPaginaActual(1);
  };

  const handleItemsPorPaginaChange = (value: string) => {
    setItemsPorPagina(Number(value));
    setPaginaActual(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Páginas</h1>
          <p className="text-muted-foreground">
            Gestiona las páginas del sistema
          </p>
        </div>

        {tienePermisoCrear && (
          <Button onClick={() => router.push("/admin/paginas/crear")}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Página
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
                placeholder="Buscar por nombre, código o ruta..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
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
          ) : paginasFiltradas.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron páginas
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Icono</TableHead>
                    <TableHead>Orden</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginasPaginadas.map((pagina) => (
                    <TableRow key={pagina.id}>
                      <TableCell>
                        <Badge variant="outline">{pagina.codigo}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {pagina.nombre}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {pagina.ruta}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{pagina.moduloNombre}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{pagina.tipoNombre}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {pagina.icono || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {pagina.orden}
                      </TableCell>
                      <TableCell>
                        <ConfirmDialog
                          title={
                            pagina.activo === "S"
                              ? "Desactivar página"
                              : "Activar página"
                          }
                          description={`¿${pagina.activo === "S" ? "Desactivar" : "Activar"} la página ${pagina.nombre}?`}
                          confirmText={
                            pagina.activo === "S" ? "Desactivar" : "Activar"
                          }
                          variant={
                            pagina.activo === "S" ? "destructive" : "default"
                          }
                          onConfirm={() =>
                            toggleActivo.mutate({
                              id: pagina.id,
                              activo: pagina.activo,
                            })
                          }
                          isPending={toggleActivo.isPending}
                          trigger={
                            <button className="cursor-pointer">
                              {pagina.activo === "S" ? (
                                <Badge className="bg-green-500">Activo</Badge>
                              ) : (
                                <Badge variant="destructive">Inactivo</Badge>
                              )}
                            </button>
                          }
                        />
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
                              onClick={() =>
                                router.push(`/admin/paginas/${pagina.id}`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>

                            <ConfirmDialog
                              title="Eliminar página"
                              description={`¿Eliminar la página ${pagina.nombre}? Esta acción no se puede deshacer.`}
                              confirmText="Sí, eliminar"
                              variant="destructive"
                              onConfirm={() => eliminarPagina.mutate(pagina.id)}
                              isPending={eliminarPagina.isPending}
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

              {/* Paginación */}
              <div className="flex items-center justify-between border-t p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mostrar</span>
                  <Select
                    value={itemsPorPagina.toString()}
                    onValueChange={handleItemsPorPaginaChange}
                  >
                    <SelectTrigger className="w-[70px]">
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
                    de {paginasFiltradas.length} resultados
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
    </div>
  );
}
