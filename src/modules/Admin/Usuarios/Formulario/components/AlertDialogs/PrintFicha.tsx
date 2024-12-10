import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { DownloadIcon } from "lucide-react";
import { saveAs } from "file-saver";
import { PDFDocument, rgb } from "pdf-lib";
import { useState } from "react";

export const PrintFicha = ({ data }: { data: IFormulario }) => {
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0000-00-00" || dateString === null) {
      return ""; // Devuelve un espacio vacío si la fecha no es válida
    }
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const toUpperCase = (text?: string) => {
    return text ? text.toUpperCase() : "";
  };

  const handleDownload = async () => {
    setLoading(true);

    try {
      const existingPdfBytes = await fetch("/ficha-uesevi-1.pdf").then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const page = pdfDoc.getPage(0);

      const formattedFechaNacimiento = formatDate(data.fecha_nacimiento);
      const formattedFechaIngreso = formatDate(data.fecha_ingreso);
      const formattedCodigoPostalEmpresa = data.cod_postal_empresa
        ? data.cod_postal_empresa.toString()
        : "0";

      const lugarNacimiento = toUpperCase(data.lugar_nacimiento);
      const fechaNacimiento = toUpperCase(formattedFechaNacimiento);

      const textoLugarFecha =
        lugarNacimiento && fechaNacimiento
          ? `${lugarNacimiento} - ${fechaNacimiento}`
          : lugarNacimiento || fechaNacimiento;

      page.drawText(toUpperCase(data.apellido) + " " + toUpperCase(data.nombre), {
        x: 210,
        y: 638,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.cuil), {
        x: 77,
        y: 618,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.dni), {
        x: 200,
        y: 618,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.nacionalidad), {
        x: 415,
        y: 618,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(textoLugarFecha, {
        x: 280,
        y: 596,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.domicilio), {
        x: 119,
        y: 574,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.localidad), {
        x: 443,
        y: 574,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.codigo_postal), {
        x: 63,
        y: 552,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.provincia), {
        x: 235,
        y: 552,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.telefono), {
        x: 410,
        y: 552,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(formattedFechaIngreso), {
        x: 200,
        y: 532,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.correo_electronico), {
        x: 320,
        y: 532,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.estado_civil), {
        x: 138,
        y: 510,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(data.cantidad_hijos.toString(), {
        x: 443,
        y: 510,
        size: 12,
        color: rgb(0, 0, 0),
      });

      page.drawText(toUpperCase(data.empresa), {
        x: 150,
        y: 407,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.categoria), {
        x: 130,
        y: 385,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.telefono_empresa), {
        x: 132,
        y: 364,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.domicilio_empresa), {
        x: 360,
        y: 364,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.localidad_empresa), {
        x: 140,
        y: 341,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(formattedCodigoPostalEmpresa), {
        x: 300,
        y: 341,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.provincia_empresa), {
        x: 465,
        y: 341,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.cuit_empresa), {
        x: 85,
        y: 319,
        size: 12,
        color: rgb(0, 0, 0),
      });
      page.drawText(toUpperCase(data.objetivo), {
        x: 120,
        y: 95,
        size: 12,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `Ficha_Afiliacion_${toUpperCase(data.nombre)}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="flex gap-2 bg-green-400 hover:bg-green-500"
          disabled={loading}
        >
          {loading ? (
            "Generando..."
          ) : (
            <>
              FICHA DE AFILIACIÓN <DownloadIcon />
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿DESEA DESCARGAR Y GENERAR LA FICHA DE AFILIACIÓN?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>CANCELAR</AlertDialogCancel>
          <AlertDialogAction onClick={handleDownload} disabled={loading}>
            DESCARGAR
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
