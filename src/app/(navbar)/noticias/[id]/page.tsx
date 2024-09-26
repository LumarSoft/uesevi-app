import NoticiaModule from "@/modules/Client/noticias/noticia";
import { fetchOneRow } from "@/services/mysql/functions";

export default async function NoticiaPage({
  params: { id },
}: {
  params: { id: number };
}) {
  const newResponse = await fetchOneRow("news/:id", id);


  if (!newResponse.ok || newResponse.error) {
    console.error("Error al obtener la noticia:", newResponse.error);
    return <div>Error al cargar la noticia.</div>;
  }

  const newData = newResponse.data;

  return <NoticiaModule newData={newData} />;
}
