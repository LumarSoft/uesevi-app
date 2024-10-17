"use client";
import AdminEmpleadosModule from "@/modules/Admin/Usuarios/Empleados";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function AdminEmpleados() {
  const [dataEmployees, setDataEmployees] = useState([]);
  const [dataCompanies, setDataCompanies] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const employees = await fetchData("employees");
      const companies = await fetchData("companies");

      if (!employees.ok || employees.error) {
        console.error("Error al obtener los empleados:", employees.error);
        return;
      }

      if (!companies.ok || companies.error) {
        console.error("Error al obtener las empresas:", companies.error);
        return;
      }

      setDataEmployees(employees.data);
      setDataCompanies(companies.data);
    };

    fetch();
  }, []);

  return (
    <AdminEmpleadosModule employees={dataEmployees} companies={dataCompanies} />
  );
}
