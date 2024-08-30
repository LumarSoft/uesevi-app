import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateData } from "@/services/mysql/functions";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import React, { useEffect, useState } from "react";

const InteresesDialog = ({ declaracion }: { declaracion: IDeclaracion }) => {
  const [nuevaFecha, setNuevaFecha] = useState(declaracion.fecha_pago);

  const subtotal = parseFloat(declaracion.subtotal ?? "0");
  const interes = parseFloat(declaracion.interes ?? "0");
  const total = subtotal + interes;

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("fecha", String(nuevaFecha));

    try {
      const resullt = await updateData(
        "declaraciones/changeDatePayment",
        declaracion.id,
        formData
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chart-no-axes-combined"
          >
            <path d="M12 16v5" />
            <path d="M16 14v7" />
            <path d="M20 10v11" />
            <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
            <path d="M4 18v3" />
            <path d="M8 14v7" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Calcular intereses
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <Label>
            Empresa
            <Input disabled value={declaracion.nombre_empresa} />
          </Label>
          <Label>
            Mes y año
            <Input
              disabled
              value={`${declaracion.mes} - ${declaracion.year}`}
            />
          </Label>
          <Label>
            Vencimiento
            <Input disabled value={declaracion.vencimiento ?? ""} />
          </Label>
          <Label>
            Fecha de pago
            <Input disabled value={declaracion.fecha_pago ?? ""} />
          </Label>
          <Label>
            Subtotal
            <Input disabled value={declaracion.subtotal ?? ""} />
          </Label>
          <Label>
            Intereses
            <Input disabled value={declaracion.interes ?? ""} />
          </Label>
          <Label>
            Total
            <Input disabled value={total.toFixed(2)} />
          </Label>
        </div>
        <div>
          <h4>Nueva fecha de pago</h4>
          <Input type="date" onChange={(e) => setNuevaFecha(e.target.value)} />
        </div>
        <DialogFooter className="w-full">
          <DialogClose className="w-full">
            <Button className="w-full" variant={"destructive"}>Cerrar</Button>
          </DialogClose>
          <DialogClose className="w-full">
            <Button className="w-full" onClick={handleSave}>
              Guardar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InteresesDialog;
