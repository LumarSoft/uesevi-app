"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CardNoticias from "@/shared/components/CardNoticias/CardNoticias";
import { INoticias } from "@/shared/types/Querys/INoticias";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FramerComponent } from "@/shared/Framer/FramerComponent";

const NoticiasPageModule = ({
  news,
  totalPages,
  currentPage,
}: {
  news: INoticias[];
  totalPages: number;
  currentPage: number;
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
        viewport: { once: true, offset: 0.4 },
      },
    },
  };

  const itemAnimado = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const [selectedType, setSelectedType] = useState("all");
  const filteredNews =
    selectedType === "all"
      ? news
      : news.filter((news) => news.destinatario === selectedType);

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

      <FramerComponent
        style="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        animationVariants={container}
        animationInitial="hidden"
        animationWhileInView="show"
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        {filteredNews.map((news) => (
          <FramerComponent
            key={news.id}
            animationInitial={{ opacity: 0, y: 50 }}
            animationVariants={itemAnimado}
          >
            <CardNoticias noticia={news} />
          </FramerComponent>
        ))}
      </FramerComponent>

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
