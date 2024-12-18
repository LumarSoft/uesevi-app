"use client";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { useState } from "react";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { Button } from "@/components/ui/button";

const AdminFormularioModule = ({
  forms,
  companies,
}: {
  forms: IFormulario[];
  companies: IEmpresa[];
}) => {
  const [formulario, setFormulario] = useState(forms);

  const handleUpdate = (updatedItem: IFormulario) => {
    const newData = formulario.map((item) =>
      item.cuil === updatedItem.cuil ? updatedItem : item
    );
    setFormulario(newData);
  };

  // Función para eliminar un elemento
  const handleDelete = (id: number) => {
    setFormulario((prevData) => prevData.filter((item) => item.id !== id));
  };

  const columns = createColumns(handleUpdate, companies, handleDelete);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Empleados afiliados via web
          </h2>
          <Button>
            <a href="/ficha-uesevi-1.pdf" download>
              Descargar ficha vacía
            </a>
          </Button>
        </div>
        <DataTable columns={columns} data={formulario} filterColumn="nombre" />
      </div>
    </div>
  );
};

export default AdminFormularioModule;
