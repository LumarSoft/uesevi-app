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
  // Se usa la variante `_input` (yyyy-MM-dd): la otra viene en "dd/MM/yy HH:mm"
  // y el <input type="date"> la descarta, dejando el campo vacío.
  const [dateChange, setDateChange] = useState<string | null>(
    data.fecha_vigencia_input
  );
  const [futureSalary, setFutureSalary] = useState<string | null>(
    data.sueldo_futuro
  );
  const [datePresentismo, setDatePresentismo] = useState<string | null>(
    data.fecha_vigencia_presentismo_input
  );
  const [futurePresentismo, setFuturePresentismo] = useState<string | null>(
    data.presentismo_futuro
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Los dos bloques son independientes: se puede programar sólo el sueldo,
    // sólo el presentismo o ambos. Cada uno necesita monto + fecha.
    const programaSueldo = Boolean(dateChange && futureSalary);
    const programaPresentismo = Boolean(datePresentismo && futurePresentismo);

    if (!programaSueldo && !programaPresentismo) {
      return toast.error(
        "Completá monto y fecha de vigencia de al menos uno de los dos."
      );
    }

    const formData = new FormData();
    if (programaSueldo) {
      formData.append("futureSalary", futureSalary as string);
      formData.append("dateChange", dateChange as string);
    }
    if (programaPresentismo) {
      formData.append("futurePresentismo", futurePresentismo as string);
      formData.append("datePresentismo", datePresentismo as string);
    }

    const result = await updateData(
      "category/:id/future-salary",
      data.id,
      formData
    );

    if (result.ok) {
      onDataUpdate({
        ...data,
        ...(programaSueldo && {
          sueldo_futuro: futureSalary,
          fecha_vigencia: dateChange,
          fecha_vigencia_input: dateChange,
        }),
        ...(programaPresentismo && {
          presentismo_futuro: futurePresentismo,
          fecha_vigencia_presentismo: datePresentismo,
          fecha_vigencia_presentismo_input: datePresentismo,
        }),
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
                type="date"
                value={dateChange || ""}
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

            <div className="mt-2 border-t pt-3">
              <p className="mb-2 text-xs text-muted-foreground">
                Presentismo futuro (opcional, con su propia vigencia).
              </p>
              <div className="grid w-full items-center gap-1.5">
                <Label>Fecha vigencia del presentismo futuro</Label>
                <Input
                  type="date"
                  value={datePresentismo || ""}
                  onChange={(e) => setDatePresentismo(e.target.value)}
                />
              </div>
              <div className="mt-2 grid w-full items-center gap-1.5">
                <Label>Presentismo</Label>
                <Input
                  placeholder="Presentismo"
                  type="number"
                  value={futurePresentismo || ""}
                  onChange={(e) =>
                    setFuturePresentismo(e.target.value.toString())
                  }
                />
              </div>
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
