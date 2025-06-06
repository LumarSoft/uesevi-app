"use client";
import HomeModule from "@/modules/Client/Home";
import { useLatestNoticias } from "@/shared/hooks/useNoticias";
import { Loader } from "@/shared/components/Loader/Loader";

export default function Home() {
  const { noticias: lastNews, loading, error } = useLatestNoticias();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.error("Error al obtener las noticias:", error);
    // Aún mostramos la página de inicio aunque haya error en las noticias
    return <HomeModule noticias={[]} />;
  }

  return <HomeModule noticias={lastNews} />;
}
