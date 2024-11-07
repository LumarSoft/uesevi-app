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

export const PayDate = ({
  data,
  rates,
}: {
  data: IDeclaracion;
  rates: string;
}) => {
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

  const calculateIntereses = () => {
    // Aca va a haber dos opciones: Tenemos fecha de pago definido en la declaracion jurada y calculamos la fecha de vencimiento sobre la fecha de pago y ahi sacamos el interés. O no tenemos la fecha de pago declarada, por lo tanto calculamos la fecha de vencimiento sobre la fecha actual
    const fechaVencimiento = new Date(data.vencimiento);

    const fechaPago = data.fecha_pago ? new Date(data.fecha_pago) : null;

    const fechaActual = new Date();

    //En caso que fechaPago sea null. Calculamos el interés viendo la diferencia de Dias de la fecha de vencimiento y la actual
    if (!fechaPago) {
      const diffTime = Math.abs(
        fechaVencimiento.getTime() - fechaActual.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

      const interes = (Number(data.importe) * Number(rates) * diffDays) / 1000;

      return interes.toFixed(2);
    } else {
      //En caso que fechaPago no sea null. Calculamos el interés viendo la diferencia de Dias de la fecha de vencimiento y la fecha de pago
      const diffTime = Math.abs(
        fechaVencimiento.getTime() - fechaPago.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

      const interes = (Number(data.importe) * Number(rates) * diffDays) / 100;

      return interes.toFixed(2);
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
          <DialogTitle className="text-center">
            Modificar fecha de pago
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <div>
              <Label>Subtotal</Label>
              <Input disabled value={data.subtotal ?? ""} />
            </div>
            <div>
              <Label>Fecha de vencimiento</Label>
              <Input
                disabled
                value={
                  new Date(data.vencimiento).toLocaleDateString("es-AR") ?? ""
                }
              />
            </div>
            <div>
              <Label>Intereses </Label>
              <Input disabled value={calculateIntereses()} />
              {data.fecha_pago === null ? (
                <span>
                  Como no esta definido una fecha de pago el interés se calcula
                  entre el vencimiento y la fecha actual
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <Label>Fecha de pago</Label>
              <Input
                disabled
                value={
                  data.fecha_pago
                    ? new Date(data.fecha_pago).toLocaleDateString("es-AR")
                    : "No definido"
                }
              />
            </div>
            <div>
              <Label>Total a pagar</Label>
              <Input
                disabled
                value={(
                  Number(data.importe) + Number(calculateIntereses())
                ).toString()}
              />
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
