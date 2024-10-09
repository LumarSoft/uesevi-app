import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FramerComponent } from "@/shared/Framer/FramerComponent";

export const Beneficios = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <FramerComponent
        style="space-y-6"
        animationInitial={{ x: -200, opacity: 0 }}
        animationWhileInView={{ x: 0, opacity: 1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        <Card className="hover:bg-muted transition">
          <CardHeader>
            <CardTitle>Requisitos para Afiliarse</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Prestar servicios en empresas y/o agencias privadas de seguridad
                y/o vigilancia y empresas de investigación privada
              </li>
              <li>
                Empleados administrativos de empresas de seguridad y vigilancia,
                tanto de protección física, custodias móviles, protección y
                vigilancia electronica y servicios conexos a los mismos
              </li>
              <li>
                Cumplir tareas de seguridad y/o custodia, vigilancia e
                investigaciones en empresas privadas o públicas, entes o
                instituciones estatales o paraestatales y personas privadas o
                jurídicas cumpliendo tareas de seguridad y/o vigilancia de tipo
                comercial, industrial, civil, financiero-agropecuario, propiedad
                de bienes y propiedad intelectual y/o patentes de invención y/o
                investigaciones privadas
              </li>
              <li>
                Personal que realice tareas de control de admisión y permanencia
                de publico en general
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted transition">
          <CardHeader>
            <CardTitle>Beneficios de la Afiliación</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Subsidios por nacimiento, adopción y fallecimiento</li>
              <li>Asesoramiento legal</li>
              <li>
                Entrega de kit escolar para hijos de afiliados en edad escolar
                en el mes de febrero con previa inscripción
              </li>
              <li>Entrega de bolsones de mercaderias</li>
              <li>Entrega de cajas navideñas</li>
              <li>Descuento en optica</li>
              <li>Descuento en vacuna antigripal</li>
              <li>atención en clinicas oeste</li>
              <li>Descuentos en laboratorios y practicas</li>
              <li>Servicio de emergencias medicas para el afiliado</li>
              <li>Camping</li>
              <li>Servicio de sepelio</li>
              <li>
                Descuento en farmacias. La receta medica debe contener:
                &quot;SANCOR SEGUROS/SEGURAMAX&quot;. consultar farmacias
                adheridas haciendo click aqui{" "}
                <a
                  href="https://www.sancorseguros.com.ar/farmacias-vademecum"
                  className="text-primary"
                >
                  aqui
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </FramerComponent>

      <FramerComponent
        style="flex items-center justify-center"
        animationInitial={{ x: 200, opacity: 0 }}
        animationWhileInView={{ x: 0, opacity: 1 }}
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        <Image
          src="/monumento.jpg"
          alt="Imagen representativa del gremio"
          width={400}
          height={400}
          className="rounded-lg object-cover"
        />
      </FramerComponent>
    </div>
  );
};
