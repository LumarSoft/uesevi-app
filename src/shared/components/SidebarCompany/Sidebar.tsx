"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { SideNav } from "./Side-Nav";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { NavItemsCompany } from "@/shared/constants/side-nav-company";
import { BotonOcultarMenu } from "@/shared/components/BotonOcultarMenu";

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
    // Mismo armado que el del panel (SidebarAdmin/Sidebar.tsx): ocupa el alto
    // que deja el header y el botón de ocultar va arriba, sobre el borde. El portal tenía
    // la función de colapsar pero ningún botón: si quedaba colapsado no había
    // cómo abrirlo.
    <nav
      className={cn(
        `relative hidden h-full flex-col border-r md:flex`,
        status && "duration-500",
        isOpen ? "w-72" : "w-[78px]",
        className
      )}
    >
      <BotonOcultarMenu abierto={isOpen} onClick={handleToggle} />
      <div className="min-h-0 flex-1">
        <div className="space-y-1 px-3 py-3">
          <SideNav
            className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
            items={NavItemsCompany}
          />
        </div>
      </div>
    </nav>
  );
}
