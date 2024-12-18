import { ProtectedRouteAdmin } from "@/app/validateAuthAdmin";
import Header from "@/shared/components/Header/Header";
import Sidebar from "@/shared/components/SidebarAdmin/Sidebar";
import { ThemeProvider } from "next-themes";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRouteAdmin>
      <ThemeProvider attribute="class" defaultTheme="system">
        <Header />
        <div className="flex h-screen border-collapse overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden pt-16 bg-secondary/10 pb-1">
            {children}
          </main>
        </div>
      </ThemeProvider>
    </ProtectedRouteAdmin>
  );
}
