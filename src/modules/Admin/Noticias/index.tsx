"use client";
import { INoticias } from "@/shared/types/Querys/INoticias";
import { createColumns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const AdminNoticiasModule = ({ news }: { news: INoticias[] }) => {
  const [newsData, setNewsData] = useState(news);

  const handleDelete = (deleteItem: INoticias) => {
    const newData = newsData.filter((item) => item.id !== deleteItem.id);
    setNewsData(newData);
  };

  const columns = createColumns(handleDelete);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Noticias</h2>
          <Link href={"/admin/noticias/add-noticia"}>
            <Button variant={"secondary"}>Nueva noticia</Button>
          </Link>
        </div>

        <DataTable columns={columns} data={newsData} />
      </div>
    </div>
  );
};

export default AdminNoticiasModule;
