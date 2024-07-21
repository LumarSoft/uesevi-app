import AdminDashboardModule from "@/modules/Admin/Dashboard";
import { FetchDataResultDashboard } from "@/shared/types/otherTypes";

const fetchData = async (): Promise<FetchDataResultDashboard> => {
  try {
    const response = await fetch("http://localhost:3001/dashboard");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
};

export default async function AdminDashboard() {
  const result = await fetchData();

  if ("data" in result) {
    return <AdminDashboardModule data={result.data} />;
  } else {
    console.error(result.error);
    return <div>Error: {result.error}</div>;
  }
}
