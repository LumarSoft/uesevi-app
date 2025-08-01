"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { postData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileSpreadsheet, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { REQUIRED_COLUMNS, CATEGORIAS_PERMITIDAS } from "../../../../empleados/importacion/constants/excelSchema";
export const InputFile = ({ statement }: { statement: IInfoDeclaracion }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { user } = userStore();
  const router = useRouter();

  const sendJson = async (data: any[]): Promise<boolean> => {
    const formData = new FormData();

    data.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        formData.append(`employees[${index}][${key}]`, value as any);
      });
    });

    formData.append("companyId", user.empresa.id);
    formData.append("statementId", statement.id.toString());
    formData.append("year", statement.year.toString());
    formData.append("month", statement.mes.toString());

    try {
      const result = await postData("statements/rectifications", formData);
      if (result.ok) {
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error al enviar los datos a la API");
      return false;
    }
  };

  // Función para cambiar el archivo seleccionado
  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Función para formatear las claves reemplazando espacios por guiones bajos
  const formatKeys = (data: any[]): any[] => {
    return data.map((row) => {
      const newRow: { [key: string]: any } = {};
      Object.keys(row).forEach((key) => {
        const newKey = key
          .toLowerCase() // Convertir a minúsculas (opcional)
          .replace(/\s+/g, "_") // Reemplazar espacios por "_"
          .replace(/[^\w_]/g, ""); // Eliminar caracteres no alfanuméricos excepto "_"
        newRow[newKey] = row[key];
      });
      
      REQUIRED_COLUMNS.forEach((col) => {
        if (col === "adicionales" && (newRow[col] === undefined || newRow[col] === "")) {
          newRow[col] = 0;
        }
      });
      
      return newRow;
    });
  };

  // Función para procesar y subir el archivo Excel
  const uploadExcel = async (file: File): Promise<boolean> => {
    try {
      const data = await new Promise<any[]>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
          if (!e.target) {
            return reject("No se pudo leer el archivo");
          }
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          resolve(data);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      const formattedData = formatKeys(data);

      // Validación de datos
      if (formattedData.length > 0) {
        // Validar que todas las columnas requeridas estén presentes
        const formattedColumns = Object.keys(formattedData[0]);
        const missingColumns = REQUIRED_COLUMNS.filter(
          (col) => !formattedColumns.includes(col)
        );

        if (missingColumns.length > 0) {
          toast.error(
            `Faltan columnas requeridas en el archivo: ${missingColumns.join(
              ", "
            )}`
          );
          return false;
        }

        // Validar tipos de datos y valores
        const errors: string[] = [];

        formattedData.forEach((row, index) => {
          // Ajustar el número de fila: índice + 2 (índice empieza en 0 + 1 para empezar en 1 + 1 por la fila de encabezado)
          const rowNumber = index + 2;

          // Validar CUIL (solo números)
          if (row.cuil && !/^\d+$/.test(String(row.cuil))) {
            errors.push(
              `Fila ${rowNumber}: El CUIL debe contener solo números`
            );
          }

          // Validar categoría (debe ser uno de los valores permitidos)
          if (
            row.categora &&
            !CATEGORIAS_PERMITIDAS.includes(String(row.categora).trim())
          ) {
            errors.push(
              `Fila ${rowNumber}: La categoría "${row.categora}" no es válida. Revise las opciones nuevamente`
            );
          }

          // Validar campos numéricos
          if (row.sueldo_bsico && isNaN(Number(row.sueldo_bsico))) {
            errors.push(
              `Fila ${rowNumber}: El sueldo básico debe ser un número`
            );
          } else if (row.sueldo_bsico && Number(row.sueldo_bsico) < 0) {
            errors.push(
              `Fila ${rowNumber}: El sueldo básico no puede ser negativo`
            );
          }

          if (row.adicionales && isNaN(Number(row.adicionales))) {
            errors.push(
              `Fila ${rowNumber}: Los adicionales deben ser un número`
            );
          } else if (row.adicionales && Number(row.adicionales) < 0) {
            errors.push(
              `Fila ${rowNumber}: Los adicionales no pueden ser negativos`
            );
          }

          if (
            row.suma_no_remunerativa &&
            isNaN(Number(row.suma_no_remunerativa))
          ) {
            errors.push(
              `Fila ${rowNumber}: El suma_no_remunerativa debe ser un número`
            );
          } else if (
            row.suma_no_remunerativa && Number(row.suma_no_remunerativa) <= 0
          ) {
            errors.push(
              `Fila ${rowNumber}: El suma_no_remunerativa debe ser un número positivo mayor a cero`
            );
          }

          // Validar que nombre y apellido no estén vacíos
          if (!row.nombre || String(row.nombre).trim() === "") {
            errors.push(`Fila ${rowNumber}: El nombre no puede estar vacío`);
          }

          if (!row.apellido || String(row.apellido).trim() === "") {
            errors.push(`Fila ${rowNumber}: El apellido no puede estar vacío`);
          }

          // Validar adherido_a_sindicato (debe ser booleano o convertible a booleano)
          const sindicatoValue = String(row.adherido_a_sindicato).toLowerCase();
          if (
            sindicatoValue !== "true" &&
            sindicatoValue !== "false" &&
            sindicatoValue !== "1" &&
            sindicatoValue !== "0" &&
            sindicatoValue !== "si" &&
            sindicatoValue !== "no"
          ) {
            errors.push(
              `Fila ${rowNumber}: Adherido a sindicato debe ser Sí/No, True/False o 1/0`
            );
          }
        });

        // Si hay errores, mostrarlos y detener el proceso
        if (errors.length > 0) {
          // Limitar a mostrar máximo 5 errores para no saturar la pantalla
          const displayErrors = errors.slice(0, 5);
          const remainingErrors = errors.length - 5;

          let errorMessage = displayErrors.join("\n");
          if (remainingErrors > 0) {
            errorMessage += `\n...y ${remainingErrors} errores más.`;
          }

          toast.error(errorMessage, {
            autoClose: 10000, // Dar más tiempo para leer los errores
          });
          return false;
        }
      } else {
        toast.error("El archivo no contiene datos");
        return false;
      }

      // Aquí se lo enviamos a la función para enviar a la API y esperamos a que termine
      return await sendJson(formattedData); // Retorna el resultado de sendJson
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al subir el archivo");
      return false; // Retorna false si hay un error
    }
  };

  // Función para manejar la subida del archivo
  const handleUpload = async () => {
    if (!file) {
      return toast.error("Por favor seleccione un archivo");
    }

    if (isUploading) {
      return toast.warning("Ya se está subiendo un archivo. Por favor espere.");
    }

    setLoading(true);
    setIsUploading(true);

    const isFinish = await uploadExcel(file);

    setLoading(false);
    setIsUploading(false);

    if (isFinish) {
      toast.success("Archivo subido correctamente");
      return router.push("/empresa/declaraciones");
    } else {
      toast.error("Hubo un problema al procesar el archivo");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer?.files[0];
    if (
      droppedFile &&
      (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))
    ) {
      setFile(droppedFile);
    } else {
      toast.error("Por favor, solo archivos Excel (.xlsx, .xls)");
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
    setFile(null);
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="px-8">
        <CardTitle className="text-2xl font-bold">
          Cargar Archivo Excel
        </CardTitle>
        <CardDescription className="text-base">
          Suba su archivo Excel con la información de los empleados. Aceptamos
          archivos .xlsx y .xls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-8">
        {/* Zona de drop */}
        <div className="relative">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-12 transition-all",
              "flex flex-col items-center justify-center gap-4",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary/50"
            )}
          >
            <input
              type="file"
              onChange={changeFile}
              accept=".xlsx, .xls"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {!file ? (
              <>
                <Upload className="w-12 h-12 text-gray-400" />
                <div className="text-center">
                  <p className="text-lg font-medium">
                    Arrastre su archivo aquí o haga clic para seleccionar
                  </p>
                  {/* <p className="text-sm text-gray-500 mt-2">
                    Tamaño máximo: 10MB
                  </p> */}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 w-full max-w-2xl">
                <FileSpreadsheet className="w-10 h-10 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex-shrink-0 z-20">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="relative"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alerta informativa */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Asegúrese de que su archivo Excel tenga los encabezados correctos y
            siga el formato establecido.
          </AlertDescription>
        </Alert>

        {/* Barra de progreso */}
        {loading && (
          <div className="space-y-2">
            <Progress value={66} className="h-2" />
            <p className="text-sm text-gray-500 text-center">
              Procesando archivo...
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-3 px-8 py-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="min-w-[120px]"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleUpload}
          disabled={loading || !file || isUploading}
          className="min-w-[120px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando
            </span>
          ) : isUploading ? (
            "Subiendo..."
          ) : (
            "Cargar archivo"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InputFile;
