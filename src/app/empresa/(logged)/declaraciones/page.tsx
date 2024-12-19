"use client";
import DeclaracionesModule from "@/modules/company/declaraciones";
import { fetchData, fetchOneRow } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";

export default function DeclaracionesPage() {
  const [statements, setStatements] = useState([]);
  const [rates, setRates] = useState("");
  const { user } = userStore();

  const idCompany = user?.empresa.id!;

  useEffect(() => {
    const fetchStatements = async () => {
      const result = await fetchOneRow("statements/company/:id", idCompany);
      setStatements(result.data);
    };
    const fetchRates = async () => {
      const result = await fetchData("rates");
      setRates(result.data[0].porcentaje);
    };

    if (idCompany) {
      fetchStatements();
      fetchRates();
    }
  }, [idCompany]);

  if (statements.length > 0) {
    return <DeclaracionesModule statements={statements} rates={rates} />;
  } else {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Alert className="w-1/2">
          <Terminal className="h-4 w-4" />
          <AlertTitle>No posee declaraciones</AlertTitle>
          <AlertDescription>
            Para agregar una declaración jurada, diríjase a la sección de{" "}
            <Link
              href="/empresa/empleados/importacion"
              className="text-primary"
            >
              declaración jurada
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
