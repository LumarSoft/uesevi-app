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

// Dominio real del sitio: resuelve las rutas relativas de las imágenes de
// vista previa. Antes apuntaba a "tudominio.com" (un valor de plantilla) y al
// compartir un link por WhatsApp no aparecía ninguna imagen.
const SITIO = "https://uesevi.org.ar";
const DESCRIPCION =
  "UESEVI es el gremio que representa a los empleados de seguridad y vigilancia, ofreciendo noticias, recursos y servicios para sus afiliados.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "UESEVI - Gremio de Empleados de Seguridad y Vigilancia",
    // Las páginas que definen su título quedan "Escalas salariales | UESEVI".
    template: "%s | UESEVI",
  },
  description: DESCRIPCION,
  keywords:
    "UESEVI, seguridad, vigilancia, gremio, empleados, sindicato, noticias, recursos, seguridad privada",
  authors: [{ name: "UESEVI", url: SITIO }],
  openGraph: {
    title: "UESEVI - Gremio de Empleados de Seguridad y Vigilancia",
    description:
      "Descubre las últimas noticias, recursos y servicios para los empleados de seguridad y vigilancia a través del gremio UESEVI.",
    url: SITIO,
    siteName: "UESEVI",
    images: [
      {
        // 1200×630: el tamaño que WhatsApp, Facebook y LinkedIn muestran grande.
        url: "/og-uesevi.png",
        width: 1200,
        height: 630,
        alt: "Logo de UESEVI",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-uesevi.png"],
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
