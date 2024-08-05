import { ViewNoticiaModule } from "@/modules/Admin/Noticias/ViewNoticia";
import { fetchOneRow } from "@/services/mysql/functions";

export default async function ViewNoticia({
  params: { id },
}: {
  params: { id: number };
}) {
  const result = await fetchOneRow("noticias", id);

  if (result) {
    return <ViewNoticiaModule data={result[0]} />;
  } else {
    console.error(result.error);
    return <div>Error: {result.error}</div>;
  }
}
