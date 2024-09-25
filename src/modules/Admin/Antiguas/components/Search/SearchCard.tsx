import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker"; // Importa el tipo DateRange
import { CalendarComponent } from "./Calendar";
import { addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { filterDeclaraciones } from "@/shared/utils/filterDeclaraciones";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { fetchData } from "@/services/mysql/functions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ComboboxCompanies } from "./ComboboxCompanies";
import { ComboboxEmployee } from "./ComboboxEmployee";
import { IOldEmpresa } from "@/shared/types/Querys/IOldEmpresa";
import { IOldDeclaracion } from "@/shared/types/Querys/IOldDeclaracion";
import { IOldContratos } from "@/shared/types/Querys/IOldContratos";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";

export default function SearchCard({
  companies,
  contracts,
  statements,
  setStatementsState,
}: {
  companies: IOldEmpresa[];
  contracts: IOldContratos[];
  statements: IOldDeclaracion[];
  setStatementsState: React.Dispatch<
    React.SetStateAction<IOldDeclaracion[] | IDeclaracion[]>
  >;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  }); // Cambiamos a DateRange | undefined

  const [company, setCompany] = useState<number | null>(null);
  const [idEmployee, setIdEmployee] = useState<number | null>(null);
  const [employees, setEmployees] = useState<IEmpleado[] | []>([]);

  const fetchEmpleadosByEmpresa = async (company: number) => {
    try {
      const result = await fetchData(`empleados/getByEmpresa/${company}`);
      setEmployees(result);
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
    if (!date || !date.from || !date.to) return;
    const filtrado = filterDeclaraciones(
      { from: date.from, to: date.to },
      company,
      idEmployee,
      contracts,
      statements
    );
    setStatementsState(filtrado);
  };

  const handleClear = () => {
    setDate({ from: undefined, to: undefined});
    setCompany(null);
    setIdEmployee(null);
    setEmployees([]);
    setStatementsState(statements);
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

          <ComboboxCompanies
            companies={companies}
            companyProp={company}
            setCompany={setCompany}
          />

          <ComboboxEmployee employees={employees} setEmployee={setIdEmployee} idEmployee={idEmployee}/>
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