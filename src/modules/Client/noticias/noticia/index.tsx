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
import { File, ImageIcon } from "lucide-react";
import Image from "next/image";
import { 
  getCoverImageUrl, 
  getAdditionalImages, 
  getImageUrl, 
  hasImages,
  handleImageError 
} from "@/shared/utils/imageUtils";

export default function NoticiaModule({ newData }: { newData: INoticias }) {
  console.log(newData);
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const coverImage = getCoverImageUrl(newData);
  const additionalImages = getAdditionalImages(newData);
  const hasCoverImage = hasImages(newData);

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto py-8 md:py-20 mt-14">
        <Card className="overflow-hidden rounded-lg shadow-md">
          {/* Imagen de portada principal */}
          {hasCoverImage && coverImage !== "/logo_uesevi.png" && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
              <Image
                src={coverImage}
                alt={newData.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg">
                  {newData.titulo}
                </h1>
              </div>
            </div>
          )}

          <CardContent className="p-6">
            {/* Badges y archivo */}
            <div className="flex flex-wrap gap-2 mb-4">
              {newData.destinatario && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                >
                  {newData.destinatario.charAt(0).toUpperCase() + newData.destinatario.slice(1)}
                </Badge>
              )}
              
              {newData.archivo && (
                <a
                  className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-full text-sm transition-colors"
                  href={`${BASE_API_URL}/uploads/${newData.archivo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <File size={16} />
                  Ver archivo
                </a>
              )}
            </div>

            {/* Título (solo si no hay imagen de portada) */}
            {(!hasCoverImage || coverImage === "/logo_uesevi.png") && (
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                {newData.titulo}
              </h1>
            )}

            {/* Epígrafe */}
            {newData.epigrafe && (
              <p className="text-lg text-muted-foreground mb-4 font-medium italic">
                {newData.epigrafe}
              </p>
            )}

            {/* Contenido principal */}
            <div className="prose prose-sm md:prose-base max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {newData.cuerpo}
              </p>
              
              {newData.cuerpo_secundario && (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-4">
                  {newData.cuerpo_secundario}
                </p>
              )}
            </div>

            {/* Fecha */}
            <div className="text-xs text-muted-foreground border-t pt-4">
              <span>Publicado: {new Date(newData.created).toLocaleDateString('es-ES')}</span>
              {newData.modified !== newData.created && (
                <span className="ml-4">
                  Actualizado: {new Date(newData.modified).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </CardContent>

          {/* Galería de imágenes adicionales */}
          {additionalImages.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="text-primary" size={20} />
                <h3 className="text-lg font-semibold text-primary">
                  Galería de imágenes
                </h3>
              </div>
              
              {additionalImages.length === 1 ? (
                // Una sola imagen adicional
                <div className="relative w-full max-w-2xl mx-auto">
                  <Image
                    src={getImageUrl(additionalImages[0])}
                    alt={`Imagen de ${newData.titulo}`}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-md"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>
              ) : (
                // Carrusel para múltiples imágenes
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent>
                    {additionalImages.map((image, index) => (
                      <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <div className="relative aspect-square overflow-hidden rounded-lg">
                            <Image
                              src={getImageUrl(image)}
                              alt={`Imagen ${index + 1} de ${newData.titulo}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={handleImageError}
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </div>
          )}

          {/* Mensaje cuando no hay imágenes */}
          {!hasCoverImage && additionalImages.length === 0 && (
            <div className="p-6 border-t text-center text-muted-foreground">
              <ImageIcon className="mx-auto mb-2 opacity-50" size={24} />
              <p className="text-sm">Esta noticia no contiene imágenes</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
