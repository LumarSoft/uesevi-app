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
import { X } from "lucide-react";

const ExcelPreview = ({
  data,
  onClose,
}: {
  data: any[];
  onClose: () => void;
}) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <Card className="w-full mt-4">
      <div className="flex justify-between items-center p-4">
        <h3 className="text-lg font-semibold">Vista previa del archivo</h3>
        <button onClick={onClose} className="text-red-300 hover:text-red-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <ScrollArea className="h-96">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row: any, index: any) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    {row[header]?.toString() || ""}
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
