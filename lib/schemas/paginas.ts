// lib/schemas/paginas.ts

import { z } from "zod";

/**
 * Schema para crear página
 */
export const crearPaginaSchema = z.object({
  moduloId: z
    .number({
      required_error: "Selecciona un módulo",
      invalid_type_error: "Selecciona un módulo válido",
    })
    .int("Selecciona un módulo válido")
    .positive("Selecciona un módulo válido"),

  tipoId: z
    .number({
      required_error: "Selecciona un tipo",
      invalid_type_error: "Selecciona un tipo válido",
    })
    .int("Selecciona un tipo válido")
    .positive("Selecciona un tipo válido"),

  codigo: z
    .string()
    .min(1, "El código es requerido")
    .max(100, "El código no puede exceder 100 caracteres")
    .trim()
    .transform((val) => val.toUpperCase()),

  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(200, "El nombre no puede exceder 200 caracteres")
    .trim(),

  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  ruta: z
    .string()
    .min(1, "La ruta es requerida")
    .max(200, "La ruta no puede exceder 200 caracteres")
    .trim()
    .regex(/^\//, "La ruta debe comenzar con /"),

  icono: z
    .string()
    .max(50, "El icono no puede exceder 50 caracteres")
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

export type CrearPaginaFormData = z.infer<typeof crearPaginaSchema>;

/**
 * Schema para editar página
 */
export const editarPaginaSchema = z.object({
  moduloId: z
    .number({
      required_error: "Selecciona un módulo",
      invalid_type_error: "Selecciona un módulo válido",
    })
    .int("Selecciona un módulo válido")
    .positive("Selecciona un módulo válido"),

  tipoId: z
    .number({
      required_error: "Selecciona un tipo",
      invalid_type_error: "Selecciona un tipo válido",
    })
    .int("Selecciona un tipo válido")
    .positive("Selecciona un tipo válido"),

  codigo: z
    .string()
    .min(1, "El código es requerido")
    .max(100, "El código no puede exceder 100 caracteres")
    .trim()
    .transform((val) => val.toUpperCase()),

  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(200, "El nombre no puede exceder 200 caracteres")
    .trim(),

  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  ruta: z
    .string()
    .min(1, "La ruta es requerida")
    .max(200, "La ruta no puede exceder 200 caracteres")
    .trim()
    .regex(/^\//, "La ruta debe comenzar con /"),

  icono: z
    .string()
    .max(50, "El icono no puede exceder 50 caracteres")
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

export type EditarPaginaFormData = z.infer<typeof editarPaginaSchema>;
