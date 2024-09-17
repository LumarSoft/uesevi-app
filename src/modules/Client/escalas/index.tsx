import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_API_URL } from "@/shared/providers/envProvider";
import { IEscalas } from "@/shared/types/IEscalas";

export default function EscalasModule({ scales }: { scales: IEscalas[] }) {
  return (
    <div className="container mx-auto px-4 py-28">
      <h1 className="text-4xl font-bold text-center mb-8">
        Escalas Salariales
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scales.map((escala, index) => (
          <a
            href={`${BASE_API_URL}/uploads/${escala.imagen}`}
            key={index}
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
        ))}
      </div>
    </div>
  );
}
