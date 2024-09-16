import { DeclaracionModule } from "@/modules/Admin/DeclaracionJurada/DeclaracionById";
import { fetchData } from "@/services/mysql/functions";

// Aca necesito traerme la infromacion de la declaracion jurada (Nombre de la empresa, cantidad de empleados por esa declaracion, cantidad de afiliados, fecha, si fue rectificada, fecha de vencimiento, fecha de pago y los datos de las personas)

export default async function Declaracion({
  params: { idEmpresa, idDeclaracion },
}: {
  params: { idEmpresa: number; idDeclaracion: number };
}) {
  const statement = await fetchData(
    `statements/getInfo/${idEmpresa}/${idDeclaracion}`
  );


  return <DeclaracionModule statement={statement} />;
}
