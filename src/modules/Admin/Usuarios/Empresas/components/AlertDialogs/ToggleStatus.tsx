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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const ToggleStatus = ({
  data,
  onDataUpdate,
}: {
  data: IEmpresa;
  onDataUpdate: (updateItem: IEmpresa) => void;
}) => {
  const [newState, setNewState] = useState(data.estado);

  const handleChange = async () => {
    const result = await updateData("empresas/change-state", data.id, {
      estado: data.estado === "Activo" ? "Inactivo" : "Activo",
    });

    if (result !== undefined && result !== null) {
      onDataUpdate({
        ...data,
        estado: newState,
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
            <Select onValueChange={setNewState}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
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
