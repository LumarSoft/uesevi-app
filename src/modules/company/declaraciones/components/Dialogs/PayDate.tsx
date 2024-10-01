import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateData } from "@/services/mysql/functions";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { Calendar } from "lucide-react";

import React, { useState } from "react";
import { toast } from "react-toastify";

export const PayDate = ({ data }: { data: IDeclaracion }) => {
  const [newDate, setNewDate] = useState("");

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("fecha", newDate);

    try {
      const result = await updateData(
        "statements/:id/date-payment",
        data.id,
        formData
      );

      console.log(result);
      if (result.ok) {
        toast.success("Fecha de pago actualizada");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Calendar />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modificar fecha de pago?</DialogTitle>
          <DialogDescription className="space-y-4">
            <div>
              <Label>Subtotal</Label>
              <Input disabled value={data.subtotal ?? ""} />
            </div>
            <div>
              <Label>Intereses</Label>
              <Input disabled value={data.interes ?? ""} />
            </div>
            <div>
              <Label>Total a pagar</Label>
              <Input disabled value={data.importe ?? ""} />
            </div>
            <div>
              <h6>Nueva fecha de pago</h6>
              <Input type="date" onChange={(e) => setNewDate(e.target.value)} />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" className="w-full" onClick={handleSave}>
              Guardar cambios
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
