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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl line-clamp-2">{noticia.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="relative h-48 mb-4">
          <Image
            src={noticia.portada ? `https://uesevi.org.ar/img/news/main/${noticia.portada}` : "/logo_uesevi.png"}
            alt={noticia.titulo}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <p className="text-sm flex-grow line-clamp-4">{noticia.cuerpo}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Link href={`/noticias/${noticia.id}`}>Leer mas</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardNoticias;
