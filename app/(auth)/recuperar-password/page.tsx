"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/schemas/auth";
import { useForgotPassword } from "@/lib/hooks/use-auth";

export default function RecuperarPasswordPage() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();
  const [emailEnviado, setEmailEnviado] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    forgotPassword.mutate(data.email, {
      onSuccess: () => {
        setEmailEnviado(true);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
              <CardDescription>
                Ingresa tu email y te enviaremos un enlace para resetearla
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {emailEnviado ? (
            <Alert className="border-green-500 bg-green-50">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Email enviado! Revisa tu correo y sigue las instrucciones para
                resetear tu contraseña.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          {...field}
                          disabled={forgotPassword.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={forgotPassword.isPending}
                >
                  {forgotPassword.isPending
                    ? "Enviando..."
                    : "Enviar enlace de recuperación"}
                </Button>

                {/* Volver al login */}
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Volver al login
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
