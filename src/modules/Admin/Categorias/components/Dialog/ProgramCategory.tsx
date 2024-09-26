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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateData } from "@/services/mysql/functions";
import { ICategoria } from "@/shared/types/Querys/ICategory";
import { useState } from "react";
import { toast } from "react-toastify";

export const ProgramCategory = ({
  data,
  onDataUpdate,
}: {
  data: ICategoria;
  onDataUpdate: (deleteItem: ICategoria) => void;
}) => {
  const [dateChange, setDateChange] = useState<string | null>(
    data.fecha_vigencia
  );
  const [futureSalary, setFutureSalary] = useState<string | null>(
    data.sueldo_futuro
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateChange || !futureSalary) {
      return;
    }

    const formData = new FormData();
    formData.append("futureSalary", futureSalary);
    formData.append("dateChange", dateChange);

    const result = await updateData(
      "category/:id/future-salary",
      data.id,
      formData
    );

    if (result.ok) {
      onDataUpdate({
        ...data,
        sueldo_futuro: futureSalary,
        fecha_vigencia: dateChange,
      });
      toast.success("Programado con exito");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Programar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              Programar categoria
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Programa una categoria para un futuro
            </AlertDialogDescription>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Fecha vigencia del sueldo futuro</Label>
              <Input
                placeholder="Nombre"
                type="date"
                onChange={(e) => setDateChange(e.target.value)}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Sueldo basico</Label>
              <Input
                placeholder="Sueldo"
                type="number"
                value={futureSalary || ""}
                onChange={(e) => setFutureSalary(e.target.value.toString())}
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Guardar</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
