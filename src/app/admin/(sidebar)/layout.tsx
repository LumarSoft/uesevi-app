"use client";
import Header from "@/shared/components/Header/Header";
import Sidebar from "@/shared/components/SidebarAdmin/Sidebar";
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
    if (!isAuthenticatedWithRole("admin")) {
      if (sesionVencida) marcarSesionVencida();
      clearAuthToken();
      router.replace("/admin/login");
      return;
    }
  }, [router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Header />
      <div className="flex h-screen border-collapse overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden pt-16 bg-secondary/10 pb-1">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
