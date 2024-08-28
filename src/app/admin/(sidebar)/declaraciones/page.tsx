import DeclaracionesModule from "@/modules/Admin/DeclaracionJurada";
import { fetchData } from "@/services/mysql/functions";

export default async function Declaraciones() {

  const empresas = await fetchData("empresas");

  const declaraciones = await fetchData("declaraciones");

  const contratos = await fetchData("contratos");


  return (
    <DeclaracionesModule
      empresas={empresas}
      declaraciones={declaraciones}
      contratos={contratos}
    />
  );
}
