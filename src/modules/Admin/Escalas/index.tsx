"use client";
import { useState } from "react";
import { createColumns } from "@/modules/Admin/Escalas/Table/Columns";
import { IEscalas } from "@/shared/types/IEscalas";
import { AddScaleDialog } from "@/modules/Admin/Escalas/Dialog/AddEscalaDialog";
import { DataTable } from "./Table/Data-Table";

const EscalasModule = ({ data }: { data: IEscalas[] }) => {
  const [scales, setScales] = useState(data);

  const handleUpdate = (updatedItem: IEscalas) => {
    const newData = scales.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setScales(newData);
  };

  const handleDelete = (deleteItem: IEscalas) => {
    const newData = scales.filter((item) => item.id !== deleteItem.id);
    setScales(newData);
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
        <AddScaleDialog id={lastId} />
        <DataTable columns={columns} data={scales} filterColumn="nombre" />
      </div>
    </div>
  );
};

export default EscalasModule;
