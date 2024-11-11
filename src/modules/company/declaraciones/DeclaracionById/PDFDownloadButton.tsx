import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const PDFDownloadComponent = dynamic(
  () => import("./PDFGenerator").then((mod) => mod.PDFDownloadComponent),
  {
    loading: () => <LoadingState />,
    ssr: false,
  }
);

const LoadingState = () => {
  return (
    <Card className="w-64">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <div className="space-y-2 text-center">
            <h3 className="text-sm font-medium">Generando PDF</h3>
            <p className="text-xs text-gray-500">
              Esto puede tomar unos momentos...
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-blue-500 h-1 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PDFDownloadButton = ({ data, rate, basicSalary }: { data: any, rate: any, basicSalary: any }) => {
  const [showPDF, setShowPDF] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrepare = () => {
    setIsGenerating(true);
    setShowPDF(true);
  };

  return (
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
            'Preparar PDF'
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
  );
};

export default PDFDownloadButton;