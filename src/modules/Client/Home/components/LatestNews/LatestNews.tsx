import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { INoticias } from "@/shared/types/Querys/INoticias";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LatestNews = ({ noticias }: { noticias: INoticias[] }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
        viewport: { once: true, offset: 0.4 },
      },
    },
  };

  const itemAnimado = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  if (!noticias) return null;

  return (
    <FramerComponent
      style="lg:h-screen bg-muted flex justify-center items-center py-16"
      animationInitial={{ opacity: 0, y: 50 }}
      animationWhileInView={{ opacity: 1, y: 0 }}
      animationTransition={{ duration: 0.3, delay: 0.1 }}
      animationViewPort={{ once: true, offset: 0.4 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest News</h2>
        <FramerComponent
          style="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          animationVariants={container}
          animationInitial="hidden"
          animationWhileInView="show"
          animationViewPort={{ once: true, offset: 0.4 }}
        >
          {noticias.map((noticia, i) => (
            <FramerComponent
              key={i}
              animationInitial={{ opacity: 0, y: 50 }}
              animationVariants={itemAnimado}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">
                    {noticia.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="relative h-48 mb-4">
                    <Image
                      src={"/logo_uesevi.png"}
                      alt={noticia.titulo}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-sm flex-grow line-clamp-4">
                    {noticia.cuerpo}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Leer mas
                  </Button>
                </CardFooter>
              </Card>
            </FramerComponent>
          ))}
        </FramerComponent>
        <div className="text-center">
          <Link href="/news">
            <Button>Ver mas noticias</Button>
          </Link>
        </div>
      </div>
    </FramerComponent>
  );
};

export default LatestNews;
