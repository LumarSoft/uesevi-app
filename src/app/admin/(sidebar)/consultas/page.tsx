import ConsultasModule from "@/modules/Admin/Consultas";
import { fetchData } from "@/services/mysql/functions";

export default async function ConsultasPage() {
  const inquiriesResult = await fetchData("inquiries");


  if (!inquiriesResult.ok) {
    return <div>Error al cargar los datos</div>;
  }

  const inquiries = inquiriesResult.data;

  return <ConsultasModule inquiries={inquiries} />;
}
