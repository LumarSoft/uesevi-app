"use client";
import React from "react";
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

export const InputFile = () => {
  const handleUpload = async () => {};

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
        <Input type="file" />
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload}>Cargar</Button>
      </CardFooter>
    </Card>
  );
};
