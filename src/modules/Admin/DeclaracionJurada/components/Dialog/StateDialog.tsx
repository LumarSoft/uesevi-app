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
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

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
  const [partialPayment, setPartialPayment] = useState(0);

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

    if (newState === 2) {
      formData.append("partial_payment", String(partialPayment));
    }

    try {
      const result: any = await updateData(
        "statements/:id/state",
        statement.id,
        formData
      );


      if (result.ok) {
        changeState({ ...statement, estado: newState });
        toast.success("Estado actualizado");
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
            Esta acción cambiara el estado de la declaración en la base de datos
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
        {newState === 2 && (
          <Label>
            Monto del pago parcial:
            <Input
              type="number"
              onChange={(e) => {
                setPartialPayment(Number(e.target.value));
              }}
            />
          </Label>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleChange}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
