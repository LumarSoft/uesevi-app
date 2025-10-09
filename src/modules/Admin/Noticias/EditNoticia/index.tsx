/* eslint-disable @next/next/no-img-element */

"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { File, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateData } from "@/services/mysql/functions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { INoticias } from "@/shared/types/Querys/INoticias";
import { BASE_API_URL } from "@/shared/providers/envProvider";

// Constantes para optimización
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const PREVIEW_MAX_WIDTH = 200;
const PREVIEW_MAX_HEIGHT = 200;

// Función para redimensionar imagen
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      let { width: newWidth, height: newHeight } = img;

      // Calcular nuevas dimensiones manteniendo la proporción
      if (width > PREVIEW_MAX_WIDTH || height > PREVIEW_MAX_HEIGHT) {
        const ratio = Math.min(
          PREVIEW_MAX_WIDTH / width,
          PREVIEW_MAX_HEIGHT / height
        );
        newWidth = width * ratio;
        newHeight = height * ratio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            resolve(URL.createObjectURL(file));
          }
        },
        file.type,
        0.8
      ); // Calidad del 80%
    };

    img.src = URL.createObjectURL(file);
  });
};

// Componente de preview de imagen optimizado
const ImagePreview = ({
  file,
  index,
  onRemove,
  isExisting = false,
}: {
  file: any;
  index: number;
  onRemove: (index: number) => void;
  isExisting?: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const processImage = async () => {
      try {
        if (isExisting) {
          // Es una imagen existente del servidor
          setImageUrl(`${BASE_API_URL}/uploads/${file.nombre}`);
          setIsLoading(false);
        } else {
          // Es un archivo nuevo
          const url = await resizeImage(file);
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        setError(true);
        setIsLoading(false);
      }
    };

    processImage();

    // Cleanup function to revoke URL when component unmounts
    return () => {
      if (imageUrl && !isExisting) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [file, isExisting]);

  if (error) {
    return (
      <div className="relative group">
        <div className="w-full h-20 bg-red-100 border border-red-300 rounded-md flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-20 bg-gray-200 rounded-md animate-pulse"></div>
    );
  }

  return (
    <div className="relative group">
      <img
        src={imageUrl}
        alt={`Preview ${index + 1}`}
        className="w-full h-20 object-cover rounded-md border"
        loading="lazy"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
        {file.name ? file.name.substring(0, 10) : file.nombre?.substring(0, 10)}
        ...
      </div>
    </div>
  );
};

// Función para verificar si es un archivo de forma robusta
const isFileObject = (obj: any): obj is File => {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.size === "number" &&
    typeof obj.type === "string" &&
    typeof obj.name === "string" &&
    typeof obj.lastModified === "number"
  );
};

export default function EditNoticiaModule({ data }: { data: INoticias }) {
  const [headline, setHeadline] = useState(data.titulo);
  const [epigraph, setEpigraph] = useState(data.epigrafe);
  const [body, setBody] = useState(data.cuerpo);
  const [secondBody, setSecondBody] = useState(data.cuerpo_secundario);
  const [images, setImages] = useState<any[]>(data.images || []);
  const [pdf, setPdf] = useState<string | File | null>(data.archivo || null);
  const [addressee, setAddressee] = useState(data.destinatario || "");
  const [dragOver, setDragOver] = useState(false);
  const [dragOverPdf, setDragOverPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateFiles = useCallback(
    (files: File[]) => {
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} no es una imagen válida`);
          return false;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} es demasiado grande (máximo 5MB)`);
          return false;
        }
        return true;
      });

      if (validFiles.length + images.length > MAX_IMAGES) {
        toast.error(`Máximo ${MAX_IMAGES} imágenes permitidas`);
        return validFiles.slice(0, MAX_IMAGES - images.length);
      }

      return validFiles;
    },
    [images.length]
  );

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      setIsProcessing(true);
      const fileArray = Array.from(files);
      const validFiles = validateFiles(fileArray);

      if (validFiles.length > 0) {
        setImages((prev) => [...prev, ...validFiles]);
      }

      setIsProcessing(false);
      // Limpiar el input
      e.target.value = "";
    },
    [validateFiles]
  );

  const handleImageDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      setIsProcessing(true);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        setImages((prev) => [...prev, ...validFiles]);
      }

      setIsProcessing(false);
    },
    [validateFiles]
  );

  const handleImageDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(true);
    },
    []
  );

  const handleImageDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
    },
    []
  );

  const removeImage = useCallback((indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("El archivo PDF es demasiado grande (máximo 5MB)");
        return;
      }
      setPdf(file);
    }
  };

  const handlePdfDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverPdf(false);

    const file = e.dataTransfer.files[0];

    if (file && file.type === "application/pdf") {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("El archivo PDF es demasiado grande (máximo 5MB)");
        return;
      }
      setPdf(file);
    }
  };

  const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverPdf(true);
  };

  const handlePdfDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverPdf(false);
  };

  const removePdf = () => {
    setPdf(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Primero validamos que esten los campos obligatorios
    if (!headline || !epigraph || !body || !addressee) {
      toast.error("Debe llenar los campos obligatorios");
      return;
    }

    // Separar imágenes nuevas de las existentes
    const newImages = images.filter((img) => isFileObject(img));
    const existingImages = images.filter((img) => !isFileObject(img));

    try {
      const formData = new FormData();
      formData.append("headline", headline);
      formData.append("epigraph", epigraph);
      formData.append("body", body);
      formData.append("body2", secondBody || "");

      // Si el destinatario es "todos", enviamos una cadena especial que el backend interpretará como null
      const finalAddressee = addressee === "todos" ? "null" : addressee;
      formData.append("addressee", finalAddressee);

      // Añade nuevas imágenes (solo archivos File válidos)
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      // Enviar IDs de imágenes existentes que se mantienen
      existingImages.forEach((image, index) => {
        if (image.id) {
          formData.append("existingImages", image.id.toString());
        }
      });

      // Añade el archivo PDF
      if (pdf) {
        if (isFileObject(pdf)) {
          formData.append("pdf", pdf);
        } else if (typeof pdf === "string") {
          formData.append("existingPdf", pdf);
        }
      }

      console.log("Enviando FormData con:", {
        headline,
        epigraph,
        body,
        secondBody,
        addressee,
        newImagesCount: newImages.length,
        existingImagesCount: existingImages.length,
        pdfType: typeof pdf,
        pdfSize: isFileObject(pdf) ? pdf.size : "existing",
      });

      const result = await updateData("news/:id", data.id, formData);

      if (result.ok) {
        toast.success("Noticia actualizada correctamente");
      } else {
        console.error("Failed to update news:", result);
        toast.error(result.message || "Error al actualizar la noticia");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      toast.error("Error al enviar los datos");
    }
  };

  // Memoizar la vista previa del carousel para evitar re-renders innecesarios
  const carouselImages = useMemo(() => {
    return images.map((img, index) => (
      <CarouselItem key={`${img.name || img.nombre}-${index}`}>
        <img
          src={
            img.type
              ? URL.createObjectURL(img)
              : `${BASE_API_URL}/uploads/${img.nombre}`
          }
          alt={`News Image ${index + 1}`}
          className="rounded-md object-cover aspect-[16/9]"
          loading="lazy"
        />
      </CarouselItem>
    ));
  }, [images]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full ">
      <form
        className="bg-background p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <Label>Destinatario (obligatorio)</Label>
          <Select onValueChange={setAddressee} value={addressee}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="afiliados">Afiliados</SelectItem>
              <SelectItem value="empresas">Empresas</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="headline">Titulo (obligatorio)</Label>
          <Input
            id="headline"
            placeholder="Escriba el titulo"
            defaultValue={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="epigraph">Epigrafe (obligatorio)</Label>
          <Input
            id="epigraph"
            placeholder="Escriba el epigrafe"
            defaultValue={epigraph}
            onChange={(e) => setEpigraph(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Primer cuerpo (obligatorio)</Label>
          <Textarea
            id="body"
            placeholder="Cuerpo de la noticia"
            defaultValue={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Imágenes (No obligatorio) - Máximo {MAX_IMAGES}</Label>
          {isProcessing && (
            <div className="text-sm text-blue-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Procesando imágenes...
            </div>
          )}
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
            onDrop={handleImageDrop}
            onDragOver={handleImageDragOver}
            onDragLeave={handleImageDragLeave}
            onClick={() =>
              !isProcessing && document.getElementById("images")?.click()
            }
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {dragOver
                    ? "Suelta las imágenes aquí"
                    : "Arrastra imágenes aquí o haz clic para seleccionar"}
                </p>
                <p className="text-xs">
                  Formatos: JPG, PNG, GIF (máximo 5MB cada una)
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {images.length}/{MAX_IMAGES} imágenes seleccionadas
                </p>
              </div>
            </div>
            <Input
              id="images"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="hidden"
              disabled={isProcessing}
            />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {images.map((img, index) => (
                <ImagePreview
                  key={`${img.name || img.nombre}-${
                    img.size || img.id
                  }-${index}`}
                  file={img}
                  index={index}
                  onRemove={removeImage}
                  isExisting={!img.type}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Archivo PDF (No obligatorio)</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
              dragOverPdf
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handlePdfDrop}
            onDragOver={handlePdfDragOver}
            onDragLeave={handlePdfDragLeave}
            onClick={() => document.getElementById("file")?.click()}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <File className="h-8 w-8" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {dragOverPdf
                    ? "Suelta el PDF aquí"
                    : "Arrastra un PDF aquí o haz clic para seleccionar"}
                </p>
                <p className="text-xs">Solo archivos PDF (máximo 5MB)</p>
              </div>
            </div>
            <Input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {pdf && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <File className="h-5 w-5 text-red-600" />
              <span className="flex-1 text-sm font-medium">
                {typeof pdf === "string" ? pdf : pdf.name}
              </span>
              {typeof pdf !== "string" && (
                <span className="text-xs text-muted-foreground">
                  {(pdf.size / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
              <button
                type="button"
                onClick={removePdf}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Segundo cuerpo (No obligatorio)</Label>
          <Textarea
            id="body"
            placeholder="Cuerpo de la noticia"
            defaultValue={secondBody}
            onChange={(e) => setSecondBody(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <Button disabled={isProcessing}>
          {isProcessing ? "Procesando..." : "Guardar"}
        </Button>
      </form>

      <div className="bg-muted p-8 flex flex-col justify-center items-center">
        <Card className="w-full max-w-2xl flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="font-bold text-4xl">
              {headline || "TITULO DE LA NOTICIA"}
            </CardTitle>
          </CardHeader>
          <CardContent className=" overflow-y-auto flex flex-col justify-between">
            <div className="prose text-muted-foreground w-full">
              <p className="font-bold break-words overflow-hidden text-ellipsis">
                {epigraph ||
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum!"}
              </p>
              <p className="break-words overflow-hidden text-ellipsis">
                {body ||
                  " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum! Cum nobis ut esse ad earum architecto distinctio quis voluptatem ea voluptatibus.  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum! Cum nobis ut esse ad earum architecto distinctio quis voluptatem ea voluptatibus.  "}
              </p>
            </div>
            {pdf && (
              <a
                className="flex gap-2 border w-fit px-4 py-2 rounded-full"
                href={
                  typeof pdf === "string"
                    ? `${BASE_API_URL}/uploads/${pdf}`
                    : URL.createObjectURL(pdf)
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Archivo <File />
              </a>
            )}
            {images.length > 0 ? (
              images.length > 1 ? (
                <Carousel className="mt-6">
                  <CarouselContent>{carouselImages}</CarouselContent>
                </Carousel>
              ) : (
                <img
                  src={
                    images[0].type
                      ? URL.createObjectURL(images[0])
                      : `${BASE_API_URL}/uploads/${images[0].nombre}`
                  }
                  alt="News Image"
                  className="rounded-md object-cover aspect-[16/9] mt-6"
                  loading="lazy"
                />
              )
            ) : (
              <img
                src="/logo_uesevi.png"
                alt="Default Image"
                className="rounded-md object-cover aspect-[16/9] mt-6"
              />
            )}
            <div className="prose text-muted-foreground w-full">
              <p className="break-words overflow-hidden text-ellipsis">
                {secondBody ||
                  " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum! Cum nobis ut esse ad earum architecto distinctio quis voluptatem ea voluptatibus.  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum! Cum nobis ut esse ad earum architecto distinctio quis voluptatem ea voluptatibus.  Lorem ipsum dolor sit, amet consectetur adipisicamente elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum! Cum nobis ut esse ad earum architecto distinctio quis voluptatem ea voluptatibus."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
