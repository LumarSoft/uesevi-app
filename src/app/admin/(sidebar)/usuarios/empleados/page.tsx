"use client";
import AdminEmpleadosModule from "@/modules/Admin/Usuarios/Empleados";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { useEffect, useState } from "react";

export default function AdminEmpleados() {
  const [dataEmployees, setDataEmployees] = useState([]);
  const [dataCompanies, setDataCompanies] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const employees = await fetchData("employees");
      const companies = await fetchData("companies");

      setDataEmployees(employees.data);
      setDataCompanies(companies.data);
    };

    fetch();
  }, []);

  if (!dataEmployees.length || !dataCompanies.length) {
    return <div><Loader /></div>;
  }

  return (
    <AdminEmpleadosModule employees={dataEmployees} companies={dataCompanies} />
  );
}
