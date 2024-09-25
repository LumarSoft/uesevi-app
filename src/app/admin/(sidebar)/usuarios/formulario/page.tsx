import AdminFormularioModule from "@/modules/Admin/Usuarios/Formulario";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminFormulario() {
  const forms = await fetchData("forms");
  const companies = await fetchData("companies");

  if (forms && companies) {
    return <AdminFormularioModule forms={forms} companies={companies} />;
  } else {
    return <div>Error: Error al solicitar los datos</div>;
  }
}
