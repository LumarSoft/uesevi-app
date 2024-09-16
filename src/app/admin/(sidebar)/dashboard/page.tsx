import AdminDashboardModule from "@/modules/Admin/Dashboard";
import { fetchData } from "@/services/mysql/functions";

export default async function DashboardPage() {
  const result = await fetchData("dashboard");

  if (result) {
    return <AdminDashboardModule data={result[0]} />;
  } else {
    return <div>Error: Al solicitar los datos</div>;
  }
}
