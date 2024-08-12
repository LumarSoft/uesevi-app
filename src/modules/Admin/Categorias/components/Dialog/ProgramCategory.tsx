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
import { ICategoria } from "@/shared/types/Querys/ICategorias";
import { useState } from "react";
import { toast } from "react-toastify";

export const ProgramCategory = ({
  data,
  onDataUpdate,
}: {
  data: ICategoria;
  onDataUpdate: (deleteItem: ICategoria) => void;
}) => {
  const [fechaCambio, setFechaCambio] = useState<string | null>(
    data.fecha_vigencia
  );
  const [sueldoFuturo, setSueldoFuturo] = useState<string | null>(
    data.sueldo_futuro
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaCambio || !sueldoFuturo) {
      return;
    }

    const formData = new FormData();
    formData.append("sueldo_futuro", sueldoFuturo);
    formData.append("fecha_futuro", fechaCambio);

    const result = await updateData(
      "categorias/salario-futuro",
      data.id,
      formData
    );

    if (result.affectedRows > 0) {
      onDataUpdate({
        ...data,
        sueldo_futuro: sueldoFuturo,
        fecha_vigencia: fechaCambio,
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
                onChange={(e) => setFechaCambio(e.target.value)}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Sueldo basico</Label>
              <Input
                placeholder="Sueldo"
                type="number"
                value={sueldoFuturo || ""}
                onChange={(e) => setSueldoFuturo(e.target.value.toString())}
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
