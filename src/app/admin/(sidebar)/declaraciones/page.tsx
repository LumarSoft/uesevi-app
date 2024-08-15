import DeclaracionJuradaModule from "@/modules/Admin/DeclaracionJurada";
import { fetchData } from "@/services/mysql/functions";

export default async function Declaraciones() {
  const empleados = await fetchData("empleados");

  const empresas = await fetchData("empresas");

  return <DeclaracionJuradaModule empleados={empleados} empresas={empresas}/>;
}
