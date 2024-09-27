import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { BASE_API_URL } from "@/shared/providers/envProvider";
import { IEscalas } from "@/shared/types/Querys/IEscalas";

export default function EscalasModule({ scales }: { scales: IEscalas[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
        viewport: { once: true, offset: 0.4 },
      },
    },
  };

  const itemAnimado = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };
  return (
    <div className="container mx-auto px-4 py-28">
      <h1 className="text-4xl font-bold text-center mb-8">
        Escalas Salariales
      </h1>
      <FramerComponent
        style="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        animationVariants={container}
        animationInitial="hidden"
        animationWhileInView="show"
        animationViewPort={{ once: true, offset: 0.4 }}
      >
        {scales.map((escala, index) => (
          <FramerComponent
            key={index}
            animationInitial={{ opacity: 0, y: 50 }}
            animationVariants={itemAnimado}
          >
            <a
              href={`${BASE_API_URL}/uploads/${escala.imagen}`}
              download
              className="h-full"
            >
              <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-primary hover:text-primary-foreground cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{escala.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground group-hover:text-white">
                    Archivo: {escala.imagen}
                  </p>
                </CardContent>
              </Card>
            </a>
          </FramerComponent>
        ))}
      </FramerComponent>
    </div>
  );
}
