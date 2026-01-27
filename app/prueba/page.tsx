"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PruebaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-amber-200">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inventiva UI Test</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Si ves esta tarjeta y el botón con estilos, shadcn + Tailwind están
            OK.
          </p>

          <Button className="w-full" onClick={() => alert("¡Funciona!")}>
            Probar botón
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
