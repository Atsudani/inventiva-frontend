// lib/schemas/tipo-paginas.ts

import { z } from "zod";

/**
 * Schema para crear tipo de página
 */
export const crearTipoPaginaSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es requerido")
    .max(50, "El código no puede exceder 50 caracteres")
    .trim()
    .transform((val) => val.toUpperCase()),

  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),

  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  icono: z
    .string()
    .max(30, "El icono no puede exceder 30 caracteres")
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  orden: z
    .number({
      invalid_type_error: "El orden debe ser un número",
    })
    .int("El orden debe ser un número entero")
    .min(0, "El orden no puede ser negativo")
    .optional()
    .default(0),
});

export type CrearTipoPaginaFormData = z.infer<typeof crearTipoPaginaSchema>;

/**
 * Schema para editar tipo de página
 */
export const editarTipoPaginaSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es requerido")
    .max(50, "El código no puede exceder 50 caracteres")
    .trim()
    .transform((val) => val.toUpperCase()),

  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),

  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  icono: z
    .string()
    .max(30, "El icono no puede exceder 30 caracteres")
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  orden: z
    .number({
      invalid_type_error: "El orden debe ser un número",
    })
    .int("El orden debe ser un número entero")
    .min(0, "El orden no puede ser negativo"),

  activo: z.enum(["S", "N"], {
    required_error: "Selecciona un estado",
  }),
});

export type EditarTipoPaginaFormData = z.infer<typeof editarTipoPaginaSchema>;
