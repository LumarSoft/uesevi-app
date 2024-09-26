import AdminEmpleadosModule from "@/modules/Admin/Usuarios/Empleados";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminEmpleados() {
  const employees = await fetchData("employees");

  const companies = await fetchData("companies");

  if (!employees.ok || employees.error || !employees.data.length) {
    console.error("Error al obtener los empleados:", employees.error);
    return <div>Error al cargar los empleados.</div>;
  }

  if (!companies.ok || companies.error || !companies.data.length) {
    console.error("Error al obtener las empresas:", companies.error);
    return <div>Error al cargar las empresas.</div>;
  }

  return (
    <AdminEmpleadosModule
      employees={employees.data}
      companies={companies.data}
    />
  );
}
