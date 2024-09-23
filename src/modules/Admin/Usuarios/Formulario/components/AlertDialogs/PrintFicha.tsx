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

      // Datos empleado
      page.drawText(data.apellido + " " + data.nombre, { x: 120, y: 600, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.cuil, { x: 120, y: 580, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.dni, { x: 120, y: 560, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.nacionalidad, { x: 120, y: 540, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.lugar_nacimiento, { x: 120, y: 520, size: 12, color: rgb(0, 0, 0) });
      page.drawText(formattedFechaNacimiento, { x: 120, y: 520, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.domicilio, { x: 120, y: 500, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.localidad, { x: 120, y: 480, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.codigo_postal, { x: 120, y: 460, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.provincia, { x: 120, y: 460, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.telefono, { x: 120, y: 440, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.fecha_ingreso, { x: 120, y: 420, size: 12, color: rgb(0, 0, 0) });
      page.drawText(data.correo_electronico, { x: 120, y: 420, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.estado_civil, { x: 120, y: 400, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.cantidad_hijos, { x: 120, y: 380, size: 12, color: rgb(0, 0, 0) });

      // Datos empleador
      page.drawText(data.empresa, { x: 120, y: 360, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.telefono_empresa, { x: 120, y: 340, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.domicilio_empresa, { x: 120, y: 340, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.localidad_empresa, { x: 120, y: 320, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.codigo_postal_empresa, { x: 120, y: 320, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.provincia_empresa, { x: 120, y: 300, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.cuit, { x: 120, y: 280, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(data.numero_agencia, { x: 120, y: 260, size: 12, color: rgb(0, 0, 0) });

      page.drawText(data.objetivo, { x: 120, y: 240, size: 12, color: rgb(0, 0, 0) });

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
