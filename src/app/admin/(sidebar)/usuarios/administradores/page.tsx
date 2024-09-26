import AdminEmpresasModule from "@/modules/Admin/Usuarios/Administradores/";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminEmpresas() {
  const result = await fetchData("administrators");

  if (!result.ok || result.error) {
    console.error(
      "Error al obtener los datos de los administradores:",
      result.error
    );
    return <div>Error al cargar los datos de los administradores.</div>;
  }

  const { data } = result;

  return <AdminEmpresasModule data={data} />;
}
