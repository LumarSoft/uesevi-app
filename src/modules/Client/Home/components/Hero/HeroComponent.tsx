import { Button } from "@/components/ui/button";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import React from "react";

export const HeroComponent = () => {
  return (
    <section className="h-screen max-h-screen w-full flex">
      <div className="w-full h-full flex lg:justify-end justify-center items-center">
        <FramerComponent
          style="flex flex-col items-center"
          animationInitial={{ x: -200, opacity: 0 }}
          animationAnimate={{ x: 0, opacity: 1,  }}
        >
          <img src="/logo_uesevi.png" alt="" className="w-3/4" />
          <Button className="w-1/2 mt-4">Ultimas noticias</Button>
        </FramerComponent>
      </div>
      <FramerComponent
        style="w-full h-full justify-end hidden lg:flex"
        animationInitial={{ x: 200, opacity: 0 }}
        animationAnimate={{ x: 0, opacity: 1 }}
      >
        <img src="/hero2.png" alt="" />
      </FramerComponent>
    </section>
  );
};
