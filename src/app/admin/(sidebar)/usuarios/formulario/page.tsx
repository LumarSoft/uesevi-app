"use client";
import AdminFormularioModule from "@/modules/Admin/Usuarios/Formulario";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { useEffect, useState } from "react";

export default function AdminFormulario() {
  const [formsData, setFormsData] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        const forms = await fetchData("forms");
        const companies = await fetchData("companies");

        if (forms.ok && companies.ok) {
          setFormsData(forms.data);
          setCompaniesData(companies.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.log("Error al cargar los datos:", error);
      }
    };

    fetch();
  }, []);

  if (loading) {
    return <Loader />;
  }
  if (companiesData.length === 0) {
    return <div>Error al cargar la info</div>;
  }

  return <AdminFormularioModule forms={formsData} companies={companiesData} />;
}
