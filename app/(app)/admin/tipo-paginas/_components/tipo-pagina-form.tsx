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
  crearTipoPaginaSchema,
  editarTipoPaginaSchema,
  type CrearTipoPaginaFormData,
  type EditarTipoPaginaFormData,
} from "@/lib/schemas/tipo-paginas";
import type { TipoPagina } from "@/lib/types/tipo-paginas";

interface TipoPaginaFormProps {
  tipoPagina?: TipoPagina;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function TipoPaginaForm({
  tipoPagina,
  onSubmit,
  onCancel,
  isPending,
}: TipoPaginaFormProps) {
  const isEditing = !!tipoPagina;

  const form = useForm<CrearTipoPaginaFormData | EditarTipoPaginaFormData>({
    resolver: zodResolver(
      isEditing ? editarTipoPaginaSchema : crearTipoPaginaSchema,
    ),
    defaultValues: isEditing
      ? {
          codigo: tipoPagina.codigo,
          nombre: tipoPagina.nombre,
          descripcion: tipoPagina.descripcion || "",
          icono: tipoPagina.icono || "",
          orden: tipoPagina.orden,
          activo: tipoPagina.activo as "S" | "N",
        }
      : {
          codigo: "",
          nombre: "",
          descripcion: "",
          icono: "",
          orden: 0,
        },
  });

  // Resetear el formulario cuando cambia el tipo de página (para editar)
  useEffect(() => {
    if (tipoPagina) {
      form.reset({
        codigo: tipoPagina.codigo,
        nombre: tipoPagina.nombre,
        descripcion: tipoPagina.descripcion || "",
        icono: tipoPagina.icono || "",
        orden: tipoPagina.orden,
        activo: tipoPagina.activo as "S" | "N",
      });
    }
  }, [tipoPagina, form]);

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
                <Input
                  placeholder="DEFINICIONES"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Código único del tipo (se convertirá a mayúsculas)
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
                  placeholder="Definiciones"
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
                  placeholder="Páginas de definiciones y configuraciones"
                  {...field}
                  disabled={isPending}
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
                <Input placeholder="Settings" {...field} disabled={isPending} />
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
                  disabled={isPending}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? 0 : parseInt(e.target.value),
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
                : "Crear Tipo de Página"}
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
