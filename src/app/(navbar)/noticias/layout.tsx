import type { Metadata } from "next";

// La página es "use client" y no puede exportar metadata: el título va acá.
// Con `template` las noticias de abajo quedan "Título | UESEVI" (un título
// de texto plano cortaba la plantilla del layout raíz para los hijos).
export const metadata: Metadata = {
  title: { default: "Noticias", template: "%s | UESEVI" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
