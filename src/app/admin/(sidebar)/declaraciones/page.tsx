import DeclaracionesModule from "@/modules/Admin/DeclaracionJurada";
import { fetchData } from "@/services/mysql/functions";

export default async function Declaraciones() {
  const companiesResult = await fetchData("companies");

  const statementsResult = await fetchData("statements");

  const contractsResult = await fetchData("contracts");

  if (!companiesResult.ok || !statementsResult.ok || !contractsResult.ok) {
    return <div>Error al cargar los datos</div>;
  }

  const companies = companiesResult.data;
  const statements = statementsResult.data;
  const contracts = contractsResult.data;

  return (
    <DeclaracionesModule
      companies={companies}
      statements={statements}
      contracts={contracts}
    />
  );
}
