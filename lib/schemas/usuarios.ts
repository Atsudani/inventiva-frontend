import { z } from "zod";

/**
 * Schema para crear usuario
 */
export const crearUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre es demasiado largo")
    .trim(),

  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .toLowerCase()
    .trim(),

  role: z.enum(["admin", "user"], {
    required_error: "Selecciona un rol",
    invalid_type_error: "Rol inválido",
  }),

  grupo: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)), // Convertir string vacío a null
});

/**
 * Tipo inferido del schema
 */
export type CrearUsuarioFormData = z.infer<typeof crearUsuarioSchema>;

/**
 * Schema para cambiar contraseña
 */
export const cambiarPasswordSchema = z
  .object({
    passwordActual: z.string().min(1, "Ingresa tu contraseña actual"),

    passwordNuevo: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),

    passwordConfirm: z.string().min(1, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.passwordNuevo === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
  });

export type CambiarPasswordFormData = z.infer<typeof cambiarPasswordSchema>;

/**
 * Schema para activar cuenta
 */
export const activarCuentaSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),

    passwordConfirm: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
  });

export type ActivarCuentaFormData = z.infer<typeof activarCuentaSchema>;

/**
 * Schema para solicitar reset de contraseña
 */
export const solicitarResetSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .toLowerCase()
    .trim(),
});

export type SolicitarResetFormData = z.infer<typeof solicitarResetSchema>;
