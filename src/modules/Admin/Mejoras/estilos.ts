import type { TipoMejora } from "./mejoras";

// Paleta propia del boletín: papel y tinta, con un rojo de sello para lo nuevo.
// Clases completas (no armadas por partes) para que Tailwind las encuentre.
export const SERIF = "[font-family:var(--font-boletin),Georgia,serif]";
export const MONO = "[font-family:var(--font-boletin-mono),ui-monospace,monospace]";

export const PAPEL = "bg-[#f6f2e9] dark:bg-[#11131a]";
export const TARJETA = "bg-[#fffdf8] dark:bg-[#181b25]";
export const TINTA = "text-[#1b1e2b] dark:text-[#ece6da]";
export const TENUE = "text-[#1b1e2b]/60 dark:text-[#ece6da]/55";
export const LINEA = "border-[#1b1e2b]/15 dark:border-[#ece6da]/15";
export const LINEA_FUERTE = "border-[#1b1e2b] dark:border-[#ece6da]";
export const ROJO = "text-[#c9431c] dark:text-[#ff8a63]";
export const FONDO_ROJO = "bg-[#c9431c] dark:bg-[#ff8a63]";
export const FONDO_TINTA = "bg-[#1b1e2b] dark:bg-[#ece6da]";
export const SOBRE_TINTA = "text-[#f6f2e9] dark:text-[#11131a]";
export const FOCO =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9431c]/60 dark:focus-visible:ring-[#ff8a63]/60";

export const ETIQUETA = `${MONO} text-[11px] uppercase tracking-[0.16em]`;

export const COLOR_TIPO: Record<TipoMejora, { texto: string; punto: string }> = {
  Nuevo: {
    texto: "text-[#17805a] dark:text-[#5fd3a3]",
    punto: "bg-[#17805a] dark:bg-[#5fd3a3]",
  },
  Mejora: {
    texto: "text-[#2a62c9] dark:text-[#86adff]",
    punto: "bg-[#2a62c9] dark:bg-[#86adff]",
  },
  Corrección: {
    texto: "text-[#a8600a] dark:text-[#f0b35e]",
    punto: "bg-[#a8600a] dark:bg-[#f0b35e]",
  },
  Seguridad: {
    texto: "text-[#6e46c5] dark:text-[#b69cff]",
    punto: "bg-[#6e46c5] dark:bg-[#b69cff]",
  },
};
