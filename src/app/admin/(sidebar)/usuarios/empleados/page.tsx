import AdminEmpleadosModule from "@/modules/Admin/Usuarios/Empleados";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminEmpleados() {
  const employees = await fetchData("employees");

  const companies = await fetchData("companies");

  if (employees && companies) {
    return <AdminEmpleadosModule employees={employees} companies={companies} />;
  } else {
    return <div>Error: Error al consultar los datos</div>;
  }
}
