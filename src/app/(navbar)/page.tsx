"use client";
import HomeModule from "@/modules/Client/Home";
import { useLatestNoticias } from "@/shared/hooks/useNoticias";

export default function Home() {
  // La home se muestra enseguida: antes esperaba a las noticias con un
  // "Cargando…" a pantalla completa. Las noticias están al final de la página
  // y aparecen en su lugar cuando llegan.
  const { noticias: lastNews, loading, error } = useLatestNoticias();

  if (loading) {
    return <HomeModule noticias={[]} />;
  }

  if (error) {
    console.error("Error al obtener las noticias:", error);
    // Aún mostramos la página de inicio aunque haya error en las noticias
    return <HomeModule noticias={[]} />;
  }

  return <HomeModule noticias={lastNews} />;
}
