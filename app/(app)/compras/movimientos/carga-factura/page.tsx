"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Filter } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function CargasFacturaPage() {
  const tienePermisoCrear = useAuthStore((s) =>
    s.tienePermisoAccion("/compras/movimientos/carga-factura", "crear"),
  );
  console.log(tienePermisoCrear);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cargas de Factura
          </h1>
          <p className="text-muted-foreground">
            Gestiona las cargas de facturas de compras
          </p>
        </div>

        {tienePermisoCrear && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Carga
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aquí irán los filtros de búsqueda...
          </p>
        </CardContent>
      </Card>

      {/* Contenido Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Listado de Cargas
          </CardTitle>
          <CardDescription>
            Últimas cargas de facturas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p>No hay cargas registradas aún.</p>
          </div>
        </CardContent>
      </Card>

      {/* Info de Permisos (temporal, para debug) */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground">
            <strong>Debug:</strong> Permisos en esta ruta:
          </p>
          <ul className="mt-2 text-xs text-muted-foreground space-y-1">
            <li>• Crear: {tienePermisoCrear ? "✅ Sí" : "❌ No"}</li>
            <li>• Ver: ✅ Sí (estás viendo esta página)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
