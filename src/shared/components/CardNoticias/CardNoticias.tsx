"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { INoticias } from "@/shared/types/Querys/INoticias";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ImageSkeleton from "../ImageSkeleton/ImageSkeleton";
import { getCoverImageUrl, handleImageError } from "@/shared/utils/imageUtils";

const CardNoticias = ({ noticia }: { noticia: INoticias }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const coverImage = getCoverImageUrl(noticia);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    handleImageError(e);
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <Card className="flex flex-col h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center text-primary leading-tight tracking-tight hover:text-primary/90 transition-colors bg-blue-100 rounded-md">
          {noticia.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 px-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          {imageLoading && !imageError && (
            <ImageSkeleton className="absolute inset-0" />
          )}
          <Image
            src={coverImage}
            alt={noticia.titulo}
            fill
            className={`object-cover transform hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onLoad={handleImageLoad}
            onError={onImageError}
          />
        </div>
        <p className="text-sm text-gray-600 flex-grow line-clamp-4 leading-relaxed">
          {noticia.cuerpo}
        </p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="default" className="w-full rounded-lg font-semibold ">
          <Link href={`/noticias/${noticia.id}`} className="w-full text-center">
            Leer más
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardNoticias;
