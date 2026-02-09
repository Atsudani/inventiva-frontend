"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  crearUsuarioSchema,
  type CrearUsuarioFormData,
} from "@/lib/schemas/usuarios";
import { useCrearUsuario } from "@/lib/hooks/use-usuarios";

export default function CrearUsuarioPage() {
  const router = useRouter();
  const crearUsuario = useCrearUsuario();

  // ✨ React Hook Form + Zod
  const form = useForm<CrearUsuarioFormData>({
    resolver: zodResolver(crearUsuarioSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "USER",
      grupoId: undefined,
    },
  });

  const onSubmit = async (data: CrearUsuarioFormData) => {
    crearUsuario.mutate(data, {
      onSuccess: () => {
        router.push("/admin/usuarios");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Usuario</h1>
          <p className="text-muted-foreground">
            Crea un nuevo usuario en el sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
          <CardDescription>
            Al crear el usuario, se generará un link de activación que se
            enviará al email proporcionado
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
                        disabled={crearUsuario.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="juan.perez@example.com"
                        {...field}
                        disabled={crearUsuario.isPending}
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
                      defaultValue={field.value}
                      disabled={crearUsuario.isPending}
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

              {/* Grupo (opcional) - TODO: Cargar desde API */}
              <FormField
                control={form.control}
                name="grupoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo (opcional)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={crearUsuario.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Cargar grupos desde API */}
                        <SelectItem value="0">Sin grupo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Los grupos se usan para organizar usuarios y asignar
                      permisos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Acciones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={crearUsuario.isPending}>
                  {crearUsuario.isPending ? "Creando..." : "Crear Usuario"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={crearUsuario.isPending}
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
