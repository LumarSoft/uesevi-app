"use client"
import AdminEmpresasModule from "@/modules/Admin/Usuarios/Administradores/";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function AdminEmpresas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchData("administrators");

      if (!result.ok || result.error) {
        console.error(
          "Error al obtener los datos de los administradores:",
          result.error
        );
        return;
      }

      setData(result.data);
    };

    fetch();
  }, []);

  return <AdminEmpresasModule data={data} />;
}
