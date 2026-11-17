import Link from "next/link";
import { Clock, FileText, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FramerComponent } from "@/shared/Framer/FramerComponent";

// Reemplaza al formulario de afiliación que había acá. UESEVI pidió (11/2026)
// que la ficha deje de completarse desde el sitio: ahora la carga el personal
// del sindicato desde el panel admin cuando la persona se presenta en la sede.
export const ComoAfiliarse = () => {
  return (
    <FramerComponent
      animationInitial={{ opacity: 0 }}
      animationAnimate={{ opacity: 1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>¿Cómo me afilio?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            La afiliación se hace en forma presencial en la sede sindical. Ahí
            completamos tu ficha de afiliación junto con vos.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <FileText className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
              <span>
                Traé tu <strong>DNI físico</strong> y tu{" "}
                <strong>recibo de haberes</strong>.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
              <span>
                <strong>Mariano Moreno 58</strong>, Rosario, Santa Fe.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
              <span>Lunes a viernes, de 9 a 14 h.</span>
            </li>
          </ul>
          <Button asChild variant="outline">
            <Link href="/contacto">¿Tenés dudas? Escribinos</Link>
          </Button>
        </CardContent>
      </Card>
    </FramerComponent>
  );
};
