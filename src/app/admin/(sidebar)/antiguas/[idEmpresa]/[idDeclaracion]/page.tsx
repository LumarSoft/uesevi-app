import { DeclaracionModule } from "@/modules/Admin/Antiguas/DeclaracionById";
import { fetchData } from "@/services/mysql/functions";


export default async function Declaracion({
  params: { idEmpresa, idDeclaracion },
}: {
  params: { idEmpresa: number; idDeclaracion: number };
}) {
  const statement = await fetchData(
    `old-statements/getInfo/${idEmpresa}/${idDeclaracion}`
  );
  return <DeclaracionModule statement={statement} />;
}
