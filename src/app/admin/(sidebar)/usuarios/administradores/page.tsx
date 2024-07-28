import AdminEmpresasModule from "@/modules/Admin/Usuarios/Administradores/";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminEmpresas() {
  const result = await fetchData("/administradores");

  if (result) {
    return <AdminEmpresasModule data={result} />;
  } else {
    console.error(result.error);
    return <div>Error: {result.error}</div>;
  }
}
