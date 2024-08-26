import DeclaracionesModule from "@/modules/Admin/DeclaracionJurada";
import { fetchData } from "@/services/mysql/functions";

export default async function Declaraciones() {
  const empleados = await fetchData("empleados");

  const empresas = await fetchData("empresas");

  const declaraciones = await fetchData("declaraciones");


  return <DeclaracionesModule empleados={empleados} empresas={empresas} />;
}
