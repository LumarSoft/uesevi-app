import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { filterDeclaraciones } from "@/shared/utils/filterDeclaraciones";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { fetchData } from "@/services/mysql/functions";
import { ComboboxCompanies } from "./ComboboxCompanies";
import { ComboboxEmployee } from "./ComboboxEmployees";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function SearchCard({
  companies,
  statements,
  setStatementsState,
}: {
  companies: IEmpresa[];
  statements: IDeclaracion[]; // Cambia aquí
  setStatementsState: React.Dispatch<React.SetStateAction<IDeclaracion[]>>; // Cambia aquí
}) {
  const [company, setCompany] = useState<number | null>(null);
  const [idEmployee, setIdEmployee] = useState<number | null>(null);
  const [employees, setEmployees] = useState<IEmpleado[] | []>([]);
  const [salaryEmployee, setSalaryEmployee] = useState([]);

  useEffect(() => {
    const savedState = sessionStorage.getItem("searchState");
    if (savedState) {
      const { company: savedCompany } = JSON.parse(savedState);
      if (savedCompany !== null) {
        setCompany(savedCompany);
      }
    }
  }, []);

  const fetchEmpleadosByEmpresa = async (company: number) => {
    try {
      const result = await fetchData(`employees/company/historic/${company}`);
      setEmployees(result.data);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  const fetchSalaries = async () => {
    try {
      const result = await fetchData(`statements/salaries/${idEmployee}`);
      setSalaryEmployee(result.data);
    } catch (error) {
      console.error("Error fetching salarios:", error);
    }
  };

  useEffect(() => {
    setIdEmployee(null);
    if (company !== null) {
      fetchEmpleadosByEmpresa(company);
    }
  }, [company]);

  useEffect(() => {
    if (idEmployee !== null) {
      fetchSalaries();
    }
  }, [idEmployee]);

  const handleFilter = () => {
    let filter = filterDeclaraciones(company, statements, salaryEmployee);

    const filteredStatements = filter.filter((item): item is IDeclaracion => {
      return (item as IDeclaracion).subtotal !== undefined;
    });

    sessionStorage.setItem(
      "searchState",
      JSON.stringify({
        company,
        filteredStatements,
      })
    );

    setStatementsState(filteredStatements);
  };

  const handleClear = () => {
    setCompany(null);
    setIdEmployee(null);
    setEmployees([]);
    sessionStorage.removeItem("searchState");
    sessionStorage.removeItem("selectedCompany");
    const filteredStatements = statements.filter(
      (item): item is IDeclaracion => {
        return (item as IDeclaracion).subtotal !== undefined;
      }
    );
    setStatementsState(filteredStatements);
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
          <ComboboxCompanies
            companies={companies}
            companyProp={company}
            setCompany={setCompany}
          />
          <ComboboxEmployee
            employees={employees}
            setEmployee={setIdEmployee}
            idEmployee={idEmployee}
          />
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleClear}
          >
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
