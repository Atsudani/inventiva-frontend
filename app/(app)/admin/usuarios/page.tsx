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
  Mail,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/Spinner";
import type { FiltrosUsuarios } from "@/lib/types/usuarios";
import { useAuthStore } from "@/lib/auth-store";
import {
  useEliminarUsuario,
  useToggleActivo,
  useUsuarios,
} from "@/lib/hooks/use-usuarios";
import { useReenviarActivacion } from "@/lib/hooks/use-auth"; // ← Agregar

import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export default function UsuariosPage() {
  const router = useRouter();

  const tienePermisoCrear = useAuthStore((s) =>
    s.tienePermisoAccion("/admin/usuarios", "crear"),
  );

  const [filtros, setFiltros] = useState<FiltrosUsuarios>({
    search: "",
    role: undefined,
    isActive: undefined,
    grupoId: undefined,
    page: 1,
    pageSize: 10,
    sortBy: "CREATED_AT",
    sortOrder: "DESC",
  });

  // TanStack Query
  const { data, isLoading, refetch } = useUsuarios(filtros);
  const eliminarUsuario = useEliminarUsuario();
  const toggleActivo = useToggleActivo();

  const reenviarActivacion = useReenviarActivacion(); // ← Agregar

  const usuarios = data?.data || [];
  const pagination = data?.pagination;

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-PY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>

        {tienePermisoCrear && (
          <Button
            className=" cursor-pointer"
            onClick={() => router.push("/admin/usuarios/crear")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={filtros.search}
                onChange={(e) =>
                  setFiltros({ ...filtros, search: e.target.value, page: 1 })
                }
                className="pl-9"
              />
            </div>

            {/* Filtro por Rol */}
            <Select
              value={filtros.role || "todos"}
              onValueChange={(value) =>
                setFiltros({
                  ...filtros,
                  role: value === "todos" ? undefined : value,
                  page: 1,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">Usuario</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por Estado */}
            <Select
              value={
                filtros.isActive === undefined
                  ? "todos"
                  : filtros.isActive === "Y"
                    ? "activo"
                    : "inactivo"
              }
              onValueChange={(value) =>
                setFiltros({
                  ...filtros,
                  isActive:
                    value === "todos"
                      ? undefined
                      : value === "activo"
                        ? "Y"
                        : "N",
                  page: 1,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            {/* Botón Actualizar */}
            <Button
              className=" cursor-pointer"
              variant="outline"
              onClick={() => refetch()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Usuarios */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : usuarios.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron usuarios
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Email Verificado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      {usuario.fullName || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {usuario.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{usuario.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {usuario.grupoNombre || "-"}
                    </TableCell>

                    {/* <TableCell>
                      {usuario.isActive === "Y" ? (
                        <Badge className="bg-green-500">Activo</Badge>
                      ) : (
                        <Badge variant="destructive">Inactivo</Badge>
                      )}
                    </TableCell> */}

                    <TableCell>
                      <ConfirmDialog
                        title={
                          usuario.isActive === "Y"
                            ? "Desactivar usuario"
                            : "Activar usuario"
                        }
                        description={`¿${usuario.isActive === "Y" ? "Desactivar" : "Activar"} al usuario ${usuario.fullName || usuario.email}?`}
                        confirmText={
                          usuario.isActive === "Y" ? "Desactivar" : "Activar"
                        }
                        variant={
                          usuario.isActive === "Y" ? "destructive" : "default"
                        }
                        onConfirm={() => toggleActivo.mutate(usuario.id)}
                        isPending={toggleActivo.isPending}
                        trigger={
                          <button className="cursor-pointer">
                            {usuario.isActive === "Y" ? (
                              <Badge className="bg-green-500">Activo</Badge>
                            ) : (
                              <Badge variant="destructive">Inactivo</Badge>
                            )}
                          </button>
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {usuario.emailVerified === "Y" ? (
                        <Badge className="bg-blue-500">Verificado</Badge>
                      ) : (
                        <Badge variant="secondary">Pendiente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatearFecha(usuario.createdAt)}
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
                              router.push(`/admin/usuarios/${usuario.id}`)
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>

                          {/* <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem> */}

                          {/* ✅ Agregar esta opción */}
                          {usuario.emailVerified === "N" && (
                            <DropdownMenuItem
                              onClick={() =>
                                reenviarActivacion.mutate(usuario.email)
                              }
                              disabled={reenviarActivacion.isPending}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Reenviar activación
                            </DropdownMenuItem>
                          )}

                          {/* ✅ Usar ConfirmDialog */}
                          <ConfirmDialog
                            title="Eliminar usuario"
                            description={`¿Desactivar al usuario ${usuario.fullName || usuario.email}? El usuario quedará inactivo pero no se eliminarán sus datos.`}
                            confirmText="Sí, eliminar"
                            variant="destructive"
                            onConfirm={() => eliminarUsuario.mutate(usuario.id)}
                            isPending={eliminarUsuario.isPending}
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

      {/* Paginación */}
      {!isLoading && usuarios.length > 0 && pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {usuarios.length} de {pagination.total} usuarios
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                setFiltros({ ...filtros, page: filtros.page! - 1 })
              }
            >
              Anterior
            </Button>
            <span className="flex items-center px-4 text-sm">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setFiltros({ ...filtros, page: filtros.page! + 1 })
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* {!isLoading && usuarios.length > 0 && pagination && (
        <DataTablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          totalItems={pagination.total}
          onPageChange={(page) => setFiltros({ ...filtros, page })}
          onPageSizeChange={(pageSize) => setFiltros({ ...filtros, pageSize, page: 1 })}
        />
      )} */}
    </div>
  );
}
