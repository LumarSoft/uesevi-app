"use client";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { useState } from "react";

const AdminEmpresasModule = ({ data }: { data: IEmpresa[] }) => {
  const [companies, setCompanies] = useState(data);

  const handleUpdate = (updatedItem: IEmpresa) => {
    const newData = companies.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setCompanies(newData);
  };

  const handleDelete = (deleteItem: IEmpresa) => {
    const newData = companies.filter((item) => item.id !== deleteItem.id);
    setCompanies(newData);
  };

  const columns = createColumns(handleUpdate, handleDelete);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Empresas</h2>
        </div>

        <DataTable columns={columns} data={companies} filterColumn="nombre" />
      </div>
    </div>
  );
};

export default AdminEmpresasModule;
