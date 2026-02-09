"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  setupPasswordSchema,
  type SetupPasswordFormData,
} from "@/lib/schemas/auth";
import { useSetupPassword } from "@/lib/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SetupPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  const setupPassword = useSetupPassword();

  const form = useForm<SetupPasswordFormData>({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    console.log("🔍 Token from URL:", tokenFromUrl);
    console.log("🔍 Search params:", searchParams.toString());

    if (!tokenFromUrl) {
      console.log("❌ No token found, redirecting to login");

      router.push("/login");
    } else {
      console.log("✅ Token found, setting it");

      setToken(tokenFromUrl);
    }
  }, [searchParams, router]);

  const onSubmit = async (data: SetupPasswordFormData) => {
    if (!token) return;

    setupPassword.mutate(
      {
        token,
        password: data.password,
      },
      {
        onSuccess: () => {
          // Esperar 2 segundos y redirigir al login
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
      },
    );
  };

  if (!token) {
    return null; // O un spinner
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configurar Contraseña</CardTitle>
          <CardDescription>
            Crea una contraseña segura para tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {setupPassword.isSuccess ? (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Contraseña configurada! Redirigiendo al login...
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          {...field}
                          disabled={setupPassword.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repite tu contraseña"
                          {...field}
                          disabled={setupPassword.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error Alert */}
                {setupPassword.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      El token puede haber expirado o ser inválido. Solicita un
                      nuevo enlace.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={setupPassword.isPending}
                >
                  {setupPassword.isPending
                    ? "Configurando..."
                    : "Configurar Contraseña"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
