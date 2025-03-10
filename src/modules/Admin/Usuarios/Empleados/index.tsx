"use client";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { useState } from "react";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";

const AdminEmpleadosModule = ({
  employees,
  companies,
}: {
  employees: IEmpleado[];
  companies: IEmpresa[];
}) => {
  const [employeesData, setEmployeesData] = useState(employees);

  const columns = createColumns();


  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Empleados</h2>
        </div>

        <DataTable
          columns={columns}
          data={employeesData}
          empresas={companies}
        />
      </div>
    </div>
  );
};

export default AdminEmpleadosModule;
