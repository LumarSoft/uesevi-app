import ConsultasModule from "@/modules/Admin/Consultas";
import { fetchData } from "@/services/mysql/functions";

export default async function ConsultasPage() {
  const inquiries = await fetchData("inquiries");

  


  return <ConsultasModule inquiries={inquiries} />;
}
