"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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
  activarCuentaSchema,
  type ActivarCuentaFormData,
} from "@/lib/schemas/usuarios";
import { activacionApi } from "@/lib/api/usuarios";
import Link from "next/link";
import { toast } from "sonner";

type EstadoPagina =
  | "validando"
  | "valido"
  | "invalido"
  | "procesando"
  | "exitoso"
  | "error";

export default function ActivarCuentaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [estado, setEstado] = useState<EstadoPagina>("validando");
  const [datosUsuario, setDatosUsuario] = useState<{
    email: string;
    nombre: string;
  } | null>(null);
  const [mensaje, setMensaje] = useState("");

  const form = useForm<ActivarCuentaFormData>({
    resolver: zodResolver(activarCuentaSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  // Validar token al cargar
  useEffect(() => {
    if (!token) {
      setEstado("invalido");
      setMensaje("Token de activación no proporcionado");
      return;
    }

    validarToken();
  }, [token]);

  const validarToken = async () => {
    try {
      const response = await activacionApi.validarToken(token!);

      if (response.valido && response.email && response.nombre) {
        setEstado("valido");
        setDatosUsuario({
          email: response.email,
          nombre: response.nombre,
        });
      } else {
        setEstado("invalido");
        setMensaje(
          response.mensaje ||
            "El token de activación es inválido o ha expirado",
        );
      }
    } catch (error) {
      setEstado("invalido");
      setMensaje("El token de activación es inválido o ha expirado");
    }
  };

  const onSubmit = async (data: ActivarCuentaFormData) => {
    if (!token) return;

    setEstado("procesando");

    try {
      await activacionApi.activarCuenta({
        token,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });

      setEstado("exitoso");
      toast.success("¡Cuenta activada!", {
        description: "Redirigiendo al login...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setEstado("error");
      setMensaje(error.response?.data?.message || "Error al activar la cuenta");
      toast.error("Error", {
        description:
          error.response?.data?.message || "Error al activar la cuenta",
      });
    }
  };

  // Estado: Validando token
  if (estado === "validando") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Validando token...</p>
        </CardContent>
      </Card>
    );
  }

  // Estado: Token inválido
  if (estado === "invalido") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Token Inválido</h2>
          <p className="mt-2 text-center text-muted-foreground">{mensaje}</p>
          <Button asChild className="mt-6">
            <Link href="/login">Ir al Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Estado: Activación exitosa
  if (estado === "exitoso") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-semibold">¡Cuenta Activada!</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Tu cuenta ha sido activada exitosamente.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Redirigiendo al login...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Estado: Formulario de activación
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Activar Cuenta</CardTitle>
        <CardDescription>
          Bienvenido, <strong>{datosUsuario?.nombre}</strong>. Crea tu
          contraseña para activar tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email (solo lectura) */}
            <div className="space-y-2">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={datosUsuario?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      {...field}
                      disabled={estado === "procesando"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirmar Contraseña */}
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repite tu contraseña"
                      {...field}
                      disabled={estado === "procesando"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mensaje de error */}
            {estado === "error" && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {mensaje}
              </div>
            )}

            {/* Botón */}
            <Button
              type="submit"
              className="w-full"
              disabled={estado === "procesando"}
            >
              {estado === "procesando" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activando...
                </>
              ) : (
                "Activar Cuenta"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
