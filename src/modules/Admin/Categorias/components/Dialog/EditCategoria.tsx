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

import React from "react";
import { toast } from "react-toastify";

export const EditCategory = ({
  data,
  onDateUpdate,
}: {
  data: ICategoria;
  onDateUpdate: (deleteItem: ICategoria) => void;
}) => {
  const [name, setName] = React.useState(data.nombre);
  const [salary, setSalary] = React.useState(data.sueldo_basico);
  const [presentismo, setPresentismo] = React.useState(data.presentismo ?? "");

  // Base del aporte solidario: sueldo básico + presentismo de la categoría.
  const aporteSolidario =
    ((Number(salary) || 0) + (Number(presentismo) || 0)) * 0.02;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !salary) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("salary", salary);
    // Se manda siempre, incluso vacío: "" limpia el monto (queda en NULL).
    formData.append("presentismo", presentismo);

    const result = await updateData("category/:id", data.id, formData);

    if (result.ok) {
      toast.success("Categoria actualizada");
      onDateUpdate({
        ...data,
        nombre: name,
        sueldo_basico: salary,
        presentismo: presentismo === "" ? null : presentismo,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Editar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              Editar categoria
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Se editara la categoria {data.nombre}
            </AlertDialogDescription>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Nombre de la categoria</Label>
              <Input
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Sueldo basico</Label>
              <Input
                placeholder="Sueldo"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value.toString())}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Presentismo</Label>
              <Input
                placeholder="Presentismo"
                type="number"
                value={presentismo}
                onChange={(e) => setPresentismo(e.target.value.toString())}
              />
              <p className="text-xs text-muted-foreground">
                Aporte solidario resultante:{" "}
                <span className="font-semibold">
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }).format(aporteSolidario)}
                </span>{" "}
                — 2% de (sueldo básico + presentismo). Si se deja vacío, el
                aporte se calcula sólo sobre el sueldo básico.
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit">Guardar</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
