"use client";

import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex items-center justify-center px-2 py-3">
      {isCollapsed ? (
        <Image
          src="/inv-mini.jpeg"
          alt="Inventiva"
          width={24}
          height={24}
          className="rounded"
        />
      ) : (
        <Image
          src="/inv.jpeg"
          alt="Inventiva"
          width={150}
          height={40}
          className="h-auto w-auto max-h-8"
        />
      )}
    </div>
  );
}
