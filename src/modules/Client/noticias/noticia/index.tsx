import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INoticias } from "@/shared/types/Querys/INoticias";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function NoticiaModule({ newData }: { newData: INoticias }) {

  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto py-8 md:py-20 mt-14">
        <Card className="overflow-hidden rounded-lg shadow-md">
          <CardContent className="p-6">
            {newData.titulo && (
              <span
                className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded ${
                  newData.destinatario
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                } dark:bg-blue-900 dark:text-blue-300`}
              >
                {newData.destinatario
                  ? newData.destinatario.charAt(0).toUpperCase() +
                    newData.destinatario.slice(1)
                  : "Todos"}
              </span>
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
                  src={`${BASE_API_URL}/uploads/${newData.images[0].nombre}`}
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
                          src={`${BASE_API_URL}/uploads/${image.nombre}`}
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
