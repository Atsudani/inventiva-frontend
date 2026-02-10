"use client";

import * as React from "react";
import { NavMain } from "@/components/layout/nav-main";
// import { NavProjects } from "@/components/layout/nav-projects";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/auth-store";
import { SidebarLogo } from "../ui/sidebar-logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // console.log("🎉Sidebar actual✅:::::::::", data);

  const permisos = useAuthStore((estado) => estado.permisos);
  // console.log(permisos);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain permisos={permisos} /> {/* Este es el arbol de menu */}
        {/* <NavMain items={data.navMain} /> */}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
