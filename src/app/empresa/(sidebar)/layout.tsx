import HeaderCompany from "@/shared/components/Header/HeaderCompany";
import Sidebar from "@/shared/components/SidebarCompany/Sidebar";
import { ThemeProvider } from "next-themes";
import Mantenimiento from "@/shared/components/mantenimiento";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Mantenimiento />
    </ThemeProvider>
  );
}
