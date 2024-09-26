import { ViewNoticiaModule } from "@/modules/Admin/Noticias/ViewNoticia";
import { fetchOneRow } from "@/services/mysql/functions";

export default async function ViewNoticia({
  params: { id },
}: {
  params: { id: number };
}) {
  const newByIdResult = await fetchOneRow("noticias", id);

  if (!newByIdResult.ok) {
    return <div>Error al cargar la noticia.</div>;
  }

  const newByIdData = newByIdResult.data;

  return <ViewNoticiaModule data={newByIdData} />;
}
