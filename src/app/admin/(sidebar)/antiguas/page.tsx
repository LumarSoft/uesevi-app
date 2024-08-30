import DeclaracionesModule from "@/modules/Admin/Antiguas";
import { fetchData } from "@/services/mysql/functions";

export default async function Antiguas() {
  const empresas = await fetchData("old-empresas");

  const declaraciones = await fetchData("antiguas");

  const contratos = await fetchData("old-contratos");

  return (
    <DeclaracionesModule
      empresas={empresas}
      declaraciones={declaraciones}
      contratos={contratos}
    />
  );
}
