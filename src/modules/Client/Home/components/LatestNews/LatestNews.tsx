import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LatestNews = () => {
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
  return (
    <section className="bg-muted flex items-center mt-14 pt-6 lg:h-screen">
      <FramerComponent
        style="container px-4"
        animationInitial={{ opacity: 0, y: 50 }}
        animationWhileInView={{ opacity: 1, y: 0 }}
        animationTransition={{ duration: 0.3, delay: 0.1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
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
          {[1, 2, 3].map((i) => (
            <FramerComponent
              key={i}
              animationInitial={{ opacity: 0, y: 50 }}
              animationVariants={itemAnimado}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Nueva noticia</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={`/placeholder.svg?height=200&width=300&text=News+${i}`}
                    alt={`News ${i}`}
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Ver mas</Button>
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
      </FramerComponent>
    </section>
  );
};

export default LatestNews;
