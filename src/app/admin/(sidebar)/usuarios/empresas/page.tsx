import AdminEmpresasModule from "@/modules/Admin/Usuarios/Empresas";
import { FetchDataResult } from "@/shared/types/otherTypes";

const fetchData = async (): Promise<FetchDataResult> => {
  try {
    const response = await fetch("http://localhost:3001/empresas");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
};

export default async function AdminEmpresas() {
  const result = await fetchData();

  if ("data" in result) {
    return <AdminEmpresasModule data={result.data} />;
  } else {
    console.error(result.error);
    return <div>Error: {result.error}</div>;
  }
}
