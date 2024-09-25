import DeclaracionesModule from "@/modules/Admin/Antiguas";
import { fetchData } from "@/services/mysql/functions";

export default async function AntiguasPage() {
  const companies = await fetchData("old-companies");

  const statements = await fetchData("old-statements");

  const contracts = await fetchData("old-contracts");

  return (
    <DeclaracionesModule
      companies={companies}
      statements={statements}
      contracts={contracts}
    />
  );
}
