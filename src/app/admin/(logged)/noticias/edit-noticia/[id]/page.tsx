import EditNoticiaModule from "@/modules/Admin/Noticias/EditNoticia";
import { fetchData } from "@/services/mysql/functions";

export default async function EditNoticia({
  params: { id },
}: {
  params: { id: number };
}) {
  const NewsIdResult = await fetchData(`news/${id}`);


  if (!NewsIdResult.ok || NewsIdResult.error) {
    return <div>Error al solicitar los datos</div>;
  }

  const data = NewsIdResult.data;

  return <EditNoticiaModule data={data} />;
}
