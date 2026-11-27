"use client";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

/**
 * Ocultar / mostrar el menú lateral. Va en el mismo lugar de siempre (arriba,
 * sobre el borde derecho del menú: la gente ya lo busca ahí), pero con el
 * ícono de panel lateral en lugar de la flecha "←", que se confundía con
 * "volver atrás". Se dibuja por fuera del contenedor con scroll del menú para
 * que no lo recorte.
 */
export function BotonOcultarMenu({
  abierto,
  onClick,
}: {
  abierto: boolean;
  onClick: () => void;
}) {
  const texto = abierto ? "Ocultar menú" : "Mostrar menú";
  const Icono = abierto ? PanelLeftClose : PanelLeftOpen;
  return (
    <button
      type="button"
      onClick={onClick}
      title={texto}
      aria-label={texto}
      aria-expanded={abierto}
      className="absolute -right-3.5 top-20 z-20 flex h-7 w-7 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icono className="h-4 w-4" aria-hidden />
    </button>
  );
}
