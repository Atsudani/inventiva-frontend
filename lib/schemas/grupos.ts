// lib/schemas/grupos.ts

import { z } from "zod";

/**
 * Schema para crear grupo
 */
export const crearGrupoSchema = z.object({
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
});

export type CrearGrupoFormData = z.infer<typeof crearGrupoSchema>;

/**
 * Schema para editar grupo
 */
export const editarGrupoSchema = z.object({
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

  activo: z.enum(["S", "N"], {
    required_error: "Selecciona un estado",
  }),
});

export type EditarGrupoFormData = z.infer<typeof editarGrupoSchema>;
