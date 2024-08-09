import AdminEmpleadosModule from "@/modules/Admin/Usuarios/Empleados";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminEmpleados() {
  const result = await fetchData("/empleados");

  const empresas = await fetchData("/empresas");


  if (result) {
    return <AdminEmpleadosModule data={result} empresas={empresas}/>;
  } else {
    console.error(result.error);
    return <div>Error: {result.error}</div>;
  }
}
