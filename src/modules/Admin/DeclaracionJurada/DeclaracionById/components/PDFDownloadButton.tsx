import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PDFDownloadComponent = dynamic(
  () => import("./PDFGenerator").then((mod) => mod.PDFDownloadComponent),
  {
    loading: () => <LoadingState />,
    ssr: false,
  }
);

const LoadingState = () => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-96 border-none shadow-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6 p-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <div className="space-y-3 text-center">
              <h3 className="text-lg font-medium">Preparando su archivo PDF</h3>
              <p className="text-sm text-gray-500">
                Este proceso puede demorar unos minutos.
                <b>Por favor sea paciente, NO cierre esta ventana.</b>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PDFDownloadButton = ({
  data,
  rate,
  basicSalary,
}: {
  data: any;
  rate: any;
  basicSalary: any;
}) => {
  const [showPDF, setShowPDF] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Si isGenerating cambia a true, mostramos el overlay por un mínimo de 2 segundos
    if (isGenerating) {
      setShowOverlay(true);
      const minLoadingTimer = setTimeout(() => {
      }, 2000);
      return () => clearTimeout(minLoadingTimer);
    } else {
      // Cuando isGenerating es false, esperamos un pequeño delay antes de ocultar el overlay
      const hideOverlayTimer = setTimeout(() => {
        setShowOverlay(false);
      }, 5000);
      return () => clearTimeout(hideOverlayTimer);
    }
  }, [isGenerating]);

  const handlePrepare = async () => {
    setIsGenerating(true);

    try {
      // Iniciamos la generación del PDF inmediatamente
      await new Promise((resolve) => {
        setShowPDF(true);
        resolve(true);
      });
    } finally {
      // Una vez completado, quitamos el estado de generación
      setIsGenerating(false);
    }
  };

  return (
    <>
      {showOverlay && <LoadingState />}
      <div className="flex justify-center">
        {!showPDF ? (
          <Button
            onClick={handlePrepare}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparando...
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Preparar PDF
              </>
            )}
          </Button>
        ) : (
          <PDFDownloadComponent
            data={data}
            basicSalary={basicSalary}
            rate={rate}
          />
        )}
      </div>
    </>
  );
};

export default PDFDownloadButton;
