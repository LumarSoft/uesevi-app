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

import React from "react";
import { toast } from "react-toastify";

const EditCategoria = ({
  data,
  onDateUpdate,
}: {
  data: ICategoria;
  onDateUpdate: (deleteItem: ICategoria) => void;
}) => {
  const [nombre, setNombre] = React.useState(data.nombre);
  const [sueldo, setSueldo] = React.useState(data.sueldo_basico);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !sueldo) {
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("sueldo", sueldo);

    const result = await updateData(
      "categorias/update-categoria",
      data.id,
      formData
    );


    if (result.affectedRows > 0) {
      toast.success("Categoria actualizada");
      onDateUpdate({
        ...data,
        nombre,
        sueldo_basico: sueldo,
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
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Sueldo basico</Label>
              <Input
                placeholder="Sueldo"
                type="number"
                value={sueldo}
                onChange={(e) => setSueldo(e.target.value.toString())}
              />
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

export default EditCategoria;
