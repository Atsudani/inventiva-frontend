"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import axios from "axios";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1) Login (cookie se setea automáticamente)
      await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      // 2) Traer datos del usuario (cookie se envía automáticamente)
      const meRes = await api.get("/auth/me");

      // 3) Guardar usuario y permisos en el store
      setAuth({
        usuario: meRes.data.usuario,
        permisos: meRes.data.permisos || [],
      });

      // 4) Redirigir al dashboard
      router.push("/");
    } catch (err: unknown) {
      console.error("Error en login:", err);

      if (axios.isAxiosError(err)) {
        const statusCode = err.response?.status;
        const message = err.response?.data?.message;

        if (statusCode === 401) {
          setError("Email o contraseña incorrectos");
        } else if (Array.isArray(message)) {
          setError(message.join(", "));
        } else if (typeof message === "string") {
          setError(message);
        } else {
          setError("Error al iniciar sesión. Intente nuevamente.");
        }
      } else {
        setError("Error de conexión. Verifique su conexión a internet.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                {/* <h2 className=" text-2xl font-thin text-green-800">
                  Sociedad Cooperativa Pirapo Agr. Ltda.
                </h2> */}
                <h2 className="text-2xl font-bold">Bienvenido</h2>
                <p className="text-muted-foreground text-balance">
                  Ingresa a tu cuenta de Inventiva
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="correo@pirapo.coop.py"
                  required
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                    tabIndex={-1}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Ingresando..." : "Iniciar Sesión"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                ¿No tienes una cuenta?{" "}
                <a href="#" className="underline">
                  Contacta al administrador
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* <div className="bg-muted relative hidden md:block">
            <Image
              src="/logo2.svg"
              alt="Cooperativa Pirapo"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div> */}
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/soja.jpg"
              alt="Cooperativa Pirapo"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs">
        Al continuar, aceptas nuestros{" "}
        <a href="#" className="underline">
          Términos de Servicio
        </a>{" "}
        y{" "}
        <a href="#" className="underline">
          Política de Privacidad
        </a>
        .
      </FieldDescription>
    </div>
  );
}
