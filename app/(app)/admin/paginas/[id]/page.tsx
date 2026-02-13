"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Spinner } from "@/components/ui/Spinner";
import {
  editarPaginaSchema,
  type EditarPaginaFormData,
} from "@/lib/schemas/paginas";
import { usePagina, useActualizarPagina } from "@/lib/hooks/use-paginas";
import { useModulosSelect } from "@/lib/hooks/use-modulos";
import { useTipoPaginasSelect } from "@/lib/hooks/use-tipo-paginas";

export default function EditarPaginaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: pagina, isLoading } = usePagina(id);
  const actualizarPagina = useActualizarPagina();

  const { data: modulos, isLoading: isLoadingModulos } = useModulosSelect();
  const { data: tipos, isLoading: isLoadingTipos } = useTipoPaginasSelect();

  const form = useForm<EditarPaginaFormData>({
    resolver: zodResolver(editarPaginaSchema),
    defaultValues: {
      moduloId: undefined,
      tipoId: undefined,
      codigo: "",
      nombre: "",
      descripcion: "",
      ruta: "",
      icono: "",
      orden: 0,
      activo: "S",
    },
  });

  const [selectKey, setSelectKey] = useState(0);

  // Pre-llenar el formulario cuando se carguen los datos
  useEffect(() => {
    if (pagina) {
      form.reset({
        moduloId: pagina.moduloId,
        tipoId: pagina.tipoId,
        codigo: pagina.codigo,
        nombre: pagina.nombre,
        descripcion: pagina.descripcion || "",
        ruta: pagina.ruta,
        icono: pagina.icono || "",
        orden: pagina.orden,
        activo: pagina.activo as "S" | "N",
      });
      setSelectKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  const onSubmit = async (data: EditarPaginaFormData) => {
    actualizarPagina.mutate(
      {
        id,
        datos: data,
      },
      {
        onSuccess: () => {
          router.push("/admin/paginas");
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

  if (!pagina) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Página no encontrada
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
          <h1 className="text-3xl font-bold tracking-tight">Editar Página</h1>
          <p className="text-muted-foreground">
            Modifica la información de la página
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información de la Página</CardTitle>
          <CardDescription>
            Código: <span className="font-medium">{pagina.codigo}</span>
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
                      key={`modulo-${selectKey}`}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={actualizarPagina.isPending || isLoadingModulos}
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
                      key={`tipo-${selectKey}`}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={actualizarPagina.isPending || isLoadingTipos}
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
                        disabled={actualizarPagina.isPending}
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
                        disabled={actualizarPagina.isPending}
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
                        disabled={actualizarPagina.isPending}
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
                        disabled={actualizarPagina.isPending}
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
                        disabled={actualizarPagina.isPending}
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
                        disabled={actualizarPagina.isPending}
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

              {/* Estado */}
              <FormField
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Estado <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      key={`activo-${selectKey}`}
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={actualizarPagina.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="S">Activo</SelectItem>
                        <SelectItem value="N">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Acciones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={actualizarPagina.isPending}>
                  {actualizarPagina.isPending
                    ? "Guardando..."
                    : "Guardar Cambios"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={actualizarPagina.isPending}
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
