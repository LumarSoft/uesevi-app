import CategoryModule from "@/modules/Admin/Categorias";
import { fetchData } from "@/services/mysql/functions";

export default async function CategoriasPage() {
  const categoriesResult = await fetchData("category");


  if (!categoriesResult.ok || categoriesResult.error) {
    return <div>Error</div>;
  }

  const data = categoriesResult.data;

  return <CategoryModule data={data} />;
}
