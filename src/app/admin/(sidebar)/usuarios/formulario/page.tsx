"use client";
import AdminFormularioModule from "@/modules/Admin/Usuarios/Formulario";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function AdminFormulario() {
  const [formsData, setFormsData] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const forms = await fetchData("forms");
      const companies = await fetchData("companies");

      setFormsData(forms.data);
      setCompaniesData(companies.data);
    };

    fetch();
  }, []);

  if (companiesData.length === 0) {
    return <div>Error al cargar la info</div>;
  }

  return <AdminFormularioModule forms={formsData} companies={companiesData} />;
}
