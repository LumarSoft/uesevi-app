"use client";
import { ICategoria } from "@/shared/types/Querys/ICategory";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/columns";
import { useState } from "react";
import { AddCategory } from "./components/Dialog/AddCategoria";

export default function CategoryModule({ data }: { data: ICategoria[] }) {
  const [category, setCategory] = useState(data);

  const handleDelete = (deleteItem: ICategoria) => {
    const newData = category.filter((item) => item.id !== deleteItem.id);
    setCategory(newData);
  };

  const handleUpdate = (updateItem: ICategoria) => {
    const newData = data.map((item) => {
      if (item.id === updateItem.id) {
        return updateItem;
      }
      return item;
    });
    setCategory(newData);
  };

  const columns = createColumns(handleDelete, handleUpdate);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
          <AddCategory />
        </div>

        <DataTable columns={columns} data={category} />
      </div>
    </div>
  );
}
