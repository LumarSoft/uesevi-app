"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { postData, fetchData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileSpreadsheet, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { REQUIRED_COLUMNS, CATEGORIAS_PERMITIDAS } from "../../../../empleados/importacion/constants/excelSchema";
import {
  validateStatementRows,
  type RowError,
} from "@/shared/utils/validateStatementRows";
import StatementErrorsPanel from "@/shared/components/StatementErrorsPanel";
export const InputFile = ({ statement }: { statement: IInfoDeclaracion }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { user } = userStore();
  const router = useRouter();
  // Errores de la última carga (validación local o respuesta de la API).
  const [errors, setErrors] = useState<RowError[]>([]);
  const errorsRef = useRef<HTMLDivElement | null>(null);

  // Si la carga falla, llevamos la vista al detalle de errores: el panel queda
  // debajo del selector de archivo y en pantallas chicas no se ve.
  useEffect(() => {
    if (errors.length > 0) {
      errorsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors]);

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
      }

      // La API vuelve a validar el archivo y puede devolver el detalle fila por
      // fila; si no, mostramos el motivo que informó el servidor.
      setErrors(
        Array.isArray(result.errors) && result.errors.length > 0
          ? result.errors
          : [
              {
                fila: null,
                campo: null,
                mensaje:
                  result.message ||
                  "El servidor rechazó la rectificación. No se guardó ningún dato.",
              },
            ]
      );
      return false;
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setErrors([
        {
          fila: null,
          campo: null,
          mensaje:
            "No se pudo contactar al servidor. La rectificación no se guardó: revisá tu conexión e intentá de nuevo.",
        },
      ]);
      return false;
    }
  };

  // Función para cambiar el archivo seleccionado
  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors([]);
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

      // Categorías REALES del sistema (GET /category). Si la API no responde se
      // usa la lista local como fallback para no bloquear la carga.
      const categoriasResult = await fetchData("category");
      const categoriasValidas: string[] =
        categoriasResult?.ok && Array.isArray(categoriasResult.data)
          ? categoriasResult.data
              .map((c: any) => c?.nombre)
              .filter((n: any): n is string => Boolean(n))
          : CATEGORIAS_PERMITIDAS;

      // Validamos TODAS las filas con las mismas reglas que aplica la API.
      const validationErrors = validateStatementRows(
        formattedData,
        categoriasValidas
      );

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return false;
      }

      setErrors([]);

      // Aquí se lo enviamos a la función para enviar a la API y esperamos a que termine
      return await sendJson(formattedData); // Retorna el resultado de sendJson
    } catch (error) {
      console.error(error);
      setErrors([
        {
          fila: null,
          campo: null,
          mensaje:
            "No se pudo leer el archivo. Verificá que sea un Excel válido (.xlsx o .xls) y que la primera hoja tenga los datos.",
        },
      ]);
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

    // Solo confirmamos si la API respondió OK: antes se avisaba "Archivo subido
    // correctamente" aunque el backend hubiera hecho rollback.
    if (isFinish) {
      toast.success("Declaración jurada rectificada correctamente");
      return router.push("/empresa/declaraciones");
    }

    toast.error(
      "No se pudo rectificar la declaración jurada. Revisá el detalle de errores.",
      { autoClose: 8000 }
    );
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
      setErrors([]);
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
    setErrors([]);
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

        {/* Detalle de errores de la última carga */}
        <div ref={errorsRef}>
          <StatementErrorsPanel
            errors={errors}
            title="No se pudo rectificar la declaración jurada"
            onDismiss={() => setErrors([])}
          />
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
