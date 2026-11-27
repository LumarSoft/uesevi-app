"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BotonOcultarMenu } from "@/shared/components/BotonOcultarMenu";
import { SideNav } from "./Side-Nav";
import { NavItemsAdmin } from "@/shared/constants/side-nav-admin";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { fetchData } from "@/services/mysql/functions";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const [CountCompaniesPending, setCountCompaniesPending] = useState(0);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  useEffect(() => {
    const companiesInPending = async () => {
      const response = await fetchData("companies/inPending");
      if (response.ok) {
        setCountCompaniesPending(response.data.cantidad);
      }
    };

    companiesInPending();
  }, []);

  return (
    // pt-16 = alto del header fijo, y nada más: antes había ~50 px vacíos
    // arriba de Dashboard.
    <nav
      className={cn(
        `relative hidden h-screen flex-col border-r pt-16 md:flex`,
        status && "duration-500",
        isOpen ? "w-72" : "w-[78px]",
        className
      )}
    >
      {/* El nav mide lo que la pantalla y el layout corta lo que sobra
          (overflow-hidden): sin un contenedor con scroll propio, al abrir un
          desplegable los últimos ítems quedaban afuera y no había forma de
          llegar a ellos. El botón de ocultar queda fuera de este contenedor,
          fijo abajo.
          Colapsado no scrollea: las etiquetas que aparecen al pasar el mouse
          se dibujan por fuera del ancho del nav, y un contenedor con scroll
          vertical también recorta en horizontal. */}
      <div
        className={cn(
          "min-h-0 flex-1",
          isOpen && "overflow-y-auto overscroll-contain [scrollbar-width:thin]"
        )}
      >
        <div className="space-y-1 px-3 py-3">
          <SideNav
            className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
            items={NavItemsAdmin}
            CountCompaniesPending={CountCompaniesPending}
          />
        </div>
      </div>
      <BotonOcultarMenu abierto={isOpen} onClick={handleToggle} />
    </nav>
  );
}
