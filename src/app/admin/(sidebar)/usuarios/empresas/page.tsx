import AdminEmpresasModule from "@/modules/Admin/Usuarios/Empresas";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminEmpresas() {
  const result = await fetchData("companies");


  if (!result.ok || result.error) {
    console.error("Error al obtener los datos de las empresas:", result.error);
    return <div>Error al cargar los datos de las empresas.</div>;
  }

  const data = result.data;

  return <AdminEmpresasModule data={data} />;
}
