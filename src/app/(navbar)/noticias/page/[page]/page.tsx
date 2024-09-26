import NoticiasPageModule from "@/modules/Client/noticias";
import { fetchData } from "@/services/mysql/functions";

export default async function NoticiasPage({
  params: { page },
}: {
  params: { page: number };
}) {
  const newsResponse = await fetchData(`news/client/${page}`);

  if (!newsResponse.ok || newsResponse.error) {
    console.error("Error al obtener las noticias:", newsResponse.error);
    return <div>Error al cargar las noticias.</div>;
  }

  const news = newsResponse.data;

  return (
    <NoticiasPageModule
      news={news.noticias}
      totalPages={news.totalPages}
      currentPage={Number(page)}
    />
  );
}
