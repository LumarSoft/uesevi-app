import { HistorialDeclaracionesModule } from "@/modules/Admin/DeclaracionJurada/historial";
import { fetchData } from "@/services/mysql/functions";

export default async function HistorialDeclaracioens({
  params: { idEmpresa, anio, mes },
}: {
  params: { idEmpresa: number; anio: number; mes: number };
}) {
  const statements = await fetchData(
    `statements/history/${idEmpresa}/${anio}/${mes}`
  );

  return <HistorialDeclaracionesModule statements={statements} />;
}
