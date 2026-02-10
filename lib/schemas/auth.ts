// lib/schemas/auth.ts

import { z } from "zod";

/**
 * Schema para setup de password
 */
export const setupPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña es demasiado larga")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Debe contener al menos una mayúscula, una minúscula y un número",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type SetupPasswordFormData = z.infer<typeof setupPasswordSchema>;

/**
 * Schema para solicitar reset de password
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema para reset de password
 * Reutiliza la misma validación que setup
 */
export const resetPasswordSchema = setupPasswordSchema;
export type ResetPasswordFormData = SetupPasswordFormData;

/**
 * Schema para cambiar contraseña (usuario logueado)
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),

    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(80, "La contraseña es demasiado larga")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Debe contener al menos una mayúscula, una minúscula y un número",
      ),

    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
