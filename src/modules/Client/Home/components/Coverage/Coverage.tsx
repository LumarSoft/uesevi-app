import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { Globe } from "lucide-react";
import Image from "next/image";
import React from "react";

const Coverage = () => {
  const localities = {
    "Área Metropolitana de Rosario (Cercana)": [
      "Villa Gobernador Gálvez",
      "Granadero Baigorria",
      "Pérez",
      "Funes",
      "Ibarlucea",
      "Alvear",
    ],
    "Área Suburbana (Intermedia)": [
      "Arroyo Seco",
      "Pueblo Esther",
      "Zavalla",
      "General Lagos",
      "Soldini",
      "Piñero",
    ],
    "Área Rural y Periférica (Lejana)": [
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
    ],
  };

  return (
    <FramerComponent
      style="py-16 lg:h-screen flex justify-center items-center"
      animationInitial={{ opacity: 0, y: 50 }}
      animationWhileInView={{ opacity: 1, y: 0 }}
      animationTransition={{ duration: 0.3, delay: 0.1 }}
      animationViewPort={{ once: true, offset: 0.4 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Covertura</h2>
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
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(localities).map(([region, towns], i) => (
                    <AccordionItem value={`item-${i}`} key={i}>
                      <AccordionTrigger>{region}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                          {towns.map((locality, index) => (
                            <Badge
                              variant="secondary"
                              key={index}
                              className="justify-start"
                            >
                              {locality}
                            </Badge>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FramerComponent>
  );
};

export default Coverage;
