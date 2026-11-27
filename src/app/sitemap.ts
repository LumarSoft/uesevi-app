import type { MetadataRoute } from "next";

const SITIO = "https://uesevi.org.ar";

// Páginas públicas fijas. Las noticias se descubren desde /noticias/page/1.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { path: "", prioridad: 1 },
    { path: "/noticias/page/1", prioridad: 0.8 },
    { path: "/escalas", prioridad: 0.8 },
    { path: "/afiliaciones", prioridad: 0.6 },
    { path: "/contacto", prioridad: 0.5 },
  ].map(({ path, prioridad }) => ({
    url: `${SITIO}${path}`,
    priority: prioridad,
  }));
}
