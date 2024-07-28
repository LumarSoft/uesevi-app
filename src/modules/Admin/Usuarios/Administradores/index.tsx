"use client";
import { createColumns } from "./components/Table/Columns";
import { IAdmin } from "@/shared/types/IAdmin";
import { useState } from "react";
import { DataTable } from "../Empresas/components/Table/Data-Table";

const AdminUsuariosModule = ({ data }: { data: IAdmin[] }) => {
  const [usuarios, setUsuarios] = useState(data);

  const handleUpdate = (updatedItem: IAdmin) => {
    const newData = usuarios.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setUsuarios(newData);
  };

  const columns = createColumns(handleUpdate);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Administradores</h2>
        </div>

        <DataTable columns={columns} data={usuarios} />
      </div>
    </div>
  );
};

export default AdminUsuariosModule;
