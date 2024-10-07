import { DeclaracionModule } from "@/modules/Admin/Antiguas/DeclaracionById";
import { fetchData } from "@/services/mysql/functions";

export default async function Declaracion({
  params: { idEmpresa, idDeclaracion },
}: {
  params: { idEmpresa: number; idDeclaracion: number };
}) {
  const statementResult = await fetchData(
    `old-statements/info/${idEmpresa}/${idDeclaracion}`
  );

  if (!statementResult.ok) {
    return <div>Error al cargar los datos</div>;
  }

  const statement = statementResult.data;

  return <DeclaracionModule statement={statement} />;
}
