"use client";
import MisEmpleadosModule from "@/modules/company/empleados/misEmpleados";
import { fetchData, fetchOneRow } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";

export default function MisEmpleadosPage() {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = userStore();

  // Verifica que user y user.empresa existan antes de acceder a idCompany
  const idCompany = user?.empresa?.id;

  useEffect(() => {
    const fetchEmployees = async () => {
      const result = await fetchOneRow("employees/company/:id", idCompany);
      setEmployees(result.data);
    };

    const fetchCategories = async () => {
      const result = await fetchData("category");
      setCategories(result.data);
    };

    if (idCompany) {
      fetchEmployees();
      fetchCategories();
    }
  }, [idCompany]);

  if (employees.length > 0) {
    return <MisEmpleadosModule employees={employees} categories={categories} />;
  } else {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Alert className="w-1/2">
          <Terminal className="h-4 w-4" />
          <AlertTitle>No posee empleados</AlertTitle>
          <AlertDescription>
            Para agregar empleados a su empresa, diríjase a la sección de{" "}
            <Link
              href="/empresa/empleados/agregar-empleado"
              className="text-primary"
            >
              Agregar Empleados
            </Link>{" "}
            o a{" "}
            <Link
              href="/empresa/empleados/importacion"
              className="text-primary"
            >
              Importación masiva
            </Link>{" "}
            de empleados
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
