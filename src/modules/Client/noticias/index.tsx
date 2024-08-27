"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CardNoticias from "@/shared/components/CardNoticias/CardNoticias";
import { INoticias } from "@/shared/types/Querys/INoticias";

const NoticiasPageModule = ({ noticias }: { noticias: INoticias[] }) => {
  const [selectedType, setSelectedType] = useState("all");
  const filteredNews =
    selectedType === "all"
      ? noticias
      : noticias.filter((news) => news.destinatario === selectedType);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">News</h1>

      <Tabs defaultValue="all" onValueChange={setSelectedType} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="Empresas">Empresas</TabsTrigger>
          <TabsTrigger value="Clientes">Clientes</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <CardNoticias key={news.id} noticia={news} />
        ))}
      </div>
    </div>
  );
};

export default NoticiasPageModule;
