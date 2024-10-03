"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Shield,
  DollarSign,
  Users,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ScalesPreview = () => {
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
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Escalas Salariales y Derecho Laborales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <DollarSign className="w-10 h-10 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">
                    Remuneraciones Justas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Accede a información detallada sobre las remuneraciones en
                    el sector.
                  </p>
                </div>
              </div>
              <Button asChild variant="default" className="w-full">
                <Link
                  href="/escalas"
                  className="inline-flex items-center justify-center"
                >
                  Ver Escalas Salariales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Derechos Laborales</h3>
                  <p className="text-sm text-muted-foreground">
                    Convenio Colectivo de Trabajo N° 762/19
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <a
                  href="convenioConvenio Colectivo de Trabajo N° 762-19.pdf"
                  className="inline-flex items-center justify-center"
                  download
                >
                  <Download className="mr-2 h-5 w-5" />
                  Descargar Convenio
                </a>
              </Button>
            </div>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <FileText className="w-4 h-4" />
              <span>
                Incluye archivos de declaraciones salariales actualizados
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant="outline" className="text-muted-foreground">
            Actualizado {month} {year}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScalesPreview;
