import CategoriasModule from "@/modules/Admin/Categorias";
import { fetchData } from "@/services/mysql/functions";

export default async function Categorias() {
  const categorias = await fetchData("categorias");

  return <CategoriasModule data={categorias}/>;
}
