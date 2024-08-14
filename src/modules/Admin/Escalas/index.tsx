"use client";
import { useState } from "react";
import { createColumns } from "@/modules/Admin/Escalas/Table/Columns";
import { DataTable } from "@/modules/Admin/Usuarios/Empresas/components/Table/Data-Table";
import { IEscalas } from "@/shared/types/IEscalas";
import { AddEscalaDialog } from "@/modules/Admin/Escalas/Dialog/AddEscalaDialog";

const EscalasModule = ({ data }: { data: IEscalas[] }) => {
  const [escalas, setEscalas] = useState(data);

  const handleUpdate = (updatedItem: IEscalas) => {
    const newData = escalas.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setEscalas(newData);
  };

  const handleDelete = (deleteItem: IEscalas) => {
    const newData = escalas.filter((item) => item.id !== deleteItem.id);
    setEscalas(newData);
  };

  const columns = createColumns(handleUpdate, handleDelete);

  //Conseguir el ultimo id de la data
  const lastId = data[0].id + 1;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Escalas</h2>
        </div>
        <AddEscalaDialog id={lastId} />
        <DataTable columns={columns} data={escalas} filterColumn="nombre" />
      </div>
    </div>
  );
};

export default EscalasModule;
