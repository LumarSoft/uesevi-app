import AdminDashboardModule from "@/modules/Admin/Dashboard";
import { fetchData } from "@/services/mysql/functions";

export default async function DashboardPage() {
  const dashboardResponse = await fetchData("dashboard");

  if (!dashboardResponse.ok || dashboardResponse.error) {
    console.error(
      "Error al obtener los datos del dashboard:",
      dashboardResponse.error
    );
    return <div>Error al cargar los datos del dashboard.</div>;
  }

  const { data } = dashboardResponse;


  return <AdminDashboardModule data={data[0]} />;
}
