import { z } from "zod";

/**
 * Schema para crear usuario
 */
export const crearUsuarioSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede exceder 120 caracteres")
    .trim(),

  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .max(150, "El email es demasiado largo")
    .toLowerCase()
    .trim(),

  role: z.enum(["ADMIN", "USER"], {
    required_error: "Selecciona un rol",
    invalid_type_error: "Rol inválido",
  }),

  grupoId: z
    .number({
      invalid_type_error: "Selecciona un grupo válido",
    })
    .optional()
    .nullable()
    .transform((val) => (val === 0 ? null : val)), // Convertir 0 a null si es necesario
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
