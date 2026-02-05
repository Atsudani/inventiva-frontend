"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  RefreshCw,
  Mail,
  UserX,
  UserCheck,
  MoreHorizontal,
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
  useUsuarios,
  useReenviarActivacion,
  useToggleActivo,
} from "@/lib/hooks/use-usuarios";

export default function UsuariosPage() {
  const router = useRouter();

  const tienePermisoCrear = useAuthStore((s) =>
    s.tienePermisoAccion("/admin/usuarios", "crear"),
  );

  const [filtros, setFiltros] = useState<FiltrosUsuarios>({
    search: "",
    role: undefined,
    activo: undefined,
    activado: undefined,
    pagina: 1,
    porPagina: 10,
  });

  // ✨ TanStack Query - Mucho más limpio
  const { data, isLoading, refetch } = useUsuarios(filtros);
  const reenviarActivacion = useReenviarActivacion();
  const toggleActivo = useToggleActivo();

  const usuarios = data?.usuarios || [];
  const total = data?.total || 0;

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-PY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
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
          <Button onClick={() => router.push("/admin/usuarios/crear")}>
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
                  setFiltros({ ...filtros, search: e.target.value, pagina: 1 })
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
                  pagina: 1,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por Estado */}
            <Select
              value={
                filtros.activo === undefined
                  ? "todos"
                  : filtros.activo
                    ? "activo"
                    : "inactivo"
              }
              onValueChange={(value) =>
                setFiltros({
                  ...filtros,
                  activo:
                    value === "todos"
                      ? undefined
                      : value === "activo"
                        ? true
                        : false,
                  pagina: 1,
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
            <Button variant="outline" onClick={() => refetch()}>
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
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Activación</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      {usuario.nombre}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {usuario.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{usuario.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {usuario.activo ? (
                        <Badge className="bg-green-500">Activo</Badge>
                      ) : (
                        <Badge variant="destructive">Inactivo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {usuario.activado ? (
                        <Badge className="bg-blue-500">Activado</Badge>
                      ) : (
                        <Badge variant="secondary">Pendiente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatearFecha(usuario.ultimoAcceso)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!usuario.activado && (
                            <DropdownMenuItem
                              onClick={() =>
                                reenviarActivacion.mutate(usuario.id)
                              }
                              disabled={reenviarActivacion.isPending}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Reenviar Activación
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => toggleActivo.mutate(usuario.id)}
                            disabled={toggleActivo.isPending}
                          >
                            {usuario.activo ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
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
      {!isLoading && usuarios.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {usuarios.length} de {total} usuarios
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filtros.pagina === 1}
              onClick={() =>
                setFiltros({ ...filtros, pagina: filtros.pagina! - 1 })
              }
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={usuarios.length < filtros.porPagina!}
              onClick={() =>
                setFiltros({ ...filtros, pagina: filtros.pagina! + 1 })
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
