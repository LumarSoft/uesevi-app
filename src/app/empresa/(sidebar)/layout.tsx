"use client";
import HeaderCompany from "@/shared/components/Header/HeaderCompany";
import Sidebar from "@/shared/components/SidebarCompany/Sidebar";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  isAuthenticatedWithRole,
  clearAuthToken,
} from "@/shared/utils/tokenUtils";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticatedWithRole("empresa")) {
      clearAuthToken();
      router.replace("/loginempresa");
      return;
    }
  }, [router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <HeaderCompany />
      <div className="flex h-screen border-collapse overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden pt-16 bg-secondary/10 pb-1">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
