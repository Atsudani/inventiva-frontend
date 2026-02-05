"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
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
  solicitarResetSchema,
  type SolicitarResetFormData,
} from "@/lib/schemas/usuarios";
import { recuperacionApi } from "@/lib/api/usuarios";
import Link from "next/link";

export default function RecuperarPasswordPage() {
  const [enviado, setEnviado] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState("");

  const form = useForm<SolicitarResetFormData>({
    resolver: zodResolver(solicitarResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: SolicitarResetFormData) => {
    try {
      await recuperacionApi.solicitar(data);
      setEmailEnviado(data.email);
      setEnviado(true);
    } catch (error: any) {
      // Por seguridad, siempre mostramos que se envió el email
      // incluso si el usuario no existe
      setEmailEnviado(data.email);
      setEnviado(true);
    }
  };

  // Estado: Email enviado
  if (enviado) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-semibold">Email Enviado</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Si existe una cuenta con el email{" "}
            <strong className="text-foreground">{emailEnviado}</strong>,
            recibirás un link para restablecer tu contraseña.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Revisa tu bandeja de entrada y carpeta de spam.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login">Volver al Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Estado: Formulario
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recuperar Contraseña</CardTitle>
        <CardDescription>
          Ingresa tu email y te enviaremos un link para restablecer tu
          contraseña
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="tu.email@example.com"
                        {...field}
                        className="pl-10"
                        disabled={form.formState.isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Enviando..."
                : "Enviar Link de Recuperación"}
            </Button>

            <div className="text-center text-sm">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
