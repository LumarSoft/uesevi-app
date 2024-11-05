import UnderConstructionModule from "@/modules/Client/Home/Mantenimiento";
import { BASE_API_URL } from "@/shared/providers/envProvider";

// Indica que la página debe revalidarse cada 60 segundos (1 minuto)
export const revalidate = 60;

export default async function Home() {
  const res = await fetch(`${BASE_API_URL}/news/last-three`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resJSON = await res.json();

  const data = resJSON.data;

  return <UnderConstructionModule />;
}
