"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { SideNav } from "./Side-Nav";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { NavItemsCompany } from "@/shared/constants/side-nav-company";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative hidden h-screen border-r pt-20 md:block`,
        status && "duration-500",
        isOpen ? "w-72" : "w-[78px]",
        className
      )}
    >
      {/* El alto lo fija el nav (h-screen menos el pt-20 de la cabecera) y acá
          adentro va el scroll: con la barra desplegada y un acordeón abierto la
          lista pasa el alto de la pantalla y antes no había forma de llegar a
          los últimos ítems. El scroll no puede ir en el nav porque recortaría
          la flecha de plegado, que se dibuja fuera de su borde derecho. */}
      <div className="h-full space-y-4 overflow-y-auto py-4 [scrollbar-color:hsl(var(--muted-foreground)/0.35)_transparent] [scrollbar-width:thin]">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <SideNav
              className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
              items={NavItemsCompany}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
