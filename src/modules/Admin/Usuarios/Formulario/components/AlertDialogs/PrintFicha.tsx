import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { DownloadIcon } from "lucide-react";
import { saveAs } from "file-saver";
import { PDFDocument, rgb } from "pdf-lib";
import { useState } from "react";

export const PrintFicha = ({ data }: { data: IFormulario }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      // Cargar el PDF desde la carpeta public
      const existingPdfBytes = await fetch("/ficha-uesevi-1.pdf").then(res => res.arrayBuffer());

      // Cargar el PDF con pdf-lib
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Obtener la primera página del PDF
      const page = pdfDoc.getPage(0);

      // Formatear fecha_nacimiento a string
      const formattedFechaNacimiento = data.fecha_nacimiento
        ? new Date(data.fecha_nacimiento).toLocaleDateString("es-ES")
        : "";

      // Formatear fecha_ingreso a string
      const formattedFechaIngreso = data.fecha_ingreso
      ? new Date(data.fecha_ingreso).toLocaleDateString("es-ES")
      : "";

      // Formatear codigo_postal_empresa a string
      const formattedCodigoPostalEmpresa = data.codigo_postal_empresa
        ? data.codigo_postal_empresa.toString()
        : "0";

      // Formatear codigo_postal_empresa a string
      const formattedCantidadHijos = data.cantidad_hijos
        ? data.cantidad_hijos.toString()
        : "";

      // Formatear codigo_postal_empresa a string
      const formattedNumeroAgencia = data.numero_agencia
        ? data.numero_agencia.toString()
        : "0";

      // Datos empleado
      page.drawText(data.id.toString(), { x: 335, y: 762, size: 14, color: rgb(0, 0, 0) });
      page.drawText(data.apellido + " " + data.nombre, { x: 210, y: 638, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.cuil, { x: 77, y: 618, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.dni, { x: 200, y: 618, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.nacionalidad, { x: 415, y: 618, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.lugar_nacimiento + " - " + formattedFechaNacimiento, { x: 280, y: 596, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.domicilio, { x: 119, y: 574, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.localidad, { x: 443, y: 574, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.codigo_postal, { x: 63, y: 552, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.provincia, { x: 235, y: 552, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.telefono, { x: 410, y: 552, size: 12, color: rgb(0, 0, 0) });
      page.drawText(formattedFechaIngreso, { x: 200, y: 532, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.correo_electronico, { x: 320, y: 532, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.estado_civil, { x: 138, y: 510, size: 12, color: rgb(0, 0, 0) });
      page.drawText(formattedCantidadHijos, { x: 443, y: 510, size: 12, color: rgb(0, 0, 0) });

      // // Datos empleador
      page.drawText(data.empresa, { x: 150, y: 407, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.telefono_empresa, { x: 415, y: 407, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.domicilio_empresa, { x: 132, y: 385, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.localidad_empresa, { x: 445, y: 385, size: 12, color: rgb(0, 0, 0) });
      page.drawText(formattedCodigoPostalEmpresa, { x: 63, y: 365, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.provincia_empresa, { x: 235, y: 365, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.cuit_empresa, { x: 363, y: 364, size: 12, color: rgb(0, 0, 0) });
      page.drawText(formattedNumeroAgencia, { x: 200, y: 345, size: 12, color: rgb(0, 0, 0) });

      page.drawText(data.objetivo, { x: 120, y: 95, size: 12, color: rgb(0, 0, 0) });

      // Generar el PDF actualizado
      const pdfBytes = await pdfDoc.save();

      // Descargar el archivo PDF
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `Ficha_Afiliacion_${data.nombre}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2 bg-green-400 hover:bg-green-500" disabled={loading}>
          {loading ? "Generando..." : <>Ficha de afiliación <DownloadIcon/></>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desea descargar y generar la ficha de afiliación?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDownload} disabled={loading}>
            Descargar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
