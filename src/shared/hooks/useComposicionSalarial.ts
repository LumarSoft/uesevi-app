import { useEffect, useState } from "react";
import { fetchData } from "@/services/mysql/functions";
import { IComposicionSalarial } from "@/shared/types/Querys/IComposicionSalarial";

interface UseComposicionSalarialResult {
  composiciones: IComposicionSalarial[];
  loading: boolean;
  error: string | null;
}

// Composición salarial publicada (período más reciente primero). Público, sin token.
export const useComposicionSalarial = (): UseComposicionSalarialResult => {
  const [composiciones, setComposiciones] = useState<IComposicionSalarial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchData("salary-composition/public");
        if (response.ok && Array.isArray(response.data)) {
          setComposiciones(response.data);
        } else {
          setError(response.message || "Error al cargar la composición salarial");
        }
      } catch (err) {
        setError("Error de conexión al cargar la composición salarial");
        console.error("Error fetching composición salarial:", err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return { composiciones, loading, error };
};
