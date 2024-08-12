"use client";
import { Button } from "@/components/ui/button";
import { ICategoria } from "@/shared/types/Querys/ICategorias";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/columns";
import { useState } from "react";
import { AddCategoria } from "./components/Dialog/AddCategoria";

export default function CategoriasModule({ data }: { data: ICategoria[] }) {
  const [categoria, setCategoria] = useState(data);

  const handleDelete = (deleteItem: ICategoria) => {
    const newData = categoria.filter((item) => item.id !== deleteItem.id);
    setCategoria(newData);
  };

  const handleUpdate = (updateItem: ICategoria) => {
    const newData = data.map((item) => {
      if (item.id === updateItem.id) {
        return updateItem;
      }
      return item;
    });
    setCategoria(newData);
  };

  const columns = createColumns(handleDelete, handleUpdate);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
          <AddCategoria />
        </div>

        <DataTable columns={columns} data={categoria} />
      </div>
    </div>
  );
}
