import { DropDownNav, Navbar } from "@/shared/components/Navbar/Navbar";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <DropDownNav />
      {children}
    </main>
  );
}
