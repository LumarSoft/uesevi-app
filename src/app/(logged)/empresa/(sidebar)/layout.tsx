import HeaderCompany from "@/shared/components/Header/HeaderCompany";
import Sidebar from "@/shared/components/SidebarCompany/Sidebar";
import { ThemeProvider } from "next-themes";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
