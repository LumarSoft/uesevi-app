import AdminNoticiasModule from "@/modules/Admin/Noticias";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminNoticias() {
  const result = await fetchData("/noticias");

  if (result) {
    return <AdminNoticiasModule data={result} />;
  } else {
    console.error(result.error);
    return <div>Error: {result.error}</div>;
  }
}
