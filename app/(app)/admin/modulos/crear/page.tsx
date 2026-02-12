"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  crearModuloSchema,
  type CrearModuloFormData,
} from "@/lib/schemas/modulos";
import { useCrearModulo } from "@/lib/hooks/use-modulos";

export default function CrearModuloPage() {
  const router = useRouter();
  const crearModulo = useCrearModulo();

  const form = useForm<CrearModuloFormData>({
    resolver: zodResolver(crearModuloSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      icono: "",
      orden: 0,
    },
  });

  const onSubmit = async (data: CrearModuloFormData) => {
    crearModulo.mutate(data, {
      onSuccess: () => {
        router.push("/admin/modulos");
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
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Módulo</h1>
          <p className="text-muted-foreground">
            Crea un nuevo módulo del sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información del Módulo</CardTitle>
          <CardDescription>
            Los módulos organizan las funcionalidades del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Código */}
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Código <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ADMIN"
                        {...field}
                        disabled={crearModulo.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Código único del módulo (se convertirá a mayúsculas)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nombre */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Administración"
                        {...field}
                        disabled={crearModulo.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descripción */}
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Módulo de administración del sistema"
                        {...field}
                        disabled={crearModulo.isPending}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Icono */}
              <FormField
                control={form.control}
                name="icono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icono</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Settings"
                        {...field}
                        disabled={crearModulo.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Nombre del icono de Lucide React
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Orden */}
              <FormField
                control={form.control}
                name="orden"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={crearModulo.isPending}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Orden de aparición en el menú (menor primero)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Acciones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={crearModulo.isPending}>
                  {crearModulo.isPending ? "Creando..." : "Crear Módulo"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={crearModulo.isPending}
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
