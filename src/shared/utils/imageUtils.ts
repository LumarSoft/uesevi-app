import { INoticias } from "@/shared/types/Querys/INoticias";

/**
 * Obtiene la URL de la imagen de portada de una noticia
 * Prioridad: cover_image > portada > primera imagen del array > fallback
 */
export const getCoverImageUrl = (noticia: INoticias): string => {
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  
  if (noticia.cover_image) {
    return `${BASE_API_URL || ''}/uploads/${noticia.cover_image}`;
  }
  
  if (noticia.portada) {
    return `https://uesevi.org.ar/img/news/main/${noticia.portada}`;
  }
  
  if (noticia.images && noticia.images.length > 0) {
    const firstImage = noticia.images[0];
    const imageName = typeof firstImage === 'string' ? firstImage : firstImage.nombre;
    return `${BASE_API_URL || ''}/uploads/${imageName}`;
  }
  
  return "/logo_uesevi.png";
};

/**
 * Obtiene las imágenes adicionales (excluyendo la portada) para la galería
 */
export const getAdditionalImages = (noticia: INoticias): any[] => {
  if (!noticia.images || noticia.images.length === 0) return [];
  
  // Si tenemos cover_image, mostrar todas las imágenes en la galería
  if (noticia.cover_image) {
    return noticia.images;
  }
  
  // Si no tenemos cover_image pero sí imágenes, excluir la primera (que se usa como portada)
  return noticia.images.slice(1);
};

/**
 * Construye la URL completa para una imagen de galería
 */
export const getImageUrl = (image: any): string => {
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const imageName = typeof image === 'string' ? image : image.nombre;
  return `${BASE_API_URL || ''}/uploads/${imageName}`;
};

/**
 * Verifica si una noticia tiene imágenes
 */
export const hasImages = (noticia: INoticias): boolean => {
  return !!(noticia.cover_image || noticia.portada || (noticia.images && noticia.images.length > 0));
};

/**
 * Verifica si una noticia tiene múltiples imágenes para mostrar galería
 */
export const hasMultipleImages = (noticia: INoticias): boolean => {
  const additionalImages = getAdditionalImages(noticia);
  return additionalImages.length > 1;
};

/**
 * Maneja errores de carga de imagen estableciendo una imagen de fallback
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement;
  target.src = "/logo_uesevi.png";
}; 