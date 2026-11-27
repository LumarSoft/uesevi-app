import type { Metadata } from "next";

// La página es "use client" y no puede exportar metadata: el título va acá.
export const metadata: Metadata = { title: "Afiliaciones" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
