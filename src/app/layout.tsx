import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "UESEVI - Gremio de Empleados de Seguridad y Vigilancia",
  description:
    "UESEVI es el gremio que representa a los empleados de seguridad y vigilancia, ofreciendo noticias, recursos y servicios para sus afiliados.",
  keywords:
    "UESEVI, seguridad, vigilancia, gremio, empleados, sindicato, noticias, recursos, seguridad privada",
  authors: [{ name: "UESEVI", url: "https://tudominio.com" }],
  openGraph: {
    title: "UESEVI - Gremio de Empleados de Seguridad y Vigilancia",
    description:
      "Descubre las últimas noticias, recursos y servicios para los empleados de seguridad y vigilancia a través del gremio UESEVI.",
    url: "https://tudominio.com",
    siteName: "UESEVI",
    images: [
      {
        url: "https://tudominio.com/logo.png",
        width: 800,
        height: 600,
        alt: "Logo de UESEVI",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
