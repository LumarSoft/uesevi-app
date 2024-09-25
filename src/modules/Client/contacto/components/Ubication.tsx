import { FramerComponent } from "@/shared/Framer/FramerComponent";
import {
  Building,
  MapPin,
  MapPinIcon,
  Phone,
  UserCog,
  Users,
} from "lucide-react";
import React from "react";

const Ubication = () => {
  return (
    <FramerComponent
      style="text-primary-foreground p-8  flex flex-col justify-center items-center bg-gradient-to-br from-slate-800 to-slate-900"
      animationInitial={{ x: 200, opacity: 0, backgroundColor: "white" }}
      animationAnimate={{ x: 0, opacity: 1, backgroundColor: "#334155" }}
    >
      <div className="w-full max-w-xl space-y-8 text-center lg:pt-16 ">
        <div className="flex flex-col items-center space-y-4">
          <MapPin className="w-12 h-12" />
          <h2 className="text-3xl font-bold lg:text-4xl">¿Dónde estamos?</h2>
        </div>
        <div className="rounded-xl overflow-hidden w-full aspect-video">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13394.34349168578!2d-60.6484735!3d-32.9355381!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab39d5d541eb%3A0xb84e8b229a27bc01!2sU.E.SE.VI%20-%20UNION%20EMPLEADOS%20DE%20SEGURIDAD%20Y%20VIGILANCIA!5e0!3m2!1ses-419!2sar!4v1724781460423!5m2!1ses-419!2sar"
            className="w-full h-full"
            loading="lazy"
          ></iframe>
        </div>
        <div className="space-y-6 text-left text-lg">
          <h1 className="text-xl text-center font-bold uppercase">
            Union de Empleados de Seguridad y Vigilancia
          </h1>
          <div className="space-y-4 ">
            <span className="font-semibold flex items-center ">
              <MapPinIcon className="w-5 h-5 mr-2" />
              Mariano Moreno 58, CP 2000, Rosario, Santa Fe.
            </span>
            <span className="font-semibold flex items-center ">
              <Phone className="w-5 h-5 mr-2" /> 0341 2974615
            </span>
          </div>
        </div>
      </div>
    </FramerComponent>
  );
};

export default Ubication;
