import { FramerComponent } from "@/shared/Framer/FramerComponent";
import Image from "next/image";
import React from "react";

const AboutUs = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 xl:gap-20 justify-center items-center lg:pt-32 px-4 md:px-28 2xl:px-80">
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
            alt="Imagen representativa del sindicato"
            style={{ objectFit: "cover" }}
            className="rounded-md"
            priority
          />
        </div>
      </FramerComponent>
      <FramerComponent
        style="flex flex-col gap-2 lg:max-w-lg"
        animationInitial={{ x: 200, opacity: 0 }}
        animationWhileInView={{ x: 0, opacity: 1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        <h3 className="text-primary font-semibold text-4xl">
          Sobre nosotros
        </h3>
        <p className="text-muted-foreground">
          El SINDICATO UNION DE EMPLEADOS DE SEGURIDAD Y VIGILANCIA es una
          asociación fundada el 15 de marzo de 1987. Obtuvo su Inscripción
          Gremial por resolución Nº 370/1988 el 10/05/88, inscribiéndose en el
          registro respectivo con el Nº 2811 como entidad gremial de 1º GRADO.
        </p>
        <h2 className="text-xl lg:text-xl">
          Nuestra zona de actuación abarca la Provincia de Santa Fe, incluyendo
          los departamentos de ROSARIO, VILLA CONSTITUCIÓN, GENERAL LÓPEZ,
          CASEROS, IRIONDO Y SAN LORENZO.
        </h2>
      </FramerComponent>
    </div>
  );
};

export default AboutUs;
