"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/schemas/auth";
import { useChangePassword } from "@/lib/hooks/use-auth";

export default function CambiarPasswordPage() {
  const router = useRouter();
  const changePassword = useChangePassword();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      },
      {
        onSuccess: () => {
          form.reset();
          // Opcionalmente redirigir al perfil después de 2 segundos
          setTimeout(() => {
            router.push("/perfil");
          }, 2000);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cambiar Contraseña
          </h1>
          <p className="text-muted-foreground">
            Actualiza tu contraseña de forma segura
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nueva Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu contraseña actual y elige una nueva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Contraseña Actual */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña Actual</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Tu contraseña actual"
                        {...field}
                        disabled={changePassword.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nueva Contraseña */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        {...field}
                        disabled={changePassword.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmar Nueva Contraseña */}
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repite tu nueva contraseña"
                        {...field}
                        disabled={changePassword.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Acciones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={changePassword.isPending}>
                  {changePassword.isPending
                    ? "Actualizando..."
                    : "Cambiar Contraseña"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={changePassword.isPending}
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
