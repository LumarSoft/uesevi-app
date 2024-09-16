"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CardNoticias from "@/shared/components/CardNoticias/CardNoticias";
import { INoticias } from "@/shared/types/Querys/INoticias";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const NoticiasPageModule = ({
  noticias,
  totalPages,
  currentPage,
}: {
  noticias: INoticias[];
  totalPages: number;
  currentPage: number;
}) => {
  const [selectedType, setSelectedType] = useState("all");
  const filteredNews =
    selectedType === "all"
      ? noticias
      : noticias.filter((news) => news.destinatario === selectedType);

  return (
    <div className="container mx-auto px-4 pt-12 lg:pt-28 pb-16">
      <h1 className="text-3xl font-bold mb-6">Noticias</h1>

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

      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`/noticias/page/${currentPage - 1}`} />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/noticias/page/${page}`}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext href={`/noticias/page/${currentPage + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default NoticiasPageModule;
