import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { Building, MapPin, UserCog, Users } from "lucide-react";
import React from "react";

const Ubication = () => {
  return (
    <FramerComponent
      style="text-primary-foreground p-8  flex flex-col justify-center items-center"
      animationInitial={{ x: 200, opacity: 0, backgroundColor: "white" }}
      animationAnimate={{ x: 0, opacity: 1, backgroundColor: "#334155" }}
    >
      <div className="w-full max-w-xl space-y-8 text-center">
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
        <div className="space-y-6 text-left">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center">
                <Building className="w-5 h-5 mr-2" /> Taller CASA CENTRAL:
              </h4>
              <p>
                <b className="text-cyan-400"> (+54 911)</b> 4452-5240
              </p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center">
                <Building className="w-5 h-5 mr-2" /> Taller Anexo (ARGENPROP
                SRL):
              </h4>
              <p>
                <b className="text-cyan-400">(+54 911)</b> 4741-2035
              </p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" /> En Campaña
              </h4>
              <p>
                Juan Carlos: <b className="text-cyan-400">(+54 911)</b>{" "}
                15-5327-3431
              </p>
              <p>
                Pablo: <b className="text-cyan-400">(+54 911)</b> 15-3422-0562
              </p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center">
                <UserCog className="w-5 h-5 mr-2" /> Oficina Técnica /
                Administración
              </h4>
              <p>
                Oficina Técnica (Yanina):{" "}
                <b className="text-cyan-400">(+54 911)</b> 15-5384-4610
              </p>
              <p>
                Administración: <b className="text-cyan-400">(+54 911)</b>{" "}
                15-5036-4651
              </p>
            </div>
          </div>
        </div>
      </div>
    </FramerComponent>
  );
};

export default Ubication;
