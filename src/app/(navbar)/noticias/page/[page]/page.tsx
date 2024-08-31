import NoticiasPageModule from "@/modules/Client/noticias";
import { fetchData } from "@/services/mysql/functions";

export default async function NoticiasPage({
  params: { page },
}: {
  params: { page: number };
}) {
  const noticias = await fetchData(`noticias/getAllClient/${page}`);

  console.log(noticias);
  return (
    <NoticiasPageModule
      noticias={noticias.noticias}
      totalPages={noticias.totalPages}
      currentPage={Number(page)}
    />
  );
}
