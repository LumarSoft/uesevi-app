import { Suspense } from "react";
import { notFound } from "next/navigation";
import NoticiasPageModule from "@/modules/Client/noticias";
import { fetchData } from "@/services/mysql/functions";
import Loading from "./Loading";

export default function NoticiasPage({
  params: { page },
}: {
  params: { page: string };
}) {
  const pagina = Number(page);
  // Igual que la API: sólo enteros desde 1. Un link viejo a /noticias/page/0
  // (el "Anterior" de la primera página lo generaba) da 404 en vez de pedirle
  // a la API una página que no existe.
  if (!Number.isSafeInteger(pagina) || pagina < 1) notFound();

  return (
    <Suspense fallback={<Loading />}>
      <AsyncNewsContent page={pagina} />
    </Suspense>
  );
}

async function AsyncNewsContent({ page }: { page: number }) {
  async function loadNews() {
    const newsResponse = await fetchData(`news/client/${page}`);

    if (!newsResponse.ok || newsResponse.error) {
      console.error("Error al obtener las noticias:", newsResponse.error);
      return { noticias: [], totalPages: 0 };
    }

    // Simulación de retraso
    await new Promise((resolve) => setTimeout(resolve, 1500));


    return newsResponse.data;
  }

  const news = await loadNews();

  return (
    <NoticiasPageModule
      news={news.noticias}
      totalPages={news.totalPages}
      currentPage={page}
    />
  );
}
