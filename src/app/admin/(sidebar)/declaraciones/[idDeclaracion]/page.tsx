import { DeclaracionModule } from "@/modules/Admin/DeclaracionJurada/DeclaracionById";
import { fetchOneRow } from "@/services/mysql/functions";

// Aca necesito traerme la infromacion de la declaracion jurada (Nombre de la empresa, cantidad de empleados por esa declaracion, cantidad de afiliados, fecha, si fue rectificada, fecha de vencimiento, fecha de pago y los datos de las personas)

export default async function Declaracion({
  params: { idDeclaracion },
}: {
  params: { idDeclaracion: number };
}) {
  const declaracion = await fetchOneRow("declaraciones", idDeclaracion);

  // Nombre de la empresa: Listo
  // Fecha de la declaracion: Listo
  // Si fue rectificada: Listo
  // Fecha de vencimiento: Listo
  // Fecha de pago: Listo

  // Cantidad de empleados por esa declaracion: No listo
  // Cantidad de afiliados: No listo


  

  return <DeclaracionModule declaracion={declaracion} />;
}
