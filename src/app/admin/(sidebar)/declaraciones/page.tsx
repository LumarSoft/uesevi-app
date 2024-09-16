import DeclaracionesModule from "@/modules/Admin/DeclaracionJurada";
import { fetchData } from "@/services/mysql/functions";

export default async function Declaraciones() {
  const companies = await fetchData("companies");

  const statements = await fetchData("statements");

  const contracts = await fetchData("contracts");

  return (
    <DeclaracionesModule
      companies={companies}
      statements={statements}
      contracts={contracts}
    />
  );
} 
