import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IEscalas } from "@/shared/types/IEscalas";
import { Label } from "@radix-ui/react-label";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { updateData } from "@/services/mysql/functions";

export const EditScalesDialog = ({
  data,
  onDataUpdate,
}: {
  data: IEscalas;
  onDataUpdate: (updatedItem: IEscalas) => void;
}) => {
  const [newName, setNewName] = useState(data.nombre);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    if (newName === data.nombre) {
      return;
    }

    const formData = new FormData();
    formData.append("name", newName);

    const result = await updateData("scales/update-escala", data.id, formData);

    if (result.ok) {
      onDataUpdate({ ...data, nombre: newName });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          Editar <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Editar Escala
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="created">Fecha de creación</Label>
              <Input
                type="text"
                id="created"
                name="created"
                value={data.created.toString()}
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
