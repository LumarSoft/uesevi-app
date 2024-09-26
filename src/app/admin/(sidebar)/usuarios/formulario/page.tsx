import AdminFormularioModule from "@/modules/Admin/Usuarios/Formulario";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminFormulario() {
  const formsResponse = await fetchData("forms");
  const companiesResponse = await fetchData("companies");

  if (!formsResponse.ok || formsResponse.error) {
    console.error("Error al obtener los formularios:", formsResponse.error);
    return <div>Error al cargar los formularios.</div>;
  }

  if (!companiesResponse.ok || companiesResponse.error) {
    console.error("Error al obtener las empresas:", companiesResponse.werror);
    return <div>Error al cargar las empresas.</div>;
  }


  const forms = formsResponse.data;
  const companies = companiesResponse.data;

  return <AdminFormularioModule forms={forms} companies={companies} />;
}
