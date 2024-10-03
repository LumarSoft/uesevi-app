"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import CardNewsSkeleton from "@/shared/components/Skeleton/CardNewsSkeleton";

const NoticiasPageModule = ({
  news,
  totalPages,
  currentPage,
}: {
  news: INoticias[];
  totalPages: number;
  currentPage: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [filteredNews, setFilteredNews] = useState<INoticias[]>([]);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const filtered =
        selectedType === "all"
          ? news
          : news.filter((item) => item.destinatario === selectedType);

      setFilteredNews(filtered);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedType]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 pt-12 lg:pt-28 pb-16">
      <h1 className="text-3xl font-bold mb-6">Noticias</h1>

      <Tabs defaultValue="all" onValueChange={setSelectedType} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="Empresas">Empresas</TabsTrigger>
          <TabsTrigger value="Afiliados">Afiliados</TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <motion.div key={`skeleton-${index}`} variants={item}>
                  <CardNewsSkeleton />
                </motion.div>
              ))}
          </motion.div>
        ) : filteredNews.length > 0 ? (
          <motion.div
            key="content"
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredNews.map((newsItem) => (
              <motion.div key={newsItem.id} variants={item}>
                <CardNoticias noticia={newsItem} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center mt-8"
          >
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Search className="w-12 h-12 text-blue-500 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No se encontraron noticias
                </h2>
                <p className="text-gray-500 mb-4">
                  Actualmente no hay noticias disponibles para{" "}
                  <b className="text-black">{selectedType}</b>.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && filteredNews.length > 10 && (
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
      )}
    </div>
  );
};

export default NoticiasPageModule;
