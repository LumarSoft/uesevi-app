"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INoticias } from "@/shared/types/Querys/INoticias";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
                {/* Aquí podrías formatear y mostrar las fechas creadas y modificadas */}
                <span>Fecha: {noticia.modified.toString()}</span>
              </div>
            </div>
          </CardContent>

          {/* Validar si hay imágenes */}
          {noticia.images && noticia.images.length > 0 && (
            <div className="p-6">
              {noticia.images.length === 1 ? (
                // Mostrar una sola imagen
                <img
                  src={`http://localhost:3006/uploads/${noticia.images[0].nombre}`}
                  alt={noticia.titulo}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                // Mostrar un carrusel si hay más de una imagen
                <Carousel>
                  <CarouselContent>
                    {noticia.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={`http://localhost:3006/uploads/${image.nombre}`}
                          alt={`Imagen ${index + 1} de ${noticia.titulo}`}
                          className="w-full h-auto rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
