"use client";
import CategoryModule from "@/modules/Admin/Categorias";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { useEffect, useState } from "react";

export default function CategoriasPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResult = await fetchData("category");

        if (categoriesResult.ok) {
          setData(categoriesResult.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error al cargar los datos:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!data.length) {
    return <div>Error al cargar los datos</div>;
  }

  return <CategoryModule data={data} />;
}
