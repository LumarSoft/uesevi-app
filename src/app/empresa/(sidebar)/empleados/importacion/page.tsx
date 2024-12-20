"use client";
import ImportacionEmpleadosModule from "@/modules/company/empleados/importacion";
import { fetchData } from "@/services/mysql/functions"; // Asegúrate de que la función esté preparada para recibir múltiples filas.
import { userStore } from "@/shared/stores/userStore";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { useEffect, useState } from "react";

export default function ImportacionEmpleadosPage() {
  // lastDeclarations ahora es un array
  const [lastDeclarations, setLastDeclarations] = useState<IDeclaracion[]>([]);
  const { user } = userStore();
  const idCompany = user?.empresa?.id;

  useEffect(() => {
    const fetchLastDeclarations = async () => {
      try {
        const result = await fetchData(
          `/company/${idCompany}` // Corrige la URL según sea necesario
        );
        setLastDeclarations(result.data); // result.data debe ser un array
      } catch (error) {
        console.error("Error fetching declarations:", error);
      }
    };

    if (idCompany) {
      fetchLastDeclarations();
    }
  }, [idCompany]);

  return <ImportacionEmpleadosModule lastDeclarations={lastDeclarations} />;
}
