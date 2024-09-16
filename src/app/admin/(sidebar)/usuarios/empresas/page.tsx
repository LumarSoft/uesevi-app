import AdminEmpresasModule from "@/modules/Admin/Usuarios/Empresas";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminEmpresas() {
  const result = await fetchData("companies");

  if (result) {
    return <AdminEmpresasModule data={result} />;
  } else {
    return <div>Error: Error al solicitar los datos</div>;
  }
}
