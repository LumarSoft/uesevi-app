import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateData } from "@/services/mysql/functions";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { RefreshCcw } from "lucide-react";

export const ToggleStatus = ({
  data,
  onDataUpdate,
}: {
  data: IEmpresa;
  onDataUpdate: (updateItem: IEmpresa) => void;
}) => {

  const handleChange = async () => {
    const result = await updateData("empresas/change-state", data.id, {
      estado: data.estado === "Activo" ? "Inactivo" : "Activo",
    });

    if (result !== undefined && result !== null) {
      onDataUpdate({
        ...data,
        estado: data.estado === "Activo" ? "Inactivo" : "Activo",
      });
    } else {
      console.error("Failed to update status");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2">
          Estado <RefreshCcw />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Estas seguro de cambiar el estado?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esto cambiara el estado de la empresa {data.nombre} a{" "}
            {data.estado === "Activo" ? "Inactivo" : "Activo"} dentro del
            sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleChange}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
