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
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { updateData } from "@/services/mysql/functions";
import { toast } from "react-toastify";

export const ChangeExpiration = ({
  statement,
}: {
  statement: IDeclaracion;
}) => {
  const [newExpiration, setNewExpiration] = useState("");

  const handleChange = async () => {
    const formData = new FormData();

    formData.append("expiration", newExpiration);

    try {
      const result: any = await updateData(
        "statements/:id/expiration",
        statement.id,
        formData
      );

      if (result.ok) {
        toast.success("Fecha de vencimiento actualizada");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <CalendarClock />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Cambiar fecha de vencimiento
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Esta acción cambiara la fecha de vencimiento de la declaración
            jurada
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Label>
          Nueva fecha de vencimiento:
          <Input
            type="date"
            onChange={(e) => {
              setNewExpiration(e.target.value);
            }}
          />
        </Label>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleChange}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
