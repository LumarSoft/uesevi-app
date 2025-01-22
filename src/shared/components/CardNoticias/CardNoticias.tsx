"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { INoticias } from "@/shared/types/Querys/INoticias";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CardNoticias = ({ noticia }: { noticia: INoticias }) => {
  return (
    <Card className="flex flex-col h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center text-primary leading-tight tracking-tight hover:text-primary/90 transition-colors bg-blue-100 rounded-md">
          {noticia.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 px-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={
              noticia.portada
                ? `https://uesevi.org.ar/img/news/main/${noticia.portada}`
                : "/logo_uesevi.png"
            }
            alt={noticia.titulo}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={(e) => {
              e.currentTarget.src = "/logo_uesevi.png";
            }}
          />
        </div>
        <p className="text-sm text-gray-600 flex-grow line-clamp-4 leading-relaxed">
          {noticia.cuerpo}
        </p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="default" className="w-full rounded-lg font-semibold ">
          <Link href={`/noticias/${noticia.id}`} className="w-full text-center">
            Leer más
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardNoticias;
