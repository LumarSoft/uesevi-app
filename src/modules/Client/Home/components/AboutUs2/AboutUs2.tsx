import { FramerComponent } from "@/shared/Framer/FramerComponent";
import Image from "next/image";
import React from "react";

const AboutUs2 = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 xl:gap-20 justify-center  items-center px-4 md:px-28 2xl:px-80 mt-12 lg:mt-0 lg:pt-32">
      <FramerComponent
        style="flex flex-col gap-2 lg:max-w-lg"
        animationInitial={{ x: 200, opacity: 0 }}
        animationWhileInView={{ x: 0, opacity: 1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        <h3 className="text-primary font-semibold text-4xl">
          Nuestra Historia y Logros
        </h3>
        <p className="text-muted-foreground">
          El 1 de diciembre de 2016, se nos otorgó la PERSONERIA GREMIAL N°
          1917, con zona de actuación en todo el territorio del Departamento
          Rosario, Provincia de Santa Fe. En septiembre 2017, firmamos nuestro
          CCT 762/19 y nuestro primer acuerdo paritario, homologado por el
          Ministerio de Trabajo de la Nación.
        </p>
        <h2 className="text-xl lg:text-xl">
          Desde mayo del 2022, U.E. SE.VI integra la FEDERACION ARGENTINA DE
          TRABAJADORES DE LA SEGURIDAD PRIVADA – FATRASEP, siendo uno de sus
          miembros fundadores. Estamos comprometidos con la protección de los
          derechos de todos los trabajadores que representamos.
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
            src="/about2.jpg"
            fill
            style={{ objectFit: "cover" }}
            alt="Imagen representativa de nuestro sindicato"
            className="rounded-md"
          />
        </div>
      </FramerComponent>
    </div>
  );
};

export default AboutUs2;
