"use client";
import { INoticias } from "@/shared/types/Querys/INoticias";
import { createColumns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const AdminNoticiasModule = ({ data }: { data: INoticias[] }) => {
  const [noticias, setNoticias] = useState(data);

  const handleDelete = (deleteItem: INoticias) => {
    const newData = noticias.filter((item) => item.id !== deleteItem.id);
    setNoticias(newData);
  };

  const columns = createColumns(handleDelete);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Noticias</h2>
        </div>

        <Link href={"/admin/noticias/add-noticia"}>
          <Button className="w-full">Nueva noticia</Button>
        </Link>

        <DataTable columns={columns} data={noticias} />
      </div>
    </div>
  );
};

export default AdminNoticiasModule;
