import AdminNoticiasModule from "@/modules/Admin/Noticias";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminNoticias() {
  const result = await fetchData("noticias");

  if (result) {
    return <AdminNoticiasModule data={result} />;
  } else {
    return <div>Error al solicitar los datos</div>;
  }
}
