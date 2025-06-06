"use client";

import NoticiaModule from "@/modules/Client/noticias/noticia";
import { useNoticia } from "@/shared/hooks/useNoticias";
import { Loader } from "@/shared/components/Loader/Loader";

export default function NoticiaPage({
  params: { id },
}: {
  params: { id: number };
}) {
  const { noticia: data, loading, error } = useNoticia(Number(id));

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8 md:py-20 mt-14">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            {error || "No se pudo cargar la noticia"}
          </p>
        </div>
      </div>
    );
  }

  return <NoticiaModule newData={data} />;
}
