"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Shield, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ScalesPreview() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <div className="w-full px-4 md:px-28 2xl:px-80 mx-auto py-24">
      <Card
        className={` overflow-hidden transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            Escalas Salariales del Gremio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <DollarSign className="w-10 h-10 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Remuneraciones Justas</h3>
                <p className="text-sm text-muted-foreground">
                  Conoce los salarios del sector
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Derechos Laborales</h3>
                <p className="text-sm text-muted-foreground">
                  Información crucial para tu carrera
                </p>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Accede a información detallada sobre las remuneraciones en el sector
            de seguridad y vigilancia. Conoce tus derechos y posiciónate
            estratégicamente en tu carrera profesional.
          </p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>Incluye archivos de declaraciones salariales actualizados</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link
              href="/escalas"
              className="inline-flex items-center justify-center"
            >
              Ver Escalas Salariales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Badge variant="outline" className="text-muted-foreground">
            Actualizado {month} {year}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
