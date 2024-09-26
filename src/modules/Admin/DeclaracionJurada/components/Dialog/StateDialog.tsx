import React, { useState } from "react";
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
import { DollarSign } from "lucide-react";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateData } from "@/services/mysql/functions";

export const StateDialog = ({
  statement,
  changeState,
}: {
  statement: IDeclaracion;
  changeState: (updateItem: IDeclaracion) => void;
}) => {
  const [newState, setNewState] = useState<number | undefined | null>(
    statement.estado
  );

  const SwitchEstado = (estado: number | null | undefined) => {
    estado = estado || 0;

    switch (estado) {
      case 0:
        return <span className="text-red-500">Pendiente</span>;
      case 1:
        return <span className="text-green-500">Aprobado</span>;
      case 2:
        return <span className="text-yellow-500">Pago parcial</span>;
      case 3:
        return <span className="text-blue-500">Rechazado</span>;
    }
  };

  const handleChange = async () => {
    const formData = new FormData();
    formData.append("state", String(newState));

    try {
      const result: any = await updateData(
        "statements/:id/state",
        statement.id,
        formData
      );

      if (result.message === "Estado de la declaración actualizado") {
        changeState({ ...statement, estado: newState });
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <DollarSign />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Cambiar estado
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Esta accion cambiara el estado de la declaracion en la base de datos
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>Estado actual: {SwitchEstado(statement.estado)}</div>
        <Label>
          Cambiar a:{" "}
          <Select onValueChange={(value) => setNewState(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Pendiente</SelectItem>
              <SelectItem value="1">Aprobado</SelectItem>
              <SelectItem value="2">Pago parcial</SelectItem>
              <SelectItem value="3">Rechazado</SelectItem>
            </SelectContent>
          </Select>
        </Label>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleChange}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
