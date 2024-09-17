import NoticiaModule from "@/modules/Client/noticias/noticia";
import { fetchOneRow } from "@/services/mysql/functions";

export default async function NoticiaPage({
  params: { id },
}: {
  params: { id: number };
}) {
  const noticia = await fetchOneRow("news", id);
  return <NoticiaModule noticia={noticia}/>;
}
