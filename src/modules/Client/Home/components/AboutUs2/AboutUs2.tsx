import { FramerComponent } from "@/shared/Framer/FramerComponent";
import Image from "next/image";
import React from "react";

const AboutUs2 = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 xl:gap-20 justify-center lg:h-screen items-center px-4 md:px-28 2xl:px-80 mt-12 lg:mt-0">
      <FramerComponent
        style="flex flex-col gap-2 lg:pt-24 lg:max-w-lg"
        animationInitial={{ x: 200, opacity: 0 }}
        animationWhileInView={{ x: 0, opacity: 1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        <h3 className="text-[#5f92cc] font-semibold text-2xl">TITULO 2</h3>
        <p className="text-neutral-400">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
          eligendi nostrum repudiandae laborum incidunt labore delectus, amet
          magni mollitia iste ipsa reiciendis
        </p>
        <h2 className="text-xl lg:text-2xl font-semibold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae,
          eligendi harum fugiat doloribus rem culpa maxime officia ipsa
          aspernatur similique. Blanditiis quam aut fuga quo quos! Id et veniam
          esse. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Quisquam recusandae perferendis odio culpa nam autem laudantium, ut
          tempora quibusdam a nihil nobis fuga numquam, alias facere minima ad
          voluptas eaque.
        </h2>
      </FramerComponent>
      <FramerComponent
        style="w-full h-96 bg-neutral-400 rounded-md lg:max-w-xl lg:h-[40rem]"
        animationInitial={{ x: -200, opacity: 0 }}
        animationWhileInView={{ x: 0, opacity: 1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/infraestructura.jpg"
            fill
            style={{ objectFit: "cover" }}
            alt="Imagen de avión"
            className="rounded-md"
          />
        </div>
      </FramerComponent>
    </div>
  );
};

export default AboutUs2;