"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, Search } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function FacturacionPage() {
  const tienePermisoCrear = useAuthStore((s) =>
    s.tienePermisoAccion("/ventas/movimientos/facturacion", "crear"),
  );

  const tienePermisoEditar = useAuthStore((s) =>
    s.tienePermisoAccion("/ventas/movimientos/facturacion", "editar"),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
          <p className="text-muted-foreground">
            Genera y gestiona facturas de venta
          </p>
        </div>

        {tienePermisoCrear && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Button>
        )}
      </div>

      {/* Barra de Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por número de factura, cliente..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline">Buscar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Facturas del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Facturado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₲ 0</div>
            <p className="text-xs text-muted-foreground">
              +0% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Facturas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Por cobrar</p>
          </CardContent>
        </Card>
      </div>

      {/* Listado de Facturas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Últimas Facturas
          </CardTitle>
          <CardDescription>
            Facturas recientes generadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p>No hay facturas registradas aún.</p>
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
            <li>• Editar: {tienePermisoEditar ? "✅ Sí" : "❌ No"}</li>
            <li>• Ver: ✅ Sí (estás viendo esta página)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
