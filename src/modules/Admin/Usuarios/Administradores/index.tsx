"use client";
import { createColumns } from "./components/Table/Columns";
import { IAdmin } from "@/shared/types/IAdmin";
import { useState } from "react";
import { DataTable } from "../Empresas/components/Table/Data-Table";
import { AddAdmin } from "./components/Dialog/AddAdmin";

const AdminUsuariosModule = ({ data }: { data: IAdmin[] }) => {
  const [users, setUser] = useState(data);

  const handleUpdate = (updatedItem: IAdmin) => {
    const newData = users.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setUser(newData);
  };

  const handleAdminAdded = (newAdmin: IAdmin) => {
    setUser([...users, newAdmin]);
  };

  const columns = createColumns(handleUpdate);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Administradores</h2>
          <AddAdmin onAdminAdded={handleAdminAdded} />
        </div>

        <DataTable columns={columns} data={users} filterColumn="nombre" />
      </div>
    </div>
  );
};
export default AdminUsuariosModule;
