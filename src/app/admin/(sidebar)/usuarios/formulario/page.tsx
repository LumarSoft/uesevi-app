import AdminFormularioModule from "@/modules/Admin/Usuarios/Formulario";
import { fetchData } from "@/services/mysql/functions";

export default async function AdminFormulario() {
  const result = await fetchData("formulario");
  const empresas = await fetchData("empresas");

  if (result) {
    return <AdminFormularioModule data={result} empresas={empresas}/>;
  } else {
    return <div>Error: Error al solicitar los datos</div>;
  }
}
