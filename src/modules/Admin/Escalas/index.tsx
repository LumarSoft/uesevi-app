"use client";
import { useEffect, useState } from "react";
import { createColumns } from "@/modules/Admin/Escalas/Table/Columns";
import { IEscalas } from "@/shared/types/Querys/IEscalas";
import { AddScaleDialog } from "@/modules/Admin/Escalas/Dialog/AddEscalaDialog";
import { DataTable } from "./Table/Data-Table";
import { fetchData } from "@/services/mysql/functions";

const EscalasModule = () => {
  const [scales, setScales] = useState<IEscalas[]>([]);
  
  useEffect(() => {
    const fetchScales = async () => {
      try {
        const result = await fetchData("scales");
        setScales(result.data || []);
      } catch (error) {
        console.error("Error fetching scales:", error);
      }
    };
    fetchScales();
  }, []);

  const handleUpdate = (updatedItem: IEscalas) => {
    setScales((prevScales) =>
      prevScales.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDelete = (deleteItem: IEscalas) => {
    setScales((prevScales) => 
      prevScales.filter((item) => item.id !== deleteItem.id)
    );
  };

  const columns = createColumns(handleUpdate, handleDelete);

  // Conseguir el último id de la data, asegurando que scales no esté vacío
  const lastId = scales.length > 0 ? scales[0].id + 1 : 1;

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
