"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/Spinner";
import {
  editarUsuarioSchema,
  type EditarUsuarioFormData,
} from "@/lib/schemas/usuarios";
import { useUsuario, useActualizarUsuario } from "@/lib/hooks/use-usuarios";
import { useGruposSelect } from "@/lib/hooks/use-grupos";
import { useEffect, useState } from "react";

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: usuario, isLoading } = useUsuario(id);
  const actualizarUsuario = useActualizarUsuario();
  const { data: grupos, isLoading: isLoadingGrupos } = useGruposSelect();

  const form = useForm<EditarUsuarioFormData>({
    resolver: zodResolver(editarUsuarioSchema),
    defaultValues: {
      fullName: "",
      role: "USER",
      grupoId: undefined,
      isActive: "Y",
    },
  });
  const [selectKey, setSelectKey] = useState(0);
  const [selectKeyGrupo, setSelectKeyGrupo] = useState(0);

  useEffect(() => {
    if (!usuario) return;

    const normalizarIsActive = (v: unknown): "Y" | "N" => {
      const s = String(v ?? "")
        .trim()
        .toUpperCase();
      return s === "N" ? "N" : "Y";
    };

    form.reset({
      fullName: usuario.fullName || "",
      role:
        (String(usuario.role ?? "")
          .trim()
          .toUpperCase() as "ADMIN" | "USER") || "USER",
      grupoId: usuario.grupoId ?? undefined,
      isActive: normalizarIsActive(usuario.isActive),
    });

    // fuerza remount UNA vez al cargar/resetear data
    setSelectKey((k) => k + 1);
    setSelectKeyGrupo((k) => k + 1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const onSubmit = async (data: EditarUsuarioFormData) => {
    actualizarUsuario.mutate(
      {
        id,
        datos: data,
      },
      {
        onSuccess: () => {
          router.push("/admin/usuarios");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Usuario no encontrado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Usuario</h1>
          <p className="text-muted-foreground">
            Modifica la información del usuario
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
          <CardDescription>
            Email: <span className="font-medium">{usuario.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nombre Completo */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre Completo <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Juan Pérez"
                        {...field}
                        disabled={actualizarUsuario.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rol */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rol <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={actualizarUsuario.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="USER">Usuario</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estado */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Estado <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      // key={form.watch("isActive")}
                      key={selectKey}
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={actualizarUsuario.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Y">Activo</SelectItem>
                        <SelectItem value="N">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Grupo (opcional)  */}
              {/* Grupo (opcional) */}
              <FormField
                control={form.control}
                name="grupoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo (opcional)</FormLabel>
                    <Select
                      key={selectKeyGrupo}
                      onValueChange={(value) =>
                        field.onChange(value === "0" ? null : Number(value))
                      }
                      value={field.value?.toString() || "0"}
                      disabled={actualizarUsuario.isPending || isLoadingGrupos}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Sin grupo</SelectItem>
                        {grupos?.map((grupo) => (
                          <SelectItem
                            key={grupo.id}
                            value={grupo.id.toString()}
                          >
                            {grupo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Acciones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={actualizarUsuario.isPending}>
                  {actualizarUsuario.isPending
                    ? "Guardando..."
                    : "Guardar Cambios"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={actualizarUsuario.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
