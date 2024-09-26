import { HistorialDeclaracionesModule } from "@/modules/Admin/DeclaracionJurada/historial";
import { fetchData } from "@/services/mysql/functions";

export default async function HistorialDeclaracioens({
  params: { idEmpresa, anio, mes },
}: {
  params: { idEmpresa: number; anio: number; mes: number };
}) {
  const statementsResult = await fetchData(
    `statements/history/${idEmpresa}/${anio}/${mes}`
  );


  if (!statementsResult.ok) {
    return <div>Error al cargar los datos</div>;
  }

  const statements = statementsResult.data;

  return <HistorialDeclaracionesModule statements={statements} />;
}
