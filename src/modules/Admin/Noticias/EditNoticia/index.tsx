/* eslint-disable @next/next/no-img-element */

"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { File } from "lucide-react";
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

export default function EditNoticiaModule({ data }: { data: INoticias }) {
  const [headline, setHeadline] = useState(data.titulo);
  const [epigraph, setEpigraph] = useState(data.epigrafe);
  const [body, setBody] = useState(data.cuerpo);
  const [secondBody, setSecondBody] = useState(data.cuerpo_secundario);
  const [images, setImages] = useState<any[]>(data.images || []);
  const [pdf, setPdf] = useState<string | File | null>(data.archivo || null);
  const [destinatario, setDestinatario] = useState(data.destinatario || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(Array.from(files)); // Convierte los archivos a un array
    } else {
      setImages([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdf(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", headline);
    formData.append("epigrafe", epigraph);
    formData.append("cuerpo", body);
    formData.append("cuerpo2", secondBody || "");
    formData.append("destinatario", destinatario);

    // Añade nuevas imágenes
    images.forEach((image) => {
      formData.append("images", image);
    });

    // Añade el archivo PDF
    if (pdf) {
      formData.append("pdf", pdf);
    }

    const res = await updateData("noticias/update-noticia", data.id, formData);

    console.log(res);

    if (res.affectedRows > 0) {
      toast.success("Noticia actualizada correctamente");
    } else {
      toast.error("Ocurrió un error al actualizar la noticia");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full ">
      <form
        className="bg-background p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <Label>Destinatario (obligatorio)</Label>
          <Select onValueChange={setDestinatario}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="afiliados">Afiliados</SelectItem>
              <SelectItem value="empresas">Empresas</SelectItem>
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
          <Label htmlFor="images">Imágenes (No obligatorio)</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple // Permite la selección de múltiples archivos
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Archivo PDF (No obligatorio)</Label>
          <Input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
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

        <Button>Guardar</Button>
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
                    ? `${BASE_API_URL}/${pdf}`
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
                  <CarouselContent>
                    {images.map((img, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={
                            img.type
                              ? URL.createObjectURL(img)
                              : `${BASE_API_URL}/${img.nombre}`
                          }
                          alt={`News Image ${index + 1}`}
                          className="rounded-md object-cover aspect-[16/9]"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <img
                  src={
                    images[0].type
                      ? URL.createObjectURL(images[0])
                      : `${BASE_API_URL}/${images[0].nombre}`
                  }
                  alt="News Image"
                  className="rounded-md object-cover aspect-[16/9] mt-6"
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
                  " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum! Cum nobis ut esse ad earum architecto distinctio quis voluptatem ea voluptatibus.  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum! Cum nobis ut esse ad earum architecto distinctio quis voluptatem ea voluptatibus.  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat quasi nam dolor commodi provident illum repellendus nostrum voluptatum! Cum nobis ut esse ad earum architecto distinctio quis voluptatem ea voluptatibus."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
