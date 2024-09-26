import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INoticias } from "@/shared/types/Querys/INoticias";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function NoticiaModule({ newData }: { newData: INoticias }) {
  return (
    <div className="w-full">
      <div className="container mx-auto py-8 md:py-20">
        <Card className="overflow-hidden rounded-lg shadow-md">
          <CardContent className="p-6">
            {newData.titulo && (
              <Badge variant="secondary" className="mb-2">
                {newData.destinatario ? newData.destinatario : "Todos"}
              </Badge>
            )}
            {newData.archivo && (
              <Badge variant="outline" className="mb-2">
                Archived
              </Badge>
            )}
            <h2 className="text-2xl font-semibold">{newData.titulo}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {newData.epigrafe}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {newData.cuerpo}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {newData.cuerpo_secundario}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {/* Aquí podrías formatear y mostrar las fechas creadas y modificadas */}
                <span>Fecha: {newData.modified.toString()}</span>
              </div>
            </div>
          </CardContent>

          {/* Validar si hay imágenes */}
          {newData.images && newData.images.length > 0 && (
            <div className="p-6">
              {newData.images.length === 1 ? (
                // Mostrar una sola imagen
                <img
                  src={`http://localhost:3006/uploads/${newData.images[0].nombre}`}
                  alt={newData.titulo}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                // Mostrar un carrusel si hay más de una imagen
                <Carousel>
                  <CarouselContent>
                    {newData.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={`http://localhost:3006/uploads/${image.nombre}`}
                          alt={`Imagen ${index + 1} de ${newData.titulo}`}
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
