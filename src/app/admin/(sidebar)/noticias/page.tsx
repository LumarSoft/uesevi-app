import AdminNoticiasModule from "@/modules/Admin/Noticias";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminNoticias() {
  const newsResponse = await fetchData("news");

  if (!newsResponse.ok || newsResponse.error) {
    console.error("Error al obtener las noticias:", newsResponse.error);
    return <div>Error al cargar las noticias.</div>;
  }

  const news = newsResponse.data;

  return <AdminNoticiasModule news={news} />;
}
