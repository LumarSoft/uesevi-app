"use client";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { useState } from "react";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";

const AdminFormularioModule = ({ data, empresas }: { data: IFormulario[], empresas: IEmpresa[] }) => {
  const [formulario, setFormulario] = useState(data);

  const handleUpdate = (updatedItem: IFormulario) => {
    const newData = formulario.map((item) =>
      item.cuil === updatedItem.cuil ? updatedItem : item
    );
    setFormulario(newData);
  };

  const columns = createColumns(handleUpdate, empresas);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Empleados afiliados via web
          </h2>
        </div>
        <DataTable columns={columns} data={formulario} filterColumn="nombre" />
      </div>
    </div>
  );
};

export default AdminFormularioModule;
