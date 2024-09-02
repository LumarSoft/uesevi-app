import { Button } from "@/components/ui/button";
import CardNoticias from "@/shared/components/CardNoticias/CardNoticias";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { INoticias } from "@/shared/types/Querys/INoticias";
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
        <h2 className="text-3xl font-bold mb-8 text-center">
          Ultimas noticias
        </h2>
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
              <CardNoticias noticia={noticia} />
            </FramerComponent>
          ))}
        </FramerComponent>
        <div className="text-center">
          <Link href="/noticias/page/1">
            <Button>Ver mas noticias</Button>
          </Link>
        </div>
      </div>
    </FramerComponent>
  );
};

export default LatestNews;
