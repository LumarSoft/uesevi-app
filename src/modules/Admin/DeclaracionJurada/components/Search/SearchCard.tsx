"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { CalendarComponent } from "./Calendar";
import { ComboboxEmpresa } from "./ComboboxEmpresa";
import { Button } from "@/components/ui/button";
import { ComboboxEmpleado } from "./ComboboxEmpleado";

export default function SearchCard({
  empleados,
  empresas,
}: {
  empleados: IEmpleado[];
  empresas: IEmpresa[];
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });
  const [company, setCompany] = useState<string | undefined>();
  const [employee, setEmployee] = useState<string | undefined>();

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

          <ComboboxEmpresa empresas={empresas} />

          <ComboboxEmpleado empleados={empleados} />
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4">
          <Button variant="destructive" className="flex-1">
            Limpiar
          </Button>
          <Button variant="default" className="flex-1">
            Buscar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
