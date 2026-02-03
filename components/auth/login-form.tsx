"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Empresa {
  codigo: string;
  descripcion: string;
  nombreCorto: string;
  ruc: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string>("");
  const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(true);

  //Cargar empresas cuando abro la pagina.
  useEffect(() => {
    async function loadEmpresas() {
      try {
        const response = await api.get("/empresas");
        setEmpresas(response.data);
      } catch (error) {
        console.error("Error al cargar empresas:", error);
        setError("Error al cargar las empresas disponibles");
      } finally {
        setIsLoadingEmpresas(false);
      }
    }

    loadEmpresas();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor inrese email y contraseña");
      return;
    }

    if (!empresaSeleccionada) {
      setError("Por favor seleccione una empresa");
      return;
    }

    setLoading(true);

    try {
      // 1) Login (cookie se setea automáticamente)
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
        codEmpresa: empresaSeleccionada,
      });

      // Guardar TODA la información en el store
      setAuth({
        usuario: response.data.usuario,
        empresa: response.data.empresa,
        sector: response.data.sector,
        sucursal: response.data.sucursal,
        sectoresDisponibles: response.data.sectoresDisponibles,
        permisos: response.data.permisos || [],
      });

      console.log("✅ Login exitoso con contexto:", {
        empresa: response.data.empresa.nombre,
        sector: response.data.sector.nombre,
        sucursal: response.data.sucursal.nombre,
      });

      // Redirigir al dashboard
      router.push("/");
      // window.location.href = "/";

      // // 2) Traer datos del usuario (cookie se envía automáticamente)
      // const meRes = await api.get("/auth/me");

      // console.log(meRes);

      // // 3) Guardar usuario y permisos en el store
      // setAuth({
      //   usuario: meRes.data.usuario,
      //   permisos: meRes.data.permisos || [],
      // });

      // // 4) Redirigir al dashboard
      // router.push("/");
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
      {/* Logo Inventiva */}
      <div className="flex justify-center">
        <Image
          src="/inventiva-logo.jpeg"
          alt="Inventiva"
          width={180}
          height={60}
          priority
          className="h-auto w-auto max-h-16"
        />
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
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
                <FieldLabel htmlFor="empresa">Empresa</FieldLabel>
                <Select
                  value={empresaSeleccionada}
                  onValueChange={setEmpresaSeleccionada}
                  disabled={loading || isLoadingEmpresas}
                >
                  <SelectTrigger id="empresa">
                    <SelectValue
                      placeholder={
                        isLoadingEmpresas
                          ? "Cargando empresas..."
                          : "Seleccione una empresa"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresita) => (
                      <SelectItem
                        key={empresita.codigo}
                        value={empresita.codigo}
                      >
                        {empresita.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* <FieldDescription className="px-6 text-center text-xs">
        Al continuar, aceptas nuestros{" "}
        <a href="#" className="underline">
          Términos de Servicio
        </a>{" "}
        y{" "}
        <a href="#" className="underline">
          Política de Privacidad
        </a>
        .
      </FieldDescription> */}

      {/* Tech Stack Footer */}
      {/* <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs">Powered by</span>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1" title="TypeScript">
            <svg className="h-6 w-6" viewBox="0 0 256 256">
              <rect fill="#3178C6" width="256" height="256" rx="20" />
              <path
                d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.62-4.689 3.93-10.486 3.93-17.391 0-5.006-.749-9.394-2.246-13.163a30.75 30.75 0 0 0-6.479-10.055c-2.821-2.935-6.205-5.567-10.149-7.898-3.945-2.33-8.394-4.531-13.347-6.602-3.628-1.497-6.881-2.949-9.761-4.359-2.879-1.41-5.327-2.848-7.342-4.316-2.016-1.467-3.571-3.021-4.665-4.661-1.094-1.64-1.641-3.495-1.641-5.567 0-1.899.489-3.61 1.468-5.135s2.362-2.834 4.147-3.927c1.785-1.094 3.973-1.942 6.565-2.547 2.591-.604 5.471-.906 8.638-.906 2.304 0 4.737.173 7.299.518 2.563.345 5.14.877 7.732 1.597a53.7 53.7 0 0 1 7.558 2.719 41.7 41.7 0 0 1 6.781 3.797v-25.807c-4.204-1.611-8.797-2.805-13.778-3.582-4.981-.777-10.697-1.165-17.147-1.165-6.565 0-12.784.705-18.658 2.115-5.874 1.409-11.043 3.61-15.506 6.602-4.463 2.993-7.99 6.805-10.582 11.437-2.591 4.632-3.887 10.17-3.887 16.615 0 8.228 2.375 15.248 7.127 21.06 4.751 5.811 11.963 10.731 21.638 14.759a291 291 0 0 1 10.625 4.575c3.283 1.496 6.119 3.049 8.509 4.66 2.39 1.611 4.276 3.366 5.658 5.265 1.382 1.899 2.073 4.057 2.073 6.474a9.9 9.9 0 0 1-1.296 4.963c-.863 1.524-2.174 2.848-3.93 3.97-1.756 1.122-3.945 1.999-6.565 2.632-2.62.633-5.687.95-9.2.95-5.989 0-11.92-1.05-17.794-3.151-5.875-2.1-11.317-5.25-16.327-9.451Zm-46.036-68.733H140V109H41v22.742h35.345V233h28.137z"
                fill="#FFF"
              />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-1" title="Oracle">
            <svg className="h-6 w-6" viewBox="0 0 256 166">
              <path
                d="M82.553 0C36.963 0 0 36.963 0 82.56c0 45.603 36.963 82.56 82.553 82.56h90.894c45.59 0 82.553-36.957 82.553-82.56C256 36.963 219.037 0 173.447 0H82.553Zm90.894 138.231H82.553c-30.684 0-55.665-24.988-55.665-55.671 0-30.684 24.981-55.672 55.665-55.672h90.894c30.69 0 55.665 24.988 55.665 55.672 0 30.683-24.975 55.671-55.665 55.671Z"
                fill="#C74634"
              />
            </svg>
          </div>
        </div>
      </div> */}

      {/* Tech Stack Footer */}
      <div className="flex flex-col items-center gap-4 text-muted-foreground mt-2 mb-6">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-60">
          Tecnología Cooperativa
        </span>
        <div className="flex items-center gap-7 saturate-0 opacity-50 hover:saturate-100 hover:opacity-100 transition-all duration-500 ease-in-out">
          {/* Next.js */}
          <div className="w-6 h-6" title="Next.js">
            <svg viewBox="0 0 128 128" className="w-full h-full">
              <path
                d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.4v36.6h-6.8V41.8h6.8l50.5 65.8c4.8-10.3 7.5-21.6 7.5-33.6 0-35.3-28.7-64-64-64zm32.2 41.8H89.4v30.5l6.8 8.8V41.8z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* TypeScript */}
          <div className="w-5 h-5" title="TypeScript">
            <svg viewBox="0 0 256 256" className="w-full h-full">
              <rect fill="#3178C6" width="256" height="256" rx="20" />
              <path
                d="M150.5 200.5v27.6c4.5 2.3 9.8 4 15.9 5.2 6.1 1.2 12.6 1.7 19.4 1.7 6.6 0 12.9-.6 18.9-1.9 6-1.3 11.2-3.4 15.7-6.3 4.5-2.9 8-6.7 10.7-11.4 2.6-4.7 3.9-10.5 3.9-17.4 0-5-.7-9.4-2.2-13.2a30.8 30.8 0 0 0-6.5-10.1c-2.8-2.9-6.2-5.6-10.1-7.9-3.9-2.3-8.4-4.5-13.3-6.6-3.6-1.5-6.9-2.9-9.8-4.4-2.9-1.4-5.3-2.8-7.3-4.3-2-1.5-3.6-3-4.7-4.7-1.1-1.6-1.6-3.5-1.6-5.6 0-1.9.5-3.6 1.5-5.1.9-1.5 2.3-2.8 4.1-3.9 1.8-1.1 4-1.9 6.6-2.5 2.6-.6 5.5-.9 8.6-.9 2.3 0 4.7.2 7.3.5 2.6.3 5.1.9 7.7 1.6 2.6.7 5.1 1.6 7.6 2.7 2.5 1.1 4.7 2.4 6.8 3.8v-25.8c-4.2-1.6-8.8-2.8-13.8-3.6-5-.8-10.7-1.2-17.1-1.2-6.6 0-12.8.7-18.7 2.1-5.9 1.4-11 3.6-15.5 6.6-4.5 3-8 6.8-10.6 11.4-2.6 4.6-3.9 10.2-3.9 16.6 0 8.2 2.4 15.2 7.1 21.1 4.8 5.8 12 10.7 21.6 14.8 3.3 1.4 6.8 2.9 10.6 4.6 3.3 1.5 6.1 3 8.5 4.7 2.4 1.6 4.3 3.4 5.7 5.3 1.4 1.9 2.1 4 2.1 6.5 0 1.9-.4 3.6-1.3 5-.9 1.5-2.2 2.8-3.9 4-1.8 1.1-3.9 2-6.6 2.6-2.6.6-5.7 1-9.2 1-6 0-11.9-1.1-17.8-3.2-5.9-2.1-11.3-5.3-16.3-9.5l-2.6 27.6h0zM41 109v22.7h35.3V233h28.1V131.7H140V109H41z"
                fill="#FFF"
              />
            </svg>
          </div>

          {/* Zustand (Oso) */}
          <div className="w-7 h-7" title="Zustand">
            <svg viewBox="0 0 54 44" className="w-full h-full">
              <path
                d="M27 0c-4.8 0-9.2 2.2-12.1 5.7C12.1 4 8.6 3 5 3 2.2 3 0 5.2 0 8c0 3.3 2.7 6 6 6 .4 0 .8 0 1.1-.1C7.4 17.5 10.6 20 14.4 20c.6 0 1.1 0 1.6-.1 1.7 4.1 5.7 7.1 10.5 7.1h1c4.8 0 8.8-3 10.5-7.1.5.1 1 .1 1.6.1 3.8 0 7-2.5 7.3-6.1.3.1.7.1 1.1.1 3.3 0 6-2.7 6-6 0-2.8-2.2-5-5-5-3.6 0-7.1 1-9.9 2.7C36.2 2.2 31.8 0 27 0z"
                fill="currentColor"
              />
              <circle cx="18" cy="12" r="2" fill="currentColor" />
              <circle cx="36" cy="12" r="2" fill="currentColor" />
              <path
                d="M22 16c0 1.1 2.2 2 5 2s5-.9 5-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* NestJS */}
          <div className="w-6 h-6" title="NestJS">
            <svg viewBox="0 0 128 128" className="w-full h-full">
              <path
                d="M128 64c0 35.3-28.7 64-64 64S0 99.3 0 64 28.7 0 64 0s64 28.7 64 64z"
                fill="#E0234E"
              />
              <path
                d="M96.7 89.9L64 33.3 31.3 89.9h12.6l20.1-34.8 20.1 34.8H96.7z"
                fill="#FFF"
              />
            </svg>
          </div>

          {/* Oracle */}
          <div className="w-11 h-5" title="Oracle DB">
            <svg viewBox="0 0 256 166" className="w-full h-full">
              <path
                d="M82.553 0C36.963 0 0 36.963 0 82.56c0 45.603 36.963 82.56 82.553 82.56h90.894c45.59 0 82.553-36.957 82.553-82.56C256 36.963 219.037 0 173.447 0H82.553Zm90.894 138.231H82.553c-30.684 0-55.665-24.988-55.665-55.671 0-30.684 24.981-55.672 55.665-55.672h90.894c30.69 0 55.665 24.988 55.665 55.672 0 30.683-24.975 55.671-55.665 55.671Z"
                fill="#C74634"
              />
            </svg>
          </div>
        </div>
        <p className="text-[9px] font-medium opacity-40">
          ERP Inventiva v12c Refactor
        </p>
      </div>
    </div>
  );
}
