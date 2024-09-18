import { FramerComponent } from "@/shared/Framer/FramerComponent";
import Image from "next/image";
import React from "react";

const AboutUs = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 xl:gap-20 justify-center lg:h-screen items-center px-4 md:px-28 2xl:px-80">
      <FramerComponent
        style="w-full h-96 bg-neutral-400 rounded-md lg:max-w-xl lg:h-[40rem]"
        animationInitial={{ x: -200, opacity: 0 }}
        animationWhileInView={{ x: 0, opacity: 1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/about.jpg"
            fill
            alt="Imagen de avión"
            style={{ objectFit: "cover" }}
            className="rounded-md"
            priority
          />
        </div>
      </FramerComponent>
      <FramerComponent
        style="flex flex-col gap-2  lg:max-w-lg"
        animationInitial={{ x: 200, opacity: 0 }}
        animationWhileInView={{ x: 0, opacity: 1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        <h3 className="text-[#5f92cc] font-semibold text-2xl">Nosotros hacemos esto</h3>
        <p className="text-neutral-400">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime modi
          iste facilis eligendi asperiores laborum officia nemo beatae impedit,
          natus saepe consequuntur iure eius perspiciatis debitis explicabo enim
          dolor ex.
        </p>
        <h2 className="text-xl lg:text-2xl font-semibold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, quia
          labore. Dignissimos ex adipisci optio libero, quam suscipit architecto
          velit quas vel cupiditate voluptatem veritatis distinctio assumenda ad
          consectetur odit.
        </h2>
      </FramerComponent>
    </div>
  );
};

export default AboutUs;
