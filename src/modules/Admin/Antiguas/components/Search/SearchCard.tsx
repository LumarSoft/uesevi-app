"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { IOldEmpresa } from "@/shared/types/Querys/IOldEmpresa";
import { CalendarComponent } from "./Calendar";
import { ComboboxEmpresa } from "./ComboboxEmpresa";
import { Button } from "@/components/ui/button";
import { filterOldDeclaraciones } from "@/shared/utils/filterOldDeclaraciones";
import { IOldContratos } from "@/shared/types/Querys/IOldContratos";
import { IOldDeclaracion } from "@/shared/types/Querys/IOldDeclaracion";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { fetchData } from "@/services/mysql/functions";
import { ComboboxEmpleado } from "./ComboboxEmpleado";

export default function SearchCard({
  empresas,
  contratos,
  declaraciones,
  setDeclaracionesState,
}: {
  empresas: IOldEmpresa[];
  contratos: IOldContratos[];
  declaraciones: IOldDeclaracion[];
  setDeclaracionesState: React.Dispatch<React.SetStateAction<IOldDeclaracion[]>>;
}) {
  const [date, setDate] = useState<{ from: Date | null; to: Date | null}>({
    from: null,
    to: null,
  });

  const [company, setCompany] = useState<number | null>(null);
  const [idEmployee, setIdEmployee] = useState<number | null>(null);
  const [empleados, setEmpleados] = useState<IEmpleado[] | []>([]);

  const fetchEmpleadosByEmpresa = async (company: number) => {
    try {
      const result = await fetchData(`empleados/getOldByEmpresa/${company}`);
      setEmpleados(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  useEffect(() => {
    if (company !== null) {
      fetchEmpleadosByEmpresa(company);
      console.log(company);
    }
  }, [company]);

  const handleFilter = () => {
    const filtrado = filterOldDeclaraciones(
      date,
      company,
      idEmployee,
      contratos,
      declaraciones
    );
    setDeclaracionesState(filtrado);
  };  

  const handleClear = () => {
    setDate({ from: null, to: null});
    setCompany(null);
    setIdEmployee(null);
    setEmpleados([]);
    setDeclaracionesState(declaraciones);
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
      <Card className="w-full md:w-auto flex-1">
        <CardHeader>
          <CardTitle>Buscar declaraciones</CardTitle>
          <CardDescription>
            Buscar declaraciones juradas por fecha, empresa y empleado
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex gap-4">
          <CalendarComponent date={date} setDate={setDate} />

          <ComboboxEmpresa
            empresas={empresas}
            company={company}
            setCompany={setCompany}
          />

          <ComboboxEmpleado
            empleados={empleados}
            setEmployee={setIdEmployee}
            idEmployee={idEmployee} 
          />
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4">
          <Button variant="destructive" className="flex-1" onClick={handleClear}>
            Limpiar
          </Button>
          <Button variant="default" className="flex-1" onClick={handleFilter}>
            Buscar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}