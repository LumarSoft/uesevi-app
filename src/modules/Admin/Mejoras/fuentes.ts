import { Fraunces, JetBrains_Mono } from "next/font/google";

// Tipografías propias del boletín de mejoras: no siguen la del resto del panel
// a propósito, para que la sección se sienta como una publicación.
export const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-boletin",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-boletin-mono",
  display: "swap",
});
