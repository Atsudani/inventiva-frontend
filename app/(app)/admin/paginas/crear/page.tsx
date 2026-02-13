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
  crearPaginaSchema,
  type CrearPaginaFormData,
} from "@/lib/schemas/paginas";
import { useCrearPagina } from "@/lib/hooks/use-paginas";
import { useModulosSelect } from "@/lib/hooks/use-modulos";
import { useTipoPaginasSelect } from "@/lib/hooks/use-tipo-paginas";

export default function CrearPaginaPage() {
  const router = useRouter();
  const crearPagina = useCrearPagina();

  const { data: modulos, isLoading: isLoadingModulos } = useModulosSelect();
  const { data: tipos, isLoading: isLoadingTipos } = useTipoPaginasSelect();

  const form = useForm<CrearPaginaFormData>({
    resolver: zodResolver(crearPaginaSchema),
    defaultValues: {
      moduloId: undefined,
      tipoId: undefined,
      codigo: "",
      nombre: "",
      descripcion: "",
      ruta: "",
      icono: "",
      orden: 0,
    },
  });

  const onSubmit = async (data: CrearPaginaFormData) => {
    crearPagina.mutate(data, {
      onSuccess: () => {
        router.push("/admin/paginas");
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
          <h1 className="text-3xl font-bold tracking-tight">Nueva Página</h1>
          <p className="text-muted-foreground">
            Crea una nueva página del sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información de la Página</CardTitle>
          <CardDescription>
            Las páginas son las rutas accesibles del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Módulo */}
              <FormField
                control={form.control}
                name="moduloId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Módulo <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={crearPagina.isPending || isLoadingModulos}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un módulo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modulos?.map((modulo) => (
                          <SelectItem
                            key={modulo.id}
                            value={modulo.id.toString()}
                          >
                            {modulo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Página */}
              <FormField
                control={form.control}
                name="tipoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo de Página <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={crearPagina.isPending || isLoadingTipos}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tipos?.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="USUARIOS"
                        {...field}
                        disabled={crearPagina.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Código único de la página (se convertirá a mayúsculas)
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
                        placeholder="Usuarios"
                        {...field}
                        disabled={crearPagina.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ruta */}
              <FormField
                control={form.control}
                name="ruta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ruta <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/admin/usuarios"
                        {...field}
                        disabled={crearPagina.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Ruta de acceso (debe comenzar con /)
                    </FormDescription>
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
                        placeholder="Gestión de usuarios del sistema"
                        {...field}
                        disabled={crearPagina.isPending}
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
                        placeholder="Users"
                        {...field}
                        disabled={crearPagina.isPending}
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
                        disabled={crearPagina.isPending}
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
                <Button type="submit" disabled={crearPagina.isPending}>
                  {crearPagina.isPending ? "Creando..." : "Crear Página"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={crearPagina.isPending}
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
