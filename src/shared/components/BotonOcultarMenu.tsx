"use client";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

/**
 * Ocultar / mostrar el menú. Antes era una flecha "←" sobre el borde, que se
 * confundía con "volver atrás"; ahora es el ícono de panel lateral, abajo de
 * todo y con su texto cuando el menú está abierto.
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
    <div className="border-t px-3 py-3">
      <button
        type="button"
        onClick={onClick}
        title={texto}
        aria-label={texto}
        aria-expanded={abierto}
        className="flex h-11 w-full items-center gap-3 overflow-hidden whitespace-nowrap rounded-md px-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icono className="h-5 w-5 shrink-0" aria-hidden />
        {abierto && <span>{texto}</span>}
      </button>
    </div>
  );
}
