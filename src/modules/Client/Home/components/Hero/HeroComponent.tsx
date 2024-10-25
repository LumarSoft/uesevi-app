"use client";
import { Button } from "@/components/ui/button";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import Link from "next/link";
import React from "react";

export const HeroComponent = () => {
  const scrollNoticias = () => {
    document.getElementById("lastestNews")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <section className="h-screen max-h-screen w-full flex">
      <div className="w-full h-full flex lg:justify-end justify-center items-center">
        <FramerComponent
          style="flex flex-col items-center"
          animationInitial={{ x: -200, opacity: 0 }}
          animationAnimate={{ x: 0, opacity: 1 }}
        >
          <img src="/logo_uesevi.png" alt="" className="w-3/4" />
          <Button className="w-1/2 mt-4">
            <Link href={"/noticias/page/1"}>Ultimas noticias</Link>
          </Button>
          <img
            src="/flecha.svg"
            className="w-14 mt-14 animate-bounce animate-infinite cursor-pointer"
            alt="arrowIcon"
            onClick={scrollNoticias}
          />
        </FramerComponent>
      </div>
      <FramerComponent
        style="w-full h-full justify-end hidden lg:flex"
        animationInitial={{ x: 200, opacity: 0 }}
        animationAnimate={{ x: 0, opacity: 1 }}
      >
        <img src="/SeguridadImage.png" alt="" />
      </FramerComponent>
    </section>
  );
};
