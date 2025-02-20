import { Suspense } from "react";
import NoticiasPageModule from "@/modules/Client/noticias";
import { fetchData } from "@/services/mysql/functions";
import Loading from "./Loading";

export default function NoticiasPage({
  params: { page },
}: {
  params: { page: number };
}) {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncNewsContent page={Number(page)} />
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
