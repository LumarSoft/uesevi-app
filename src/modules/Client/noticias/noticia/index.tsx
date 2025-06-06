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
import { File, ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import {
  getCoverImageUrl,
  getAdditionalImages,
  getImageUrl,
  hasImages,
  handleImageError,
} from "@/shared/utils/imageUtils";

// Componente Modal para ver imágenes en grande
const ImageModal = ({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev 
}: {
  images: any[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Overlay para cerrar */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
      >
        <X size={24} />
      </button>

      {/* Navegación anterior */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Imagen principal */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <Image
          src={getImageUrl(images[currentIndex])}
          alt={`Imagen ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain"
          quality={90}
          priority
          onError={handleImageError}
        />
      </div>

      {/* Navegación siguiente */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Contador de imágenes */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default function NoticiaModule({ newData }: { newData: INoticias }) {
  console.log(newData);
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const coverImage = getCoverImageUrl(newData);
  const additionalImages = getAdditionalImages(newData);
  const hasCoverImage = hasImages(newData);

  // Todas las imágenes para el modal (solo las de la galería, sin incluir portada)
  const allImages = additionalImages;

  // Funciones para el modal
  const openModal = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentImageIndex(0);
    // Restaurar scroll del body
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Manejar teclas del teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isModalOpen) return;
    
    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  }, [isModalOpen, closeModal, nextImage, prevImage]);

  // Agregar/remover event listeners
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

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
                quality={75}
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
                  {newData.destinatario.charAt(0).toUpperCase() +
                    newData.destinatario.slice(1)}
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
          </CardContent>

          {/* Galería de imágenes adicionales optimizada */}
          {additionalImages.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="text-primary" size={20} />
                <h3 className="text-lg font-semibold text-primary">
                  Galería de imágenes
                </h3>
                <span className="text-sm text-muted-foreground">
                  (Click para ampliar)
                </span>
              </div>

              {additionalImages.length === 1 ? (
                // Una sola imagen adicional
                <div className="relative w-full max-w-2xl mx-auto">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={getImageUrl(additionalImages[0])}
                      alt={`Imagen de ${newData.titulo}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      quality={60}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                      onError={handleImageError}
                    />
                    {/* Overlay clickeable para abrir modal */}
                    <button
                      onClick={() => openModal(0)}
                      className="absolute inset-0 w-full h-full bg-transparent hover:bg-black hover:bg-opacity-10 transition-all cursor-pointer group"
                    >
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon size={16} />
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                // Carrusel optimizado para múltiples imágenes
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent>
                    {additionalImages.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-full md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-1">
                          <div className="relative aspect-square overflow-hidden rounded-lg">
                            <Image
                              src={getImageUrl(image)}
                              alt={`Imagen ${index + 1} de ${newData.titulo}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              quality={50}
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              onError={handleImageError}
                            />
                            {/* Overlay clickeable para abrir modal */}
                            <button
                              onClick={() => openModal(index)}
                              className="absolute inset-0 w-full h-full bg-transparent hover:bg-black hover:bg-opacity-20 transition-all cursor-pointer group"
                            >
                              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <ImageIcon size={14} />
                              </div>
                            </button>
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
          
          <div className="text-xs text-muted-foreground border-t pt-4 flex justify-end m-4">
            <span>
              Publicado: {new Date(newData.created).toLocaleDateString("es-ES")}
            </span>
            {newData.modified !== newData.created && (
              <span className="ml-4">
                Actualizado:{" "}
                {new Date(newData.modified).toLocaleDateString("es-ES")}
              </span>
            )}
          </div>

          {/* Mensaje cuando no hay imágenes */}
          {!hasCoverImage && additionalImages.length === 0 && (
            <div className="p-6 border-t text-center text-muted-foreground">
              <ImageIcon className="mx-auto mb-2 opacity-50" size={24} />
              <p className="text-sm">Esta noticia no contiene imágenes</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modal de imágenes */}
      <ImageModal
        images={allImages}
        currentIndex={currentImageIndex}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
}
