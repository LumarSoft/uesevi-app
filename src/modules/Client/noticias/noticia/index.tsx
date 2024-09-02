"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INoticias } from "@/shared/types/Querys/INoticias";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NoticiaModule({ noticia }: { noticia: INoticias }) {
  console.log(noticia);

  return (
    <div className="w-full">
      <div className="container mx-auto py-8 md:py-20">
        <Card className="overflow-hidden rounded-lg shadow-md">
          <CardContent className="p-6">
            {noticia.titulo && (
              <Badge variant="secondary" className="mb-2">
                {noticia.destinatario ? noticia.destinatario : "Todos"}
              </Badge>
            )}
            <h2 className="text-2xl font-semibold">{noticia.titulo}</h2>
            {noticia.archivo && (
              <a href={`http://localhost:3006/uploads/${noticia.archivo}`} target="_blank" rel="noopener noreferrer">
                <Button className="mt-4">
                  <Download />
                  Archivo
                </Button>
              </a>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {noticia.epigrafe}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {noticia.cuerpo}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {noticia.cuerpo_secundario}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {noticia.created.toString()}
              </div>
            </div>
          </CardContent>
          {noticia.images?.length && noticia.images.length > 0 ? (
            <Carousel>
              <CarouselContent>
                {noticia.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={`http://localhost:3006/uploads/${img}`}
                      alt={`News Image ${index + 1}`}
                      className="rounded-md object-cover aspect-[16/9]"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <img
              src={`/logo_uesevi.png`}
              alt="News Image"
              className="rounded-md object-cover aspect-[16/9] m-auto"
            />
          )}
        </Card>
      </div>
    </div>
  );
}
