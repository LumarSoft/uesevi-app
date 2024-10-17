"use client";
import AdminEmpresasModule from "@/modules/Admin/Usuarios/Administradores/";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function AdminEmpresas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchData("administrators");

      setData(result.data);
    };

    fetch();
  }, []);

  if (!data.length) {
    return <div>Cargando</div>;
  }

  return <AdminEmpresasModule data={data} />;
}
