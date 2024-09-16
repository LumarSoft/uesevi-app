"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INoticias } from "@/shared/types/Querys/INoticias";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function NoticiaModule({ noticia }: { noticia: INoticias }) {
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
            {noticia.archivo && (
              <Badge variant="outline" className="mb-2">
                Archived
              </Badge>
            )}
            <h2 className="text-2xl font-semibold">{noticia.titulo}</h2>
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
                {/* {noticia.createdAt} - {noticia.modifiedAt} */}
              </div>
            </div>
          </CardContent>
          {noticia.images?.length && noticia.images.length > 1 ? (
            <Carousel>
              <CarouselContent>
                {noticia.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={`https://uesevi.org.ar/img/news/${img.url}`}
                      alt={`News Image ${index + 1}`}
                      className="rounded-md object-cover aspect-[16/9]"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <img
              src={`https://uesevi.org.ar/img/news/${
                noticia.images?.[0] ?? ""
              }`}
              alt="News Image"
              className="rounded-md object-cover aspect-[16/9] m-auto"
            />
          )}
        </Card>
      </div>
    </div>
  );
}
