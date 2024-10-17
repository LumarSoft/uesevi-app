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

      if (!forms.ok || forms.error) {
        console.error("Error al obtener los formularios:", forms.error);
        return;
      }

      if (!companies.ok || companies.error) {
        console.error("Error al obtener las empresas:", companies.error);
        return;
      }

      setFormsData(forms.data);
      setCompaniesData(companies.data);
    };

    fetch();
  }, []);

  return <AdminFormularioModule forms={formsData} companies={companiesData} />;
}
