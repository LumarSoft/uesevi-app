import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { Globe } from "lucide-react";
import React from "react";

const Coverage = () => {
  const localities = [
    "Villa Gobernador Gálvez",
    "Granadero Baigorria",
    "Pérez",
    "Funes",
    "Ibarlucea",
    "Alvear",
    "Arroyo Seco",
    "Pueblo Esther",
    "Zavalla",
    "General Lagos",
    "Soldini",
    "Piñero",
    "Alvarez",
    "Acebal",
    "Fighiera",
    "Coronel Bogado",
    "Villa Amelia",
    "Coronel Domínguez",
    "Pueblo Uranga",
    "Carmen del Sauce",
    "Pueblo Muñoz",
    "Albarellos",
    "Arminda",
  ];

  return (
    <FramerComponent
      style="md:py-32 flex justify-center items-center"
      animationInitial={{ opacity: 0, y: 50 }}
      animationWhileInView={{ opacity: 1, y: 0 }}
      animationTransition={{ duration: 0.3, delay: 0.1 }}
      animationViewPort={{ once: true, offset: 0.4 }}
    >
      <div className="w-full px-4 md:px-28 2xl:px-80 mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">
          Nuestra cobertura
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.5860443790298!2d-60.65104842359617!3d-32.935533571328676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab39d5d541eb%3A0xb84e8b229a27bc01!2sU.E.SE.VI%20-%20UNION%20EMPLEADOS%20DE%20SEGURIDAD%20Y%20VIGILANCIA!5e0!3m2!1ses-419!2sar!4v1724696994695!5m2!1ses-419!2sar"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2" />
                  Localidades incluidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {localities.map((locality, index) => (
                    <Badge
                      variant="secondary"
                      key={index}
                      className="justify-start"
                    >
                      {locality}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FramerComponent>
  );
};

export default Coverage;
