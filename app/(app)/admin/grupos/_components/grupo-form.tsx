"use client";

import { useEffect } from "react";
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
  crearGrupoSchema,
  editarGrupoSchema,
  type CrearGrupoFormData,
  type EditarGrupoFormData,
} from "@/lib/schemas/grupos";
import type { Grupo } from "@/lib/types/grupos";

interface GrupoFormProps {
  grupo?: Grupo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function GrupoForm({
  grupo,
  onSubmit,
  onCancel,
  isPending,
}: GrupoFormProps) {
  const isEditing = !!grupo;

  const form = useForm<CrearGrupoFormData | EditarGrupoFormData>({
    resolver: zodResolver(isEditing ? editarGrupoSchema : crearGrupoSchema),
    defaultValues: isEditing
      ? {
          codigo: grupo.codigo,
          nombre: grupo.nombre,
          descripcion: grupo.descripcion || "",
          activo: grupo.activo as "S" | "N",
        }
      : {
          codigo: "",
          nombre: "",
          descripcion: "",
        },
  });

  // Resetear el formulario cuando cambia el grupo (para editar)
  useEffect(() => {
    if (grupo) {
      form.reset({
        codigo: grupo.codigo,
        nombre: grupo.nombre,
        descripcion: grupo.descripcion || "",
        activo: grupo.activo as "S" | "N",
      });
    }
  }, [grupo, form]);

  return (
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
                <Input placeholder="ADMIN" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                Código único del grupo (se convertirá a mayúsculas)
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
                  placeholder="Administradores"
                  {...field}
                  disabled={isPending}
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
                  placeholder="Grupo con permisos completos"
                  {...field}
                  disabled={isPending}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado (solo en editar) */}
        {isEditing && (
          <FormField
            control={form.control}
            name="activo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Estado <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
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
        )}

        {/* Acciones */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditing
                ? "Guardando..."
                : "Creando..."
              : isEditing
                ? "Guardar Cambios"
                : "Crear Grupo"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
