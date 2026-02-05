"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  cambiarPasswordSchema,
  type CambiarPasswordFormData,
} from "@/lib/schemas/usuarios";
import { passwordApi } from "@/lib/api/usuarios";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export default function CambiarPasswordPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const [exitoso, setExitoso] = useState(false);

  const form = useForm<CambiarPasswordFormData>({
    resolver: zodResolver(cambiarPasswordSchema),
    defaultValues: {
      passwordActual: "",
      passwordNuevo: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: CambiarPasswordFormData) => {
    try {
      await passwordApi.cambiar(data);

      setExitoso(true);
      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido cambiada exitosamente",
      });

      // Limpiar formulario
      form.reset();

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setExitoso(false);
      }, 5000);
    } catch (error: any) {
      const mensaje =
        error.response?.data?.message || "Error al cambiar la contraseña";

      toast.error("Error", {
        description: mensaje,
      });

      // Si la contraseña actual es incorrecta, marcar el campo con error
      if (error.response?.status === 401 || mensaje.includes("incorrecta")) {
        form.setError("passwordActual", {
          type: "manual",
          message: "La contraseña actual es incorrecta",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Cambiar Contraseña
        </h1>
        <p className="text-muted-foreground">
          Actualiza tu contraseña de forma segura
        </p>
      </div>

      {/* Tarjeta de Usuario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Seguridad de la Cuenta
          </CardTitle>
          <CardDescription>
            Estás cambiando la contraseña para:{" "}
            <strong>{usuario?.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Contraseña Actual */}
              <FormField
                control={form.control}
                name="passwordActual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contraseña Actual <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Ingresa tu contraseña actual"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nueva Contraseña */}
              <FormField
                control={form.control}
                name="passwordNuevo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nueva Contraseña <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmar Nueva Contraseña */}
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirmar Nueva Contraseña{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repite tu nueva contraseña"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mensaje de éxito */}
              {exitoso && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>¡Contraseña actualizada exitosamente!</span>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Actualizando..."
                    : "Cambiar Contraseña"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setExitoso(false);
                  }}
                  disabled={form.formState.isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Consejos de Seguridad */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Consejos de Seguridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Usa al menos 8 caracteres</p>
          <p>• Combina letras mayúsculas, minúsculas, números y símbolos</p>
          <p>• No uses información personal fácil de adivinar</p>
          <p>• Evita reutilizar contraseñas de otros servicios</p>
          <p>• Considera usar un gestor de contraseñas</p>
        </CardContent>
      </Card>
    </div>
  );
}
