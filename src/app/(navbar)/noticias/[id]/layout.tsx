import type { Metadata } from "next";
import { fetchData } from "@/services/mysql/functions";
import { getCoverImageUrl } from "@/shared/utils/imageUtils";
import { INoticias } from "@/shared/types/Querys/INoticias";

// Al compartir una noticia por WhatsApp (o redes), la vista previa muestra su
// título, su epígrafe y su portada en lugar de los datos genéricos del sitio.
// La página es "use client", por eso se arma acá.

// La vista previa nunca puede trabar la página: si la API tarda o falla, se
// usan los datos generales del sitio.
const ESPERA_MAXIMA_MS = 3000;

const textoPlano = (html: string | undefined, largo: number) => {
  const texto = (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return texto.length > largo ? `${texto.slice(0, largo - 1).trimEnd()}…` : texto;
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = Number(params.id);
  if (!Number.isSafeInteger(id) || id < 1) return {};

  try {
    const respuesta = await Promise.race([
      fetchData(`news/${id}`),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), ESPERA_MAXIMA_MS)),
    ]);
    const noticia: INoticias | null = respuesta?.ok ? respuesta.data : null;
    if (!noticia?.titulo) return {};

    const titulo = textoPlano(noticia.titulo, 110);
    const descripcion =
      textoPlano(noticia.epigrafe, 200) || textoPlano(noticia.cuerpo, 200);
    const portada = getCoverImageUrl(noticia);
    // Sin portada propia, la imagen del sitio (el logo suelto no se ve bien
    // en el formato apaisado de la vista previa).
    const imagen = portada === "/logo_uesevi.png" ? "/og-uesevi.png" : portada;

    return {
      title: titulo,
      description: descripcion || undefined,
      openGraph: {
        type: "article",
        title: titulo,
        description: descripcion || undefined,
        url: `/noticias/${id}`,
        siteName: "UESEVI",
        locale: "es_AR",
        images: [{ url: imagen, alt: titulo }],
      },
      twitter: {
        card: "summary_large_image",
        title: titulo,
        description: descripcion || undefined,
        images: [imagen],
      },
    };
  } catch {
    return {};
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
