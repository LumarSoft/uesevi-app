import AdminNoticiasModule from "@/modules/Admin/Noticias";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminNoticias() {
  const news = await fetchData("news");

  if (news) {
    return <AdminNoticiasModule news={news} />;
  } else {
    return <div>Error al solicitar los datos</div>;
  }
}
