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
            src="/about.png"
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
        <h3 className="text-primary font-semibold text-4xl">Sobre nosotros</h3>
        <p className="text-muted-foreground">
          El SINDICATO UNION DE EMPLEADOS DE SEGURIDAD Y VIGILANCIA es una
          asociación fundada el 15 de marzo de 1987 con Inscripción Gremial
          otorgada por resolución Nº 370/1988 de fecha 10/05/88 e inscrita en el
          registro respectivo con el Nº 2811 con carácter de entidad gremial 1º
          GRADO con zona de actuación en la Provincia de Santa Fe, incluyéndose
          los departamentos de ROSARIO, VILLA CONSTITUCIÓN, GENERAL LÓPEZ,
          CASEROS, IRIONDO Y SAN LORENZO. Con fecha 01 de diciembre de 2016, a
          través de la Resolución ministerial RESOL-2016-1000-E-APN-MT, se nos
          otorgó la PERSONERIA GREMIAL N° 1917, con zona de actuación en todo el
          territorio del Departamento Rosario, Provincia de Santa Fe.,
          habiéndose publicado los edictos respectivos en el Boletín Oficial de
          la República Argentina en fecha 10 de marzo de 2017.- En septiembre
          2017 firmamos nuestro CCT 762/19 y nuestro primer acuerdo paritario el
          cual también fue homologado por el Ministerio de Trabajo de la Nación.
          Desde mayo del 2022 U.E. SE.VI integra la FEDERACION ARGENTINA DE
          TRABAJADORES DE LA SEGURIDAD PRIVADA – FATRASEP, siendo uno de sus
          miembros fundadores . Nuestro Sindicato representa a los trabajadores
          y las trabajadoras de la seguridad privada del departamento Rosario y
          su Zona de influencia estando abocados de pleno a la protección de los
          derechos de todos los trabajadores que representamos.
        </p>
      </FramerComponent>
    </div>
  );
};

export default AboutUs;
