import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { createColumns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";
import { useState } from "react";
import { ICategoria } from "@/shared/types/Querys/ICategory";

export default function MisEmpleadosModule({
  employees,
  categories,
}: {
  employees: IEmpleado[];
  categories: ICategoria[];
}) {
  const [data, setData] = useState(employees);

  const updateEmployee = (employee: IEmpleado) => {
    const newData = data.map((item) =>
      item.id === employee.id ? employee : item
    );
    setData(newData);
  };

  const cancelEmployee = (employee: IEmpleado) => {
    const newData = data.filter((item) => item.id !== employee.id);
    setData(newData);
  };

  const columns = createColumns(categories, updateEmployee, cancelEmployee);
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mis empleados</h2>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
