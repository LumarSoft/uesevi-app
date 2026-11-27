import type { MetadataRoute } from "next";

// Los buscadores indexan el sitio público; el panel y el portal de empresas
// piden login y no tienen nada que indexar.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/empresa"] },
    sitemap: "https://uesevi.org.ar/sitemap.xml",
  };
}
