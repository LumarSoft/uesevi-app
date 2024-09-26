import DeclaracionesModule from "@/modules/Admin/Antiguas";
import { fetchData } from "@/services/mysql/functions";

export default async function AntiguasPage() {
  const companiesResult = await fetchData("old-companies");

  const statementsResult = await fetchData("old-statements");

  const contractsResult = await fetchData("old-contracts");

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
