import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const ExcelPreview = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;

  // Agregar la columna Total bruto a los datos
  const dataWithTotal = data.map(row => {
    const sueldoBasico = Number(row["Sueldo Básico"]) || 0;
    const adicionales = Number(row["Adicionales"]) || 0;
    return {
      ...row,
      "Total bruto": sueldoBasico + adicionales
    };
  });

  // Obtener los headers incluyendo la nueva columna
  const headers = Object.keys(dataWithTotal[0]);

  return (
    <Card className="w-full mt-4">
      <div className="flex justify-between items-center p-4">
        <h3 className="text-lg font-semibold">Vista previa del archivo</h3>
      </div>

      <ScrollArea className="h-96">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className={
                  ["Sueldo Básico", "Adicionales", "Total bruto"].includes(header) 
                    ? "text-right" 
                    : ""
                }>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataWithTotal.map((row: any, index: any) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell 
                    key={header}
                    className={
                      ["Sueldo Básico", "Adicionales", "Total bruto"].includes(header) 
                        ? "text-right" 
                        : ""
                    }
                  >
                    {["Sueldo Básico", "Adicionales", "Total bruto"].includes(header)
                      ? Number(row[header]).toLocaleString('es-AR')
                      : row[header]?.toString() || ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default ExcelPreview;