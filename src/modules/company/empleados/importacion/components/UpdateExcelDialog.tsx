import React, { useState, useEffect } from "react";
import { AlertCircle, FileDown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const UpdatedExcelDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the user has seen this notification before
    const hasSeenNotification = localStorage.getItem(
      "excelUpdateNotificationSeen"
    );

    if (!hasSeenNotification) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("excelUpdateNotificationSeen", "true");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-red-700">
            <AlertCircle className="h-6 w-6" />
            Actualización importante: Nuevo formato de Excel
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-gray-700">
            Se ha actualizado el formato de la planilla con campos adicionales
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 p-4 rounded-md border border-red-200 my-2">
          <p className="text-red-800 font-medium">
            Para continuar subiendo declaraciones juradas, debe utilizar el
            nuevo formato que incluye los campos actualizados.
          </p>
          <p className="mt-2 text-red-700">
            El formato anterior ya no será compatible y ocasionará errores
            durante la carga.
          </p>
        </div>

        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-3">
          <a href="/importar-ejemplo.xlsx" download>
            <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2 w-full sm:w-auto">
              <FileDown className="h-4 w-4" />
              Descargar nuevo modelo
            </Button>
          </a>
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Entendido, no mostrar de nuevo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatedExcelDialog;
