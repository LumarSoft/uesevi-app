"use client";
import HeaderCompany from "@/shared/components/Header/HeaderCompany";
import Sidebar from "@/shared/components/SidebarCompany/Sidebar";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  isAuthenticatedWithRole,
  isTokenExpired,
  clearAuthToken,
} from "@/shared/utils/tokenUtils";
import { userStore } from "@/shared/stores/userStore";
import { marcarSesionVencida } from "@/shared/utils/sesionVencida";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    // Se mira antes del chequeo, que borra el token vencido: si había sesión y
    // venció, el login avisa en lugar de aparecer sin explicación.
    const token = userStore.getState().token;
    const sesionVencida = Boolean(token) && isTokenExpired(token as string);
    if (!isAuthenticatedWithRole("empresa")) {
      if (sesionVencida) marcarSesionVencida();
      clearAuthToken();
      router.replace("/loginempresa");
      return;
    }
  }, [router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <HeaderCompany />
      {/* pt-16 = header fijo. El espacio lo deja este contenedor y no el
          <main>: si no, el main scrolleaba desde y=0 y la barra de scroll
          (y el contenido) se metían debajo del header. */}
      <div className="flex h-screen border-collapse overflow-hidden pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-secondary/10 pb-1">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
