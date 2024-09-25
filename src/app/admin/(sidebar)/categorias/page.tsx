import CategoryModule from "@/modules/Admin/Categorias";
import { fetchData } from "@/services/mysql/functions";

export default async function CategoriasPage() {
  const category = await fetchData("category");

  return <CategoryModule data={category} />;
}
