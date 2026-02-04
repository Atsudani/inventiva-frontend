import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AuthProvider } from "@/lib/auth-provider";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumbs } from "@/components/layout/dynamic-breadcrumbs";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* <header className="flex h-14 items-center gap-2 border-b px-4 bg-gray-50">
            <SidebarTrigger />
            <div className="text-sm font-medium">Inventiva</div>
          </header> */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-gray-50">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs />
          </header>

          <main className="p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
