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
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { CalendarComponent } from "./Calendar";
import { ComboboxEmpresa } from "./ComboboxEmpresa";
import { Button } from "@/components/ui/button";
import { ComboboxEmpleado } from "./ComboboxEmpleado";
import { filterDeclaraciones } from "@/shared/utils/filterDeclaraciones";
import { IContratos } from "@/shared/types/Querys/IContratos";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { fetchData } from "@/services/mysql/functions";

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
  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [company, setCompany] = useState<number | null>(null);

  const [idEmployee, setIdEmployee] = useState<number | null>(null);

  const [empleados, setEmpleados] = useState<IEmpleado[] | []>([]);

  useEffect(() => {
    const empleadosDeEsaEmpresa = fetchData()
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

          {/* <ComboboxEmpleado empleados={empleados} setEmployee={setIdEmployee} /> */}
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4">
          <Button variant="destructive" className="flex-1">
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
