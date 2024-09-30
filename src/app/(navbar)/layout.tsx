import Footer from "@/shared/components/Footer/Footer";
import { DropDownNav, Navbar } from "@/shared/components/Navbar/Navbar";
import WspLogo from "@/shared/components/WspLogo/WspLogo";
import { ThemeProvider } from "next-themes";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider forcedTheme="light">
      <main className="overflow-x-hidden">
        <Navbar />
        <DropDownNav />
        {children}
        <WspLogo />
        <Footer />
      </main>
    </ThemeProvider>
  );
}
