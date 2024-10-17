"use client";
import CategoryModule from "@/modules/Admin/Categorias";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function CategoriasPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesResult = await fetchData("category");

      if (categoriesResult.ok) {
        setData(categoriesResult.data);
      }
    };

    fetchCategories();
  }, []);

  if (!data.length) {
    return <div>Error al cargar los datos</div>;
  }

  return <CategoryModule data={data} />;
}
