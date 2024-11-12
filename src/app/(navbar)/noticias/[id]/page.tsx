"use client";

import NoticiaModule from "@/modules/Client/noticias/noticia";
import { fetchOneRow } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { INoticias } from "@/shared/types/Querys/INoticias";
import { useEffect, useState } from "react";

export default function NoticiaPage({
  params: { id },
}: {
  params: { id: number };
}) {
  const [data, setData] = useState<INoticias | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchOneRow("news/:id", id);
      if (response.data) {
        setData(response.data as INoticias);
      }
    };
    fetch();
  }, [id]);

  if (!data) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return <NoticiaModule newData={data} />;
}
