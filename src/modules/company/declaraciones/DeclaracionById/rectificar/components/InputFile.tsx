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

export const InputFile = ({ statement }: { statement: IInfoDeclaracion }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = userStore();
  const router = useRouter();

  const sendJson = async (data: any[]) => {
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
      console.log(result)
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
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
      return newRow;
    });
  };

  // Función para procesar y subir el archivo Excel
  const uploadExcel = async (file: File) => {
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

      // Aca se lo enviamos a la funcion para enviar a la api y esperamos a que termine, cuando termine retornamos true
      await sendJson(formattedData);

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al subir el archivo");
      return false;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inserte un archivo formato XLSX</CardTitle>
        <CardDescription>
          Al cargar el archivo nos encargaremos de analizar cada fila y columna
          para guardar sus empleados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input type="file" onChange={changeFile} accept=".xlsx, .xls" />
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Cargando..." : "Cargar"}
        </Button>
      </CardFooter>
    </Card>
  );
};
