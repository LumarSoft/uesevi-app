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
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { CalendarComponent } from "./Calendar";
import { ComboboxEmpresa } from "./ComboboxEmpresa";
import { Button } from "@/components/ui/button";
import { filterDeclaraciones } from "@/shared/utils/filterDeclaraciones";
import { IContratos } from "@/shared/types/Querys/IContratos";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { fetchData } from "@/services/mysql/functions";
import { ComboboxEmpleado } from "./ComboboxEmpleado";

export default function SearchCard({
  empresas,
  contratos,
  declaraciones,
  setDeclaracionesState,
}: {
  empresas: IEmpresa[];
  contratos: IContratos[];
  declaraciones: IDeclaracion[];
  setDeclaracionesState: React.Dispatch<React.SetStateAction<IDeclaracion[]>>;
}) {
  const [date, setDate] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const [company, setCompany] = useState<number | null>(null);
  const [idEmployee, setIdEmployee] = useState<number | null>(null);
  const [empleados, setEmpleados] = useState<IEmpleado[] | []>([]);

  const fetchEmpleadosByEmpresa = async (company: number) => {
    try {
      const result = await fetchData(`empleados/getByEmpresa/${company}`);
      setEmpleados(result);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  useEffect(() => {
    if (company !== null) {
      fetchEmpleadosByEmpresa(company);
    }
  }, [company]);

  const handleFilter = () => {
    const filtrado = filterDeclaraciones(
      date,
      company,
      idEmployee,
      contratos,
      declaraciones
    );
    setDeclaracionesState(filtrado);
  };

  const handleClear = () => {
    setDate({ from: null, to: null });
    setCompany(null);
    setIdEmployee(null);
    setEmpleados([]);
    setDeclaracionesState(declaraciones); // Resetea las declaraciones al estado inicial
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