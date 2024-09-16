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
                Cumplir tareas de seguridad y/o custodia, vigilancia e
                investigaciones en empresas privadas o públicas, entes o
                instituciones estatales o paraestatales y personas privadas o
                jurídicas cumpliendo tareas de seguridad y/o vigilancia de tipo
                comercial, industrial, civil, financiero-agropecuario, propiedad
                de bienes y propiedad intelectual y/o patentes de invención y/o
                invetigaciones privadas
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
              <li>
                Cardiss: emergencias médicas, urgencias, visitas médicas
                domiciliarias, traslados programados
              </li>
              <li>
                Cochería Oeste: 2 complejos velatorios equipados con cocina,
                dormitorio de descanso, baños y un amplio estar climatizado,
                salas climatizadas, kinder, bar, desayuno, cafetería, servicio
                de portería, flota de vehículos de categoría.
              </li>
              <li>
                Farmacias: 50% de descuento en Red de Farmacias colegiadas en
                todo el país, con mas de 2500 puntos de atención. Programa de
                medicamentos ambulatorios. Acceso directo con credencial
                identificatoria + receta médica.
              </li>
              <li>
                Seguro de vida: convenio con sancor seguros, un monto $10.000
                por fallecimiento.
              </li>
              <li>
                Kit escolar: presentar certificado de escolaridad, último recibo
                de sueldo, dni original y copia del empleado y del beneficiario.
              </li>
              <li>
                Subsidio por nacimiento: presentar último recibo de sueldo,
                certificado de nacimiento y dni con fotocopia de ambos lados.
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
