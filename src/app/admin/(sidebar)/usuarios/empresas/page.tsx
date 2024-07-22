import AdminEmpresasModule from "@/modules/Admin/Usuarios/Empresas";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminEmpresas() {
  const result = await fetchData("/empresas");

  if (result) {
    return <AdminEmpresasModule data={result} />;
  } else {
    console.error(result.error);
    return <div>Error: {result.error}</div>;
  }
}
