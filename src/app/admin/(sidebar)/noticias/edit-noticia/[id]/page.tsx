import EditNoticiaModule from "@/modules/Admin/Noticias/EditNoticia";
import { fetchData } from "@/services/mysql/functions";

export default async function EditNoticia({
  params: { id },
}: {
  params: { id: number };
}) {
  const data = await fetchData(`news/${id}`);

  if (!data) {
    return <div>Error al solicitar los datos</div>;
  }

  return <EditNoticiaModule data={data} />;
}
