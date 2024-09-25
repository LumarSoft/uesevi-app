"use client";
import MisEmpleadosModule from "@/modules/company/empleados/misEmpleados";
import { fetchData, fetchOneRow } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";

export default function MisEmpleadosPage() {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = userStore();

  const idCompany = user.empresa.id;

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await fetchOneRow("employees/getBycompany", idCompany);
      setEmployees(data);
    };

    const fetchCategories = async () => {
      const data = await fetchData("category");
      setCategories(data);
    };

    if (idCompany) {
      fetchEmployees();
      fetchCategories();
    }
  }, []);

  if (employees.length > 0) {
    return <MisEmpleadosModule employees={employees} categories={categories} />;
  } else {
    return <div>No posee empleados</div>;
  }
}
